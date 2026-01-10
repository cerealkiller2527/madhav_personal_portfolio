// Project card for grid display with Sketchfab support and badges

"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectMedia, ProjectBadges, ProjectLinks, ProjectStats } from "@/components/projects/project-components"

interface ProjectGridCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
  onCardClick?: (projectId: string) => void
}

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  const [visibleTags, setVisibleTags] = useState<string[]>([])
  const [overflowCount, setOverflowCount] = useState(0)
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!project.tags?.length || !tagsContainerRef.current) {
      setVisibleTags(project.tags || [])
      setOverflowCount(0)
      return
    }

    // Create measurement element once
    if (!measurementRef.current) {
      const tempDiv = document.createElement('div')
      tempDiv.className = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold'
      tempDiv.style.cssText = 'position: absolute; visibility: hidden; white-space: nowrap; pointer-events: none;'
      document.body.appendChild(tempDiv)
      measurementRef.current = tempDiv
    }

    const calculateVisibleTags = () => {
      const container = tagsContainerRef.current
      if (!container || !measurementRef.current) return

      const containerWidth = container.offsetWidth
      const tags = project.tags!
      const gap = 8 // gap-2 = 8px
      const overflowBadgeWidth = 50 // Approximate width for "+X more" badge
      
      let currentLine = 1
      let currentLineWidth = 0
      let visibleCount = 0

      // Calculate how many tags fit in 2 lines
      for (let i = 0; i < tags.length; i++) {
        measurementRef.current.textContent = tags[i]
        const tagWidth = measurementRef.current.offsetWidth
        
        // Check if tag fits on current line
        const needsOverflowBadge = i < tags.length - 1
        const requiredWidth = currentLineWidth + tagWidth + gap + (needsOverflowBadge && currentLine === 2 ? overflowBadgeWidth : 0)
        
        if (requiredWidth <= containerWidth) {
          // Tag fits on current line
          currentLineWidth += tagWidth + gap
          visibleCount++
        } else {
          // Tag doesn't fit, move to next line
          if (currentLine < 2) {
            currentLine++
            currentLineWidth = tagWidth + gap
            visibleCount++
          } else {
            // Already on line 2 and doesn't fit
            break
          }
        }
      }

      setVisibleTags(tags.slice(0, visibleCount))
      setOverflowCount(Math.max(0, tags.length - visibleCount))
    }

    // Initial calculation
    const rafId = requestAnimationFrame(calculateVisibleTags)
    
    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(calculateVisibleTags)
    resizeObserver.observe(tagsContainerRef.current)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (measurementRef.current) {
        document.body.removeChild(measurementRef.current)
        measurementRef.current = null
      }
    }
  }, [project.tags])

  const handleClick = () => {
    onCardClick?.(project.id)
    onViewDetails(project)
  }

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleClick()
  }

  return (
    <motion.div data-project-id={project.id}>
      <Card
        variant="glass"
        className="relative overflow-hidden w-full rounded-2xl flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-primary/10"
        onClick={handleClick}
      >
        {/* Decorative gradient glow - more prominent on hover */}
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-primary/20 rounded-full blur-3xl opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500 pointer-events-none translate-x-1/3 translate-y-1/3" />
        
        <ProjectMedia project={project} index={index} />
        
        <CardContent className="p-5 flex-grow flex flex-col gap-4">
          {/* Header: Badges and Title with Links */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <ProjectBadges project={project} />
                <h3 className="text-lg font-bold text-foreground mt-1">{project.title}</h3>
              </div>
              <ProjectLinks project={project} variant="compact" className="flex-shrink-0" />
            </div>
            <p className="text-muted-foreground text-sm text-balance">{project.description}</p>
          </div>

          {/* Stats */}
          {project.stats && project.stats.length > 0 && (
            <ProjectStats stats={project.stats} variant="compact" />
          )}

          {/* Footer: Tags (wrapping) with Details button */}
          <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              {/* Tags container - max 2 lines with overflow */}
              <div className="flex-1 min-w-0">
                {project.tags && project.tags.length > 0 && (
                  <div ref={tagsContainerRef} className="flex flex-wrap gap-2 max-h-[52px] overflow-hidden">
                    {visibleTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs flex-shrink-0">{tag}</Badge>
                    ))}
                    {overflowCount > 0 && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">+{overflowCount}</Badge>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleDetailsClick}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0 h-9 px-4 self-center"
              >
                Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
