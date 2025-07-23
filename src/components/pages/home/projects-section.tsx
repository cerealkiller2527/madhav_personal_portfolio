"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectsSectionProps } from "@/lib/schemas"
import { ProjectGridCard } from "@/components/projects/project-grid-card"
import { Section } from "@/components/common/layout/section"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useBounceAnimation } from "@/lib/hooks/use-bounce-animation"

const FILTERS = ["All", "Software", "Hardware", "Hybrid"] as const
type FilterType = (typeof FILTERS)[number]

export function ProjectsSection({
  projects,
  onProjectSelect,
  bounceProjectId,
  onBounceComplete,
}: ProjectsSectionProps) {
  const [showMore, setShowMore] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("All")

  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter)),
    [projects, activeFilter],
  )

  const projectsToShow = showMore || activeFilter !== "All" ? filteredProjects : filteredProjects.slice(0, 4)
  
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
