"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Project } from "@/types"
import { ProjectGridCard } from "@/components/projects/project-grid-card"
import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { smoothScrollTo } from "@/lib/core/utils"

const FILTERS = ["All", "Software", "Hardware", "Hybrid"] as const
type FilterType = (typeof FILTERS)[number]

interface ProjectsSectionProps {
  projects: Project[]
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
  const [activeBounceId, setActiveBounceId] = useState<string | null>(null)
  const bounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isAnimatingRef = useRef(false) // Prevents re-triggering during animation

  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter)),
    [projects, activeFilter],
  )

  const projectsToShow = showMore || activeFilter !== "All" ? filteredProjects : filteredProjects.slice(0, 4)

  useEffect(() => {
    if (bounceProjectId && !isAnimatingRef.current) {
      const projectIndex = filteredProjects.findIndex((p) => p.id === bounceProjectId)
      const isProjectVisible = projectIndex !== -1 && (projectIndex < 4 || showMore || activeFilter !== "All")

      // If the project isn't visible, expand the list and wait for the re-render.
      if (!isProjectVisible) {
        setShowMore(true)
        return // The effect will re-run once `projectsToShow` is updated.
      }

      // If the project is visible, we can proceed with scrolling.
      const element = document.querySelector(`[data-project-id="${bounceProjectId}"]`)
      if (element) {
        isAnimatingRef.current = true // Lock to prevent re-entry

        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const viewportHeight = window.innerHeight
        const cardHeight = elementRect.height

        // Center the card in the viewport, accounting for the fixed header
        const headerOffset = 90
        const targetPosition = absoluteElementTop - viewportHeight / 2 + cardHeight / 2 - headerOffset / 2

        // A single, smooth scroll animation. Reduced duration for responsiveness.
        smoothScrollTo(targetPosition, 1200)

        // Start bouncing after the scroll animation is complete
        setTimeout(() => {
          setActiveBounceId(bounceProjectId)
          if (bounceTimeoutRef.current) {
            clearTimeout(bounceTimeoutRef.current)
          }
          // Bounce time is 24 seconds
          bounceTimeoutRef.current = setTimeout(() => {
            setActiveBounceId(null)
          }, 24000)
        }, 1200)

        // Clean up and unlock after the animation sequence
        setTimeout(() => {
          onBounceComplete()
          isAnimatingRef.current = false // Unlock
        }, 1300)
      }
    }
  }, [bounceProjectId, onBounceComplete, filteredProjects, showMore, activeFilter, projectsToShow])

  const stopBouncing = (projectId?: string) => {
    // Only stop bouncing if it's the specific card being interacted with
    if (!projectId || activeBounceId === projectId) {
      setActiveBounceId(null)
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current)
      }
    }
  }

  return (
    <Section title="Featured Projects" className="pt-10 md:pt-14" id="projects" hasBackground>
      <div className="flex justify-center gap-2 mb-12">
        {FILTERS.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
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
                  animate={isBouncing ? { y: [0, -6, 0] } : { y: 0 }}
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
                  onMouseEnter={() => stopBouncing(project.id)}
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

      {activeFilter === "All" && projects.length > 4 && (
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
