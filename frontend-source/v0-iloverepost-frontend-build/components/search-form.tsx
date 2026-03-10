"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/lib/user-context"
import { Search, Lock, Crown } from "lucide-react"

export type SearchType = "reposts" | "likes" | "favorites"

interface SearchFormProps {
  onSearch: (username: string, type: SearchType, keyword: string) => void
  isLoading?: boolean
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const { plan } = useUser()
  const [username, setUsername] = useState("")
  const [type, setType] = useState<SearchType>("reposts")
  const [keyword, setKeyword] = useState("")
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false)

  const handleTypeChange = (value: SearchType) => {
    if (plan === "free" && (value === "likes" || value === "favorites")) {
      setShowUpgradeAlert(true)
      return
    }
    setShowUpgradeAlert(false)
    setType(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    onSearch(username.trim(), type, keyword.trim())
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_180px_1fr_auto]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                TikTok Username
              </label>
              <Input
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 border-input bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search Type
              </label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger className="h-12 border-input bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reposts">Reposts</SelectItem>
                  <SelectItem value="likes" disabled={plan === "free"}>
                    <span className="flex items-center gap-2">
                      Likes
                      {plan === "free" && <Lock className="h-3 w-3" />}
                    </span>
                  </SelectItem>
                  <SelectItem value="favorites" disabled={plan === "free"}>
                    <span className="flex items-center gap-2">
                      Favorites
                      {plan === "free" && <Lock className="h-3 w-3" />}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Keyword (optional)
              </label>
              <Input
                placeholder="Filter by keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 border-input bg-background text-foreground"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !username.trim()}
                className="h-12 w-full gap-2 bg-[var(--free)] px-8 text-[var(--free-foreground)] hover:bg-[var(--free)]/90 md:w-auto"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                Search
              </Button>
            </div>
          </div>

          {plan === "free" && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-5 items-center rounded bg-[var(--free)]/10 px-2 text-xs font-medium text-[var(--free)]">
                FREE
              </span>
              <span>
                Reposts only | Max 3 profiles | Standard speed
              </span>
            </div>
          )}
        </div>

        {showUpgradeAlert && (
          <Alert className="border-[var(--pro)] bg-[var(--pro)]/10">
            <Crown className="h-4 w-4 text-[var(--pro)]" />
            <AlertDescription className="flex items-center justify-between text-foreground">
              <span>
                Unlock access to likes and favorites with Pro!
              </span>
              <Button
                type="button"
                size="sm"
                className="ml-4 bg-[var(--pro)] text-[var(--pro-foreground)] hover:bg-[var(--pro)]/90"
                asChild
              >
                <a href="#pricing">Upgrade Now</a>
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  )
}
