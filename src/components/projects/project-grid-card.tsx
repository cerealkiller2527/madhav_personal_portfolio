"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import type { Project } from "@/schemas"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/core/utils"

interface ProjectGridCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
  onCardClick?: (projectId: string) => void
}

const getTrophyStyles = (awardRank?: string) => {
  if (!awardRank) return null
  
  const lowerRank = awardRank.toLowerCase()

  // Gold - 1st Place
  if (
    lowerRank.includes("1st") ||
    lowerRank === "1" ||
    lowerRank.includes("first") ||
    lowerRank.includes("winner") ||
    lowerRank.includes("gold")
  ) {
    return {
      badgeClasses: "text-amber-900 bg-amber-100/80 backdrop-blur-sm dark:text-yellow-400 dark:bg-yellow-400/20",
      iconClasses: "text-amber-900 dark:text-yellow-400",
      hoverClasses: "hover:bg-amber-200/80 dark:hover:bg-yellow-400/30",
    }
  }

  // Silver - 2nd Place
  if (
    lowerRank.includes("2nd") ||
    lowerRank === "2" ||
    lowerRank.includes("second") ||
    lowerRank.includes("silver")
  ) {
    return {
      badgeClasses: "text-slate-700 bg-slate-200/80 backdrop-blur-sm dark:text-gray-300 dark:bg-gray-500/20",
      iconClasses: "text-slate-700 dark:text-gray-300",
      hoverClasses: "hover:bg-slate-300/80 dark:hover:bg-gray-500/30",
    }
  }

  // Bronze - 3rd Place
  if (
    lowerRank.includes("3rd") ||
    lowerRank === "3" ||
    lowerRank.includes("third") ||
    lowerRank.includes("bronze")
  ) {
    return {
      badgeClasses: "text-orange-900 bg-orange-100/80 backdrop-blur-sm dark:text-amber-400 dark:bg-amber-500/20",
      iconClasses: "text-orange-900 dark:text-amber-400",
      hoverClasses: "hover:bg-orange-200/80 dark:hover:bg-amber-500/30",
    }
  }

  // Other awards (Finalist, Honorable Mention, etc.) - No trophy styling
  return null
}

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  // Use award description for display, but awardRank for trophy styling
  const awardText = project.award
  const trophyStyles = getTrophyStyles(project.awardRank)

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
        {/* Trophy Badge */}
        {project.awardRank && trophyStyles && (
          <div className={cn("absolute top-4 right-4 rounded-full p-2", trophyStyles.badgeClasses)}>
            <Trophy className={cn("w-4 h-4", trophyStyles.iconClasses)} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {project.category === "Software" && (
              <Badge className="border-transparent bg-red-100/80 backdrop-blur-sm text-red-900 hover:bg-red-200/80 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30">
                {project.category}
              </Badge>
            )}
            {project.category === "Hardware" && (
              <Badge className="border-transparent bg-orange-100/80 backdrop-blur-sm text-orange-900 hover:bg-orange-200/80 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30">
                {project.category}
              </Badge>
            )}
            {project.category === "Hybrid" && (
              <Badge className="border-transparent bg-violet-100/80 backdrop-blur-sm text-violet-900 hover:bg-violet-200/80 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30">
                {project.category}
              </Badge>
            )}
            {awardText && (
              <Badge 
                className={cn(
                  "border-transparent", 
                  trophyStyles 
                    ? cn(trophyStyles.badgeClasses, trophyStyles.hoverClasses)
                    : "bg-muted/80 backdrop-blur-sm text-muted-foreground hover:bg-muted"
                )}
              >
                {trophyStyles && <Trophy className={cn("mr-1.5 h-3.5 w-3.5", trophyStyles.iconClasses)} />}
                {awardText}
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
