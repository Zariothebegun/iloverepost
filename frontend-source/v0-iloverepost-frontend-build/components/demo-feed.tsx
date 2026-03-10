"use client"

import { ResultCard, VideoResult } from "@/components/result-card"

const demoVideos: VideoResult[] = [
  {
    id: "demo-1",
    description: "This viral dance challenge is taking over TikTok! Check out this amazing performance",
    author: "dancequeen",
    likes: 1250000,
    url: "https://tiktok.com",
  },
  {
    id: "demo-2",
    description: "Best cooking hack I've ever seen - 5 minute meal prep that actually works",
    author: "chefmaster",
    likes: 890000,
    url: "https://tiktok.com",
  },
  {
    id: "demo-3",
    description: "POV: When your cat finally does something cute on camera",
    author: "petlover",
    likes: 2100000,
    url: "https://tiktok.com",
  },
]

export function DemoFeed() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            See What People Are Reposting
          </h2>
          <p className="text-muted-foreground">
            Preview of the kinds of content you can discover
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4">
            {demoVideos.map((video) => (
              <ResultCard key={video.id} video={video} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Search any TikTok username to see their real reposts, likes, and favorites
          </p>
        </div>
      </div>
    </section>
  )
}
