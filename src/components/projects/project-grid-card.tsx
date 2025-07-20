"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectBadges } from "@/components/projects/project-badges"
import { ProjectMedia } from "@/components/projects/project-media"
import { getDisplayProjectTags } from "@/lib/projects/project-ui-helpers"

interface ProjectGridCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
  onCardClick?: (projectId: string) => void
}

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  const displayTags = getDisplayProjectTags(project.tags)

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(project.id)
    }
  }

  const handleDetailsClick = () => {
    handleCardClick()
    onViewDetails(project)
  }

  return (
    <motion.div
      data-project-id={project.id}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden w-full rounded-2xl border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/5 backdrop-blur-lg shadow-lg flex flex-col group"
      onClick={handleCardClick}
    >
      {/* Subtle Glow Effect */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none translate-x-1/2 translate-y-1/2" />

      <ProjectMedia project={project} index={index} />

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <ProjectBadges project={project} />
          <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm text-balance line-clamp-3">{project.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-muted/60 backdrop-blur-sm border border-muted-foreground/20 text-muted-foreground hover:bg-muted/80 hover:border-muted-foreground/30 transition-all duration-200 shadow-sm dark:bg-muted/40 dark:border-muted-foreground/30 dark:hover:bg-muted/60"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation() // Prevent card click
              handleDetailsClick()
            }}
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
