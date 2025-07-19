"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import type { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProjectGridCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
  onCardClick?: (projectId: string) => void
}

const getTrophyStyles = (award: string) => {
  const lowerAward = award.toLowerCase()

  // Gold
  if (
    lowerAward.includes("1st") ||
    lowerAward.includes("winner") ||
    lowerAward.includes("champion") ||
    lowerAward.includes("first")
  ) {
    return {
      badgeClasses: "text-amber-700 bg-amber-100/80 backdrop-blur-sm dark:text-yellow-400 dark:bg-yellow-400/20",
      iconClasses: "text-amber-700 dark:text-yellow-400",
      hoverClasses: "hover:bg-amber-200/80 dark:hover:bg-yellow-400/30",
    }
  }

  // Silver
  if (lowerAward.includes("2nd") || lowerAward.includes("second")) {
    return {
      badgeClasses: "text-slate-600 bg-slate-200/80 backdrop-blur-sm dark:text-gray-300 dark:bg-gray-500/20",
      iconClasses: "text-slate-600 dark:text-gray-300",
      hoverClasses: "hover:bg-slate-300/80 dark:hover:bg-gray-500/30",
    }
  }

  // Bronze
  if (lowerAward.includes("3rd") || lowerAward.includes("third")) {
    return {
      badgeClasses: "text-orange-800 bg-orange-100/80 backdrop-blur-sm dark:text-amber-500 dark:bg-amber-500/20",
      iconClasses: "text-orange-800 dark:text-amber-500",
      hoverClasses: "hover:bg-orange-200/80 dark:hover:bg-amber-500/30",
    }
  }

  // Default (Gold)
  return {
    badgeClasses: "text-amber-700 bg-amber-100/80 backdrop-blur-sm dark:text-yellow-400 dark:bg-yellow-400/20",
    iconClasses: "text-amber-700 dark:text-yellow-400",
    hoverClasses: "hover:bg-amber-200/80 dark:hover:bg-yellow-400/30",
  }
}

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  const trophyStyles = project.award ? getTrophyStyles(project.award) : null

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

      {/* Media Section */}
      <div className="relative w-full aspect-video bg-secondary/10 overflow-hidden rounded-t-2xl">
        {project.vectaryEmbedUrl ? (
          <iframe
            src={project.vectaryEmbedUrl}
            title={`${project.title} 3D Model`}
            frameBorder="0"
            className="w-full h-full"
            allow="fullscreen; xr-spatial-tracking; camera; microphone"
          />
        ) : (
          <Image
            src={project.heroImage || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
          />
        )}
        <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
          <span className="text-lg font-bold text-white dark:text-primary">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {project.category === "Software" && <Badge variant="default">{project.category}</Badge>}
            {project.category === "Hardware" && <Badge variant="destructive">{project.category}</Badge>}
            {project.category === "Hybrid" && (
              <Badge className="border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-900/90">
                {project.category}
              </Badge>
            )}
            {project.award && trophyStyles && (
              <Badge className={cn("border-transparent", trophyStyles.badgeClasses, trophyStyles.hoverClasses)}>
                <Trophy className={cn("mr-1.5 h-3.5 w-3.5", trophyStyles.iconClasses)} />
                {project.award}
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm text-balance line-clamp-3">{project.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
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
