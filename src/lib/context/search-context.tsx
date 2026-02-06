"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Project, BlogPreview } from "@/lib/types"

interface SearchContextType {
  projects: readonly Project[]
  blogPosts: readonly BlogPreview[]
  setProjects: (projects: readonly Project[]) => void
  setBlogPosts: (posts: readonly BlogPreview[]) => void
  onProjectSelect: ((projectId: string) => void) | null
  setOnProjectSelect: (handler: ((projectId: string) => void) | null) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<readonly Project[]>([])
  const [blogPosts, setBlogPosts] = useState<readonly BlogPreview[]>([])
  const [onProjectSelect, setOnProjectSelect] = useState<((projectId: string) => void) | null>(null)

  const setOnProjectSelectHandler = useCallback((handler: ((projectId: string) => void) | null) => {
    setOnProjectSelect(() => handler)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        projects,
        blogPosts,
        setProjects,
        setBlogPosts,
        onProjectSelect,
        setOnProjectSelect: setOnProjectSelectHandler,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
