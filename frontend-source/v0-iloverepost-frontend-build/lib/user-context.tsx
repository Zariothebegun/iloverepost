"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type PlanType = "free" | "pro"

interface UserProfile {
  username: string
  addedAt: Date
}

interface UserContextType {
  plan: PlanType
  setPlan: (plan: PlanType) => void
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
  savedProfiles: UserProfile[]
  addProfile: (username: string) => void
  removeProfile: (username: string) => void
  recentSearches: string[]
  addRecentSearch: (search: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanType>("free")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const addProfile = (username: string) => {
    if (plan === "free" && savedProfiles.length >= 3) {
      return
    }
    if (!savedProfiles.find((p) => p.username === username)) {
      setSavedProfiles([...savedProfiles, { username, addedAt: new Date() }])
    }
  }

  const removeProfile = (username: string) => {
    setSavedProfiles(savedProfiles.filter((p) => p.username !== username))
  }

  const addRecentSearch = (search: string) => {
    const filtered = recentSearches.filter((s) => s !== search)
    setRecentSearches([search, ...filtered].slice(0, 10))
  }

  return (
    <UserContext.Provider
      value={{
        plan,
        setPlan,
        isLoggedIn,
        setIsLoggedIn,
        savedProfiles,
        addProfile,
        removeProfile,
        recentSearches,
        addRecentSearch,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
