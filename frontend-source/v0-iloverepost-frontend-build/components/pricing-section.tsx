"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { Check, X, Crown, Zap, Users, Eye } from "lucide-react"

const features = [
  {
    name: "Search Reposts",
    free: true,
    pro: true,
    icon: Zap,
  },
  {
    name: "Search Likes",
    free: false,
    pro: true,
    icon: Eye,
  },
  {
    name: "Search Favorites",
    free: false,
    pro: true,
    icon: Eye,
  },
  {
    name: "Simultaneous Profiles",
    free: "3 max",
    pro: "Unlimited",
    icon: Users,
  },
  {
    name: "Search Speed",
    free: "Standard",
    pro: "Priority",
    icon: Zap,
  },
  {
    name: "Ad-Free Experience",
    free: false,
    pro: true,
    icon: Eye,
  },
]

export function PricingSection() {
  const { plan, setPlan, isLoggedIn, setIsLoggedIn } = useUser()

  const handleUpgrade = () => {
    if (!isLoggedIn) {
      setIsLoggedIn(true)
    }
    setPlan("pro")
  }

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start free and upgrade when you need more power
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="relative border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--free)]/10">
                  <Zap className="h-5 w-5 text-[var(--free)]" />
                </span>
                Free
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.free === true ? (
                      <Check className="h-5 w-5 flex-shrink-0 text-[var(--pro)]" />
                    ) : feature.free === false ? (
                      <X className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <Check className="h-5 w-5 flex-shrink-0 text-[var(--pro)]" />
                    )}
                    <span className={feature.free === false ? "text-muted-foreground" : "text-foreground"}>
                      {feature.name}
                      {typeof feature.free === "string" && (
                        <span className="ml-1 text-sm text-muted-foreground">
                          ({feature.free})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full border-border text-foreground hover:bg-muted"
                disabled={plan === "free"}
              >
                {plan === "free" ? "Current Plan" : "Downgrade"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-[var(--pro)] bg-card shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pro)] px-3 py-1 text-sm font-medium text-[var(--pro-foreground)]">
                <Crown className="h-4 w-4" />
                Most Popular
              </span>
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pro)]/10">
                  <Crown className="h-5 w-5 text-[var(--pro)]" />
                </span>
                Pro
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">€4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-[var(--pro)]" />
                    <span className="text-foreground">
                      {feature.name}
                      {typeof feature.pro === "string" && (
                        <span className="ml-1 text-sm font-medium text-[var(--pro)]">
                          ({feature.pro})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full bg-[var(--pro)] text-[var(--pro-foreground)] hover:bg-[var(--pro)]/90"
                onClick={handleUpgrade}
                disabled={plan === "pro"}
              >
                {plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
