"use client"

import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { X, Crown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface AdBannerProps {
  variant?: "top" | "side" | "inline"
}

export function AdBanner({ variant = "top" }: AdBannerProps) {
  const { plan } = useUser()
  const [dismissed, setDismissed] = useState(false)

  // Pro users don't see ads
  if (plan === "pro" || dismissed) {
    return null
  }

  if (variant === "top") {
    return (
      <div className="relative border-b border-border bg-gradient-to-r from-[var(--free)]/5 via-background to-[var(--pro)]/5 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center justify-center gap-3 text-sm">
            <span className="hidden rounded bg-[var(--free)]/10 px-2 py-0.5 text-xs font-medium text-[var(--free)] sm:inline">
              AD
            </span>
            <p className="text-center text-muted-foreground">
              <span className="font-medium text-foreground">Want unlimited access?</span>{" "}
              Upgrade to Pro for just €4.99/month
            </p>
            <Button
              size="sm"
              asChild
              className="bg-[var(--pro)] text-[var(--pro-foreground)] hover:bg-[var(--pro)]/90"
            >
              <Link href="#pricing" className="gap-1">
                <Crown className="h-3 w-3" />
                Upgrade
              </Link>
            </Button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss ad"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  if (variant === "side") {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-[var(--free)]/10 px-2 py-0.5 text-xs font-medium text-[var(--free)]">
            SPONSORED
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss ad"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-[var(--free)]/20 to-[var(--pro)]/20" />
        <p className="mb-3 text-sm text-muted-foreground">
          Go Pro and unlock the full potential of ILOVEREPOST
        </p>
        <Button
          size="sm"
          asChild
          className="w-full bg-[var(--pro)] text-[var(--pro-foreground)] hover:bg-[var(--pro)]/90"
        >
          <Link href="#pricing">Upgrade to Pro</Link>
        </Button>
      </div>
    )
  }

  // Inline variant
  return (
    <div className="my-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded bg-[var(--free)]/10 px-2 py-0.5 text-xs font-medium text-[var(--free)]">
            AD
          </span>
          <p className="text-sm text-muted-foreground">
            Remove ads with Pro
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="text-[var(--pro)] hover:bg-[var(--pro)]/10 hover:text-[var(--pro)]"
          >
            <Link href="#pricing">Learn More</Link>
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss ad"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
