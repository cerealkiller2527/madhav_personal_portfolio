"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Fuse from "fuse.js"
import type { Project } from "@/lib/types"
import { ProjectGridCard } from "@/components/projects/project-grid-card"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Search, X, Filter } from "lucide-react"
import { useBounceAnimation } from "@/lib/hooks/use-bounce-animation"
import { cn } from "@/lib/core/utils"

const FILTERS = ["All", "Software", "Hardware", "Hybrid"] as const
type FilterType = (typeof FILTERS)[number]
type TagMatchMode = "all" | "any"

interface ProjectsSectionProps {
  projects: readonly Project[]
  onProjectSelect: (project: Project) => void
  bounceProjectId: string | null
  onBounceComplete: () => void
}

export function ProjectsSection({
  projects,
  onProjectSelect,
  bounceProjectId,
  onBounceComplete,
}: ProjectsSectionProps) {
  const [showMore, setShowMore] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagMatchMode, setTagMatchMode] = useState<TagMatchMode>("any")
  const [showAllTags, setShowAllTags] = useState(false)

  const fuse = useMemo(
    () =>
      new Fuse([...projects], {
        keys: [
          { name: "title", weight: 2 },
          { name: "subtitle", weight: 1.5 },
          { name: "description", weight: 1 },
          { name: "tags", weight: 1.5 },
          { name: "category", weight: 0.5 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [projects]
  )

  const allTags = useMemo(() => {
    const tagCount = new Map<string, number>()
    projects.forEach((p) =>
      p.tags.forEach((tag) => tagCount.set(tag, (tagCount.get(tag) || 0) + 1))
    )
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result: Project[]

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery.trim())
      result = fuseResults.map((r) => r.item)
    } else {
      result = [...projects]
    }

    if (activeFilter !== "All") {
      result = result.filter((p) => p.category === activeFilter)
    }

    if (selectedTags.length > 0) {
      if (tagMatchMode === "all") {
        result = result.filter((p) =>
          selectedTags.every((tag) => p.tags.includes(tag))
        )
      } else {
        result = result.filter((p) =>
          selectedTags.some((tag) => p.tags.includes(tag))
        )
      }
    }

    return result
  }, [projects, activeFilter, searchQuery, selectedTags, tagMatchMode, fuse])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setActiveFilter("All")
  }

  const hasActiveFilters = searchQuery.trim() || selectedTags.length > 0 || activeFilter !== "All"
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 8)

  const projectsToShow = showMore || hasActiveFilters ? filteredProjects : filteredProjects.slice(0, 4)
  
  const { activeBounceId, stopBouncing } = useBounceAnimation({
    bounceProjectId,
    filteredProjects,
    showMore,
    activeFilter,
    setShowMore,
    onBounceComplete
  })


  return (
    <Section title="Featured Projects" className="pt-10 md:pt-14" id="projects" hasBackground>
      <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
        <div className="relative max-w-md mx-auto px-2 sm:px-0">
          <Search className="absolute left-4 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="glass"
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1.5 sm:right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              size="sm"
              className="text-xs sm:text-sm px-2.5 sm:px-3"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="space-y-2 sm:space-y-3">
          {selectedTags.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Match:</span>
              <div className="flex gap-1">
                <Button
                  variant={tagMatchMode === "any" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTagMatchMode("any")}
                  className="h-7 px-2.5 text-[10px] sm:text-xs"
                >
                  Any
                </Button>
                <Button
                  variant={tagMatchMode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTagMatchMode("all")}
                  className="h-7 px-2.5 text-[10px] sm:text-xs"
                >
                  All
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
            {visibleTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 text-xs",
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "hover:bg-primary/10 hover:border-primary/30"
                )}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
            {allTags.length > 8 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-xs h-auto px-2 py-0.5"
              >
                {showAllTags ? "Show less" : `+${allTags.length - 8} more`}
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-sm text-muted-foreground">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground text-xs sm:text-sm">
              <X className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          </div>
        )}

        {filteredProjects.length === 0 && hasActiveFilters && (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">No projects found</p>
            <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {projectsToShow.map((project, index) => {
            const isBouncing = activeBounceId === project.id

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                data-project-id={project.id}
                style={{ zIndex: isBouncing ? 10 : 1 }}
              >
                <motion.div
                  animate={isBouncing ? { y: [0, -12, 0] } : { y: 0 }}
                  transition={
                    isBouncing
                      ? {
                          duration: 0.6,
                          ease: [0.68, -0.55, 0.265, 1.55],
                          repeat: Number.POSITIVE_INFINITY,
                        }
                      : { duration: 0.3 }
                  }
                  onClick={() => stopBouncing(project.id)}
                >
                  <ProjectGridCard
                    project={project}
                    onViewDetails={onProjectSelect}
                    index={index}
                    onCardClick={(projectId) => stopBouncing(projectId)}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {!hasActiveFilters && projects.length > 4 && (
        <div className="mt-12 text-center">
          <Button onClick={() => setShowMore(!showMore)} size="lg">
            {showMore ? "Show Less Projects" : "Show More Projects"}
            {showMore ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </Section>
  )
}
