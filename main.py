import asyncio
import os
from typing import Any

import httpx
import stripe
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr


SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
CHECKOUT_SUCCESS_URL = os.getenv("CHECKOUT_SUCCESS_URL", "http://localhost:3000/success")
CHECKOUT_CANCEL_URL = os.getenv("CHECKOUT_CANCEL_URL", "http://localhost:3000/cancel")
SUPABASE_TABLE_NAME = os.getenv("SUPABASE_TABLE_NAME", "profiles")

stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI(title="ILOVEREPOST Billing API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CheckoutSessionRequest(BaseModel):
    email: EmailStr


def require_env(name: str, value: str) -> None:
    if not value:
        raise HTTPException(status_code=500, detail=f"Missing required environment variable: {name}")


def supabase_service_headers() -> dict[str, str]:
    require_env("SUPABASE_URL", SUPABASE_URL)
    require_env("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY)

    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def supabase_endpoint() -> str:
    return f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE_NAME}"


async def update_supabase_premium_status(email: str, is_premium: bool) -> dict[str, Any]:
    if not email:
        raise HTTPException(status_code=400, detail="Missing email for Supabase update.")
    normalized_email = email.strip().lower()

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.patch(
            supabase_endpoint(),
            params={"email": f"eq.{normalized_email}"},
            headers=supabase_service_headers(),
            json={"premium_id": is_premium},
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Supabase update failed.",
                "status_code": response.status_code,
                "response": response.text,
            },
        )

    rows = response.json()
    if not rows:
        raise HTTPException(status_code=404, detail=f"No Supabase row was updated for email {normalized_email}.")

    return {
        "updated": True,
        "email": normalized_email,
        "premium_id": is_premium,
    }


async def get_stripe_customer_email(customer_id: str | None) -> str | None:
    if not customer_id:
        return None

    try:
        customer = await asyncio.to_thread(stripe.Customer.retrieve, customer_id)
    except stripe.error.StripeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return customer.get("email")


async def handle_checkout_completed(event: dict[str, Any]) -> dict[str, Any]:
    session = event.get("data", {}).get("object", {})
    email = (
        session.get("customer_details", {}).get("email")
        or session.get("customer_email")
        or session.get("metadata", {}).get("email")
    )

    if not email:
        email = await get_stripe_customer_email(session.get("customer"))

    if not email:
        raise HTTPException(status_code=400, detail="Stripe checkout session did not include an email.")

    supabase_result = await update_supabase_premium_status(email, True)

    return {
        "received": True,
        "event_type": event.get("type"),
        "email": email,
        "supabase": supabase_result,
    }


ACTIVE_SUBSCRIPTION_STATUSES = {"active", "trialing"}


async def handle_subscription_event(event: dict[str, Any]) -> dict[str, Any]:
    subscription = event.get("data", {}).get("object", {})
    status = subscription.get("status") or ""
    is_premium = status in ACTIVE_SUBSCRIPTION_STATUSES

    email = subscription.get("metadata", {}).get("email")
    if not email:
        email = await get_stripe_customer_email(subscription.get("customer"))

    if not email:
        raise HTTPException(status_code=400, detail="Stripe subscription event did not include an email.")

    supabase_result = await update_supabase_premium_status(email, is_premium)

    return {
        "received": True,
        "event_type": event.get("type"),
        "email": email,
        "subscription_status": status,
        "supabase": supabase_result,
    }


@app.get("/health")
async def health() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "iloverepost-fastapi-billing",
    }


@app.get("/")
async def root() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "iloverepost-fastapi-billing",
        "message": "FastAPI backend is running.",
        "endpoints": [
            "/health",
            "/create-checkout-session",
            "/stripe-webhook",
            "/docs",
        ],
    }


@app.post("/create-checkout-session")
async def create_checkout_session(payload: CheckoutSessionRequest) -> dict[str, Any]:
    require_env("STRIPE_SECRET_KEY", STRIPE_SECRET_KEY)
    require_env("STRIPE_PRICE_ID", STRIPE_PRICE_ID)

    try:
        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[
                {
                    "price": STRIPE_PRICE_ID,
                    "quantity": 1,
                }
            ],
            success_url=CHECKOUT_SUCCESS_URL + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=CHECKOUT_CANCEL_URL,
            customer_email=payload.email,
            metadata={
                "email": payload.email,
                "product": "ILOVEREPOST Pro",
            },
        )
    except stripe.error.StripeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {
        "ok": True,
        "checkout_url": session.url,
        "session_id": session.id,
    }


@app.post("/stripe-webhook")
async def stripe_webhook(request: Request) -> dict[str, Any]:
    require_env("STRIPE_SECRET_KEY", STRIPE_SECRET_KEY)
    require_env("STRIPE_WEBHOOK_SECRET", STRIPE_WEBHOOK_SECRET)

    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid Stripe payload: {exc}") from exc
    except stripe.error.SignatureVerificationError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid Stripe signature: {exc}") from exc

    if event["type"] == "checkout.session.completed":
        return await handle_checkout_completed(event)

    if event["type"] in {"customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"}:
        return await handle_subscription_event(event)

    return {
        "received": True,
        "event_type": event["type"],
        "message": "Event ignored.",
    }
