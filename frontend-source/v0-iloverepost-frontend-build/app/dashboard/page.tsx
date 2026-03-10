"use client"

import { useUser } from "@/lib/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  User,
  Clock,
  Trash2,
  Search,
  ArrowRight,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const {
    plan,
    isLoggedIn,
    savedProfiles,
    removeProfile,
    recentSearches,
  } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      redirect("/")
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your profiles and searches
            </p>
          </div>
          <Badge
            variant={plan === "pro" ? "default" : "secondary"}
            className={`gap-1 px-3 py-1 text-sm ${
              plan === "pro"
                ? "bg-[var(--pro)] text-[var(--pro-foreground)]"
                : "bg-[var(--free)]/10 text-[var(--free)]"
            }`}
          >
            {plan === "pro" ? (
              <>
                <Crown className="h-4 w-4" />
                Pro Plan
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Free Plan
              </>
            )}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Saved Profiles */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Heart className="h-5 w-5 text-[var(--free)]" />
                Saved Profiles
              </CardTitle>
              {plan === "free" && (
                <span className="text-sm text-muted-foreground">
                  {savedProfiles.length}/3 used
                </span>
              )}
            </CardHeader>
            <CardContent>
              {savedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground">
                    No saved profiles yet
                  </p>
                  <Button asChild className="bg-[var(--free)] text-[var(--free-foreground)] hover:bg-[var(--free)]/90">
                    <Link href="/">
                      Start Searching
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedProfiles.map((profile) => (
                    <li
                      key={profile.username}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--free)]/10">
                          <User className="h-5 w-5 text-[var(--free)]" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            @{profile.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added{" "}
                            {profile.addedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-[var(--free)] hover:bg-[var(--free)]/10 hover:text-[var(--free)]"
                        >
                          <Link href={`/?username=${profile.username}`}>
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProfile(profile.username)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-[var(--pro)]" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSearches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground">
                    No recent searches
                  </p>
                  <Button asChild className="bg-[var(--free)] text-[var(--free-foreground)] hover:bg-[var(--free)]/90">
                    <Link href="/">
                      Start Searching
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <span className="text-foreground">{search}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-[var(--free)] hover:bg-[var(--free)]/10 hover:text-[var(--free)]"
                      >
                        <Link href={`/?username=${search}`}>
                          <Search className="h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA for Free Users */}
        {plan === "free" && (
          <Card className="mt-8 border-[var(--pro)] bg-gradient-to-r from-[var(--pro)]/5 to-[var(--pro)]/10">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pro)]">
                  <Crown className="h-6 w-6 text-[var(--pro-foreground)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Upgrade to Pro
                  </h3>
                  <p className="text-muted-foreground">
                    Unlock unlimited profiles, likes, favorites, and faster
                    searches
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-[var(--pro)] text-[var(--pro-foreground)] hover:bg-[var(--pro)]/90"
              >
                <Link href="/#pricing">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
