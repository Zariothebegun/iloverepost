"use client"

import { useState } from "react"
import { ResultCard, VideoResult } from "@/components/result-card"
import { Button } from "@/components/ui/button"
import { ChevronDown, AlertCircle } from "lucide-react"

interface ResultsFeedProps {
  results: VideoResult[]
  searchKeyword?: string
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export function ResultsFeed({
  results,
  searchKeyword = "",
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: ResultsFeedProps) {
  if (isLoading && results.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl py-12">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border bg-card p-4"
            >
              <div className="flex gap-4">
                <div className="h-24 w-32 rounded-lg bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            No results found
          </h3>
          <p className="text-muted-foreground">
            Try searching for a different username or keyword
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.length}</span> results
          {searchKeyword && (
            <span>
              {" "}
              for &quot;<span className="text-[var(--free)]">{searchKeyword}</span>&quot;
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        {results.map((video) => (
          <ResultCard
            key={video.id}
            video={video}
            searchKeyword={searchKeyword}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
            className="gap-2 border-border text-foreground hover:bg-muted"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
