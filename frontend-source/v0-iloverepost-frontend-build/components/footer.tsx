import { Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-[var(--free)] text-[var(--free)]" />
            <span className="text-lg font-bold text-foreground">ILOVEREPOST</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              href="#pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            2026 ILOVEREPOST. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
