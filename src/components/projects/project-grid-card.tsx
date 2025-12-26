/**
 * Project Grid Card Component
 * 
 * Displays a project in a card format for the projects grid.
 * Supports 3D model embeds via Sketchfab and award badges.
 */

"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Project } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectMedia, ProjectBadges } from "@/components/projects/project-components"

// ============================================================================
// Types
// ============================================================================

interface ProjectGridCardProps {
  /** The project data to display */
  project: Project
  /** Callback when "Details" button is clicked */
  onViewDetails: (project: Project) => void
  /** Zero-based index for display numbering */
  index: number
  /** Optional callback when the card is clicked */
  onCardClick?: (projectId: string) => void
}

// ============================================================================
// Component
// ============================================================================

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  const handleClick = () => {
    onCardClick?.(project.id)
  }

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleClick()
    onViewDetails(project)
  }

  return (
    <motion.div
      data-project-id={project.id}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden w-full rounded-2xl border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/5 backdrop-blur-lg shadow-lg flex flex-col group"
      onClick={handleClick}
    >
      {/* Decorative gradient glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none translate-x-1/2 translate-y-1/2" />
      
      <ProjectMedia project={project} index={index} />
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <ProjectBadges project={project} />
          <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm text-balance line-clamp-3">{project.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <Button
            onClick={handleDetailsClick}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0"
          >
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
