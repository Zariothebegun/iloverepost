"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Play } from "lucide-react"

export interface VideoResult {
  id: string
  description: string
  author: string
  likes: number
  url: string
  thumbnail?: string
  isHighlighted?: boolean
  unavailable?: boolean
}

interface ResultCardProps {
  video: VideoResult
  searchKeyword?: string
}

function highlightText(text: string, keyword: string) {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="rounded bg-[var(--highlight)] px-1 text-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function formatLikes(likes: number): string {
  if (likes >= 1000000) {
    return (likes / 1000000).toFixed(1) + "M"
  }
  if (likes >= 1000) {
    return (likes / 1000).toFixed(1) + "K"
  }
  return likes.toString()
}

export function ResultCard({ video, searchKeyword = "" }: ResultCardProps) {
  if (video.unavailable) {
    return (
      <Card className="overflow-hidden border-border bg-card opacity-60">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <span>Unavailable - Private profile or restricted content</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`group overflow-hidden border-border bg-card transition-all duration-200 hover:shadow-lg ${
        video.isHighlighted ? "ring-2 ring-[var(--free)]" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative aspect-video w-full overflow-hidden bg-muted sm:aspect-square sm:w-32 md:w-40">
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.description}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--free)]/20 to-[var(--pro)]/20">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <p className="mb-2 line-clamp-2 text-sm text-foreground md:text-base">
                {highlightText(video.description, searchKeyword)}
              </p>
              <p className="text-sm text-muted-foreground">
                @{video.author}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 fill-[var(--free)] text-[var(--free)]" />
                <span>{formatLikes(video.likes)}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-[var(--free)] hover:bg-[var(--free)]/10 hover:text-[var(--free)]"
                asChild
              >
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View on TikTok</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
