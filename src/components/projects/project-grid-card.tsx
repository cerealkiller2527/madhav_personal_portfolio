"use client"

import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import type { Project } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContentImage } from "@/components/common/content/content-image"
import { cn } from "@/lib/core/utils"
import { BadgeUtil } from "@/components/common/utils/badge-utils"

interface ProjectGridCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
  onCardClick?: (projectId: string) => void
}

// Media component for 3D model or image
function ProjectMedia({ project, index }: { project: Project; index: number }) {
  return (
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
        <ContentImage
          src={project.heroImage || ""}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
          fallbackType="project"
        />
      )}
      
      {/* Index Badge */}
      <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-white dark:text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      
      {/* Trophy Badge */}
      {project.awardRank && (
        <TrophyBadge awardRank={project.awardRank} />
      )}
    </div>
  )
}

// Trophy badge component
function TrophyBadge({ awardRank }: { awardRank: string }) {
  const { badgeClasses, iconClasses } = BadgeUtil.getTrophyStyles(awardRank)
  return (
    <div className={cn("absolute top-4 right-4 rounded-full p-2", badgeClasses)}>
      <Trophy className={cn("w-4 h-4", iconClasses)} />
    </div>
  )
}

// Badge section component
function ProjectBadges({ project, trophyStyles }: { 
  project: Project
  trophyStyles: ReturnType<typeof BadgeUtil.getTrophyStyles> | null 
}) {
  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <Badge 
        variant={BadgeUtil.getCategoryVariant(project.category)}
        className={BadgeUtil.getCategoryClasses(project.category)}
      >
        {project.category}
      </Badge>
      {project.award && (
        <Badge 
          className={cn(
            "border-transparent", 
            trophyStyles && cn(trophyStyles.badgeClasses, trophyStyles.hoverClasses)
          )}
        >
          {trophyStyles && <Trophy className={cn("mr-1.5 h-3.5 w-3.5", trophyStyles.iconClasses)} />}
          {project.award}
        </Badge>
      )}
    </div>
  )
}

export function ProjectGridCard({ project, onViewDetails, index, onCardClick }: ProjectGridCardProps) {
  const trophyStyles = project.awardRank ? BadgeUtil.getTrophyStyles(project.awardRank) : null

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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none translate-x-1/2 translate-y-1/2" />
      
      <ProjectMedia project={project} index={index} />
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <ProjectBadges project={project} trophyStyles={trophyStyles} />
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
