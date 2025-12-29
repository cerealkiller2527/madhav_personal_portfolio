// Shared project display components for badges, media, and modal header

import Link from "next/link"
import { Trophy, Maximize, X } from "lucide-react"
import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ContentImage } from "@/components/common/content/content-image"
import { cn } from "@/lib/core/utils"
import { getCategoryVariant, getCategoryClasses, getTrophyStyles } from "@/lib/utils/badge-utils"
import { formatProjectIndex } from "@/lib/utils/project-utils"

// --- Project Badges Component ---

interface ProjectBadgesProps {
  project: Project
}

// Displays category and award badges with rank-based styling
export function ProjectBadges({ project }: ProjectBadgesProps) {
  const awardText = project.award
  const trophyStyles = project.awardRank ? getTrophyStyles(project.awardRank) : null
  const categoryVariant = getCategoryVariant(project.category)
  const categoryClasses = getCategoryClasses(project.category)

  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      {/* Category badge */}
      <Badge 
        variant={categoryVariant}
        className={categoryClasses}
      >
        {project.category}
      </Badge>
      
      {/* Award badge with trophy icon */}
      {awardText && trophyStyles && (
        <Badge 
          className={cn(
            "border-transparent", 
            trophyStyles.badgeClasses, 
            trophyStyles.hoverClasses
          )}
        >
          <Trophy className={cn("mr-1.5 h-3.5 w-3.5", trophyStyles.iconClasses)} />
          {awardText}
        </Badge>
      )}
    </div>
  )
}

// --- Project Media Component ---

interface ProjectMediaProps {
  project: Project
  index: number
}

// Displays project media - Sketchfab 3D embed or hero image with index badge
export function ProjectMedia({ project, index }: ProjectMediaProps) {
  return (
    <div className={`relative w-full aspect-video overflow-hidden rounded-t-2xl ${project.sketchfabEmbedUrl ? '' : 'bg-secondary/10'}`}>
      {project.sketchfabEmbedUrl ? (
        <iframe
          src={project.sketchfabEmbedUrl}
          title={`${project.title} 3D Model`}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full bg-transparent"
          style={{ colorScheme: 'light' }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
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
      {/* Project index badge */}
      <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-white dark:text-primary">
          {formatProjectIndex(index)}
        </span>
      </div>
    </div>
  )
}

// --- Project Modal Header ---

interface ProjectModalHeaderProps {
  project: Project
  onClose: () => void
}

// Header for project modal with title, expand button, and close button
export function ProjectModalHeader({ project, onClose }: ProjectModalHeaderProps) {
  return (
    <DialogHeader className="px-6 py-4 border-b flex flex-row items-start justify-between">
      <div>
        <DialogTitle className="text-xl">{project.title}</DialogTitle>
        <DialogDescription>{project.subtitle}</DialogDescription>
      </div>
      <div className="flex items-center gap-2 -mt-2 -mr-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="flex-shrink-0 hover:bg-primary hover:text-white"
              >
                <Link
                  href={`/projects/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View project in a new page"
                >
                  <Maximize className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View full page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 hover:bg-primary hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </DialogHeader>
  )
}