"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import { Search, Code, BookOpen, ArrowRight } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/core/utils"
import type { Project, BlogPreview } from "@/lib/types"

interface SearchableItem {
  id: string
  type: "project" | "blog"
  title: string
  subtitle: string
  tags: string[]
  href: string
}

interface GlobalSearchProps {
  projects: readonly Project[]
  blogPosts: readonly BlogPreview[]
  onProjectSelect?: (projectId: string) => void
  className?: string
}

export function GlobalSearch({ projects, blogPosts, onProjectSelect, className }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const searchableItems: SearchableItem[] = useMemo(() => [
    ...projects.map((p) => ({
      id: p.id,
      type: "project" as const,
      title: p.title,
      subtitle: p.subtitle,
      tags: p.tags,
      href: `/projects/${p.id}`,
    })),
    ...blogPosts.map((b) => ({
      id: b.id,
      type: "blog" as const,
      title: b.title,
      subtitle: b.description || "",
      tags: b.tags,
      href: `/blog/${b.slug}`,
    })),
  ], [projects, blogPosts])

  const fuse = useMemo(
    () =>
      new Fuse(searchableItems, {
        keys: [
          { name: "title", weight: 2 },
          { name: "subtitle", weight: 1.5 },
          { name: "tags", weight: 1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: 1,
      }),
    [searchableItems]
  )

  const results = useMemo(() => {
    if (!query.trim()) return searchableItems.slice(0, 6)
    return fuse.search(query.trim()).slice(0, 8).map((r) => r.item)
  }, [query, fuse, searchableItems])

  const projectResults = results.filter((r) => r.type === "project")
  const blogResults = results.filter((r) => r.type === "blog")

  const handleSelect = useCallback((item: SearchableItem) => {
    setOpen(false)
    setQuery("")
    
    if (item.type === "project" && onProjectSelect) {
      onProjectSelect(item.id)
    } else {
      router.push(item.href)
    }
  }, [router, onProjectSelect])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="glass"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-8 justify-start gap-2 text-white/60 hover:text-white",
          "w-8 p-0 sm:w-40 sm:px-3 sm:pr-10 lg:w-48",
          className
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline-flex text-xs">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] text-white/40">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search projects and blog posts..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center py-6">
              <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          </CommandEmpty>
          
          {projectResults.length > 0 && (
            <CommandGroup heading="Projects">
              {projectResults.map((item) => (
                <CommandItem
                  key={`project-${item.id}`}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className="flex items-start gap-3 py-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="flex-shrink-0 h-4 w-4 text-muted-foreground/50 mt-1" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {blogResults.length > 0 && (
            <CommandGroup heading="Blog Posts">
              {blogResults.map((item) => (
                <CommandItem
                  key={`blog-${item.id}`}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className="flex items-start gap-3 py-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="flex-shrink-0 h-4 w-4 text-muted-foreground/50 mt-1" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
