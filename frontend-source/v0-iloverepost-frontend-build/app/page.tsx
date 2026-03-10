"use client"

import { useState, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { SearchForm, SearchType } from "@/components/search-form"
import { ResultsFeed } from "@/components/results-feed"

import { PricingSection } from "@/components/pricing-section"
import { AdBanner } from "@/components/ad-banner"
import { Footer } from "@/components/footer"
import { VideoResult } from "@/components/result-card"
import { useUser } from "@/lib/user-context"

// Mock data generator for demonstration
function generateMockResults(
  username: string,
  type: SearchType,
  keyword: string
): VideoResult[] {
  const descriptions = [
    "This is absolutely incredible! Everyone needs to see this viral moment",
    "POV: When the beat drops and you can't help but dance",
    "Best life hack I've ever discovered - game changer!",
    "Cooking tutorial that actually works in under 5 minutes",
    "My pet did the most adorable thing today, had to share",
    "Fashion tips that will change your wardrobe forever",
    "Travel vlog from the most beautiful place on Earth",
    "Comedy skit that had me crying laughing",
    "Makeup transformation that will blow your mind",
    "Fitness routine that actually shows results",
    "DIY project that anyone can do at home",
    "Storytime that will have you on the edge of your seat",
  ]

  const authors = [
    "viralcreator",
    "dancequeen",
    "lifehacker",
    "chefmaster",
    "petlover",
    "fashionista",
    "worldtraveler",
    "funnybone",
    "beautyguru",
    "fitfam",
    "diyking",
    "storyteller",
  ]

  const count = Math.floor(Math.random() * 8) + 4

  return Array.from({ length: count }, (_, i) => {
    const description = descriptions[i % descriptions.length]
    const hasKeyword =
      keyword && description.toLowerCase().includes(keyword.toLowerCase())

    return {
      id: `${username}-${type}-${i}`,
      description: description,
      author: authors[i % authors.length],
      likes: Math.floor(Math.random() * 2000000) + 10000,
      url: `https://tiktok.com/@${authors[i % authors.length]}/video/${Math.random().toString(36).substring(7)}`,
      isHighlighted: hasKeyword,
      unavailable: Math.random() < 0.1, // 10% chance of unavailable
    }
  })
}

export default function HomePage() {
  const { addProfile, addRecentSearch, plan } = useUser()
  const [results, setResults] = useState<VideoResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentKeyword, setCurrentKeyword] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(
    async (username: string, type: SearchType, keyword: string) => {
      setIsLoading(true)
      setHasSearched(true)
      setCurrentKeyword(keyword)

      // Simulate API call with delay (slower for free users)
      const delay = plan === "free" ? 2000 : 800
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Generate mock results
      const mockResults = generateMockResults(username, type, keyword)
      setResults(mockResults)

      // Save to user context
      addProfile(username)
      addRecentSearch(username)

      setIsLoading(false)

      // Scroll to results
      if (searchRef.current) {
        searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    [addProfile, addRecentSearch, plan]
  )

  const scrollToSearch = () => {
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdBanner variant="top" />
      <Header />

      <main>
        <Hero onTryFree={scrollToSearch} />

        <section ref={searchRef} className="bg-background px-4 py-12">
          <div className="container mx-auto">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>

        {hasSearched && (
          <section className="bg-muted/30 px-4 py-8">
            <div className="container mx-auto">
              <ResultsFeed
                results={results}
                searchKeyword={currentKeyword}
                isLoading={isLoading}
              />
              <AdBanner variant="inline" />
            </div>
          </section>
        )}

        <PricingSection />
      </main>

      <Footer />
    </div>
  )
}
