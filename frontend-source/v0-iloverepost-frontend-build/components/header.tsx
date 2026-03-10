"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { Heart, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { isLoggedIn, setIsLoggedIn, plan, setPlan } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 fill-[var(--free)] text-[var(--free)]" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            ILOVEREPOST
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  {plan === "pro" && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--pro)] text-[10px] font-bold text-[var(--pro-foreground)]">
                      P
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setPlan(plan === "free" ? "pro" : "free")}
                  className="cursor-pointer"
                >
                  {plan === "free" ? "Upgrade to Pro" : "Switch to Free"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsLoggedIn(false)}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsLoggedIn(true)}
                className="text-foreground"
              >
                Login
              </Button>
              <Button
                onClick={() => setIsLoggedIn(true)}
                className="bg-[var(--free)] text-[var(--free-foreground)] hover:bg-[var(--free)]/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
