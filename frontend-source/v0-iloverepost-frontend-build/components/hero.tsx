"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroProps {
  onTryFree: () => void
}

export function Hero({ onTryFree }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--free)]/5 to-transparent" />
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-[var(--free)]" />
            <span>Discover hidden TikTok activity</span>
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Discover reposts, likes, and favorites of any{" "}
            <span className="text-[var(--free)]">public TikTok profile</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Uncover what your favorite creators are engaging with. Search any
            public profile and explore their reposts, liked videos, and saved
            favorites.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={onTryFree}
              className="gap-2 bg-[var(--free)] px-8 text-lg text-[var(--free-foreground)] hover:bg-[var(--free)]/90"
            >
              Try it Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-[var(--pro)] px-8 text-lg text-[var(--pro)] hover:bg-[var(--pro)]/10"
              asChild
            >
              <a href="#pricing">View Pro Features</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
