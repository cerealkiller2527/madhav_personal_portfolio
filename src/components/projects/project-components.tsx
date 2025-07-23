/**
 * Consolidated Project Components
 * Small utility components consolidated into a single file
 */

import Link from "next/link"
import Image from "next/image"
import { Trophy, Maximize, X } from "lucide-react"
import type { Project } from "@/lib/schemas"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/core/utils"
import { BadgeUtil } from "@/components/common/utils/badge-utils"
import { formatProjectIndex } from "@/lib/utils/project-utils"

// Project Badges Component (from project-badges.tsx)
interface ProjectBadgesProps {
  project: Project
}

export function ProjectBadges({ project }: ProjectBadgesProps) {
  // Use award description for display, but awardRank for trophy styling
  const awardText = project.award
  const trophyStyles = project.awardRank ? BadgeUtil.getTrophyStyles(project.awardRank) : null
  const categoryVariant = BadgeUtil.getCategoryVariant(project.category)
  const categoryClasses = BadgeUtil.getCategoryClasses(project.category)

  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <Badge 
        variant={categoryVariant}
        className={categoryClasses}
      >
        {project.category}
      </Badge>
      
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

// Project Media Component (from project-media.tsx)
interface ProjectMediaProps {
  project: Project
  index: number
}

export function ProjectMedia({ project, index }: ProjectMediaProps) {
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
        <Image
          src={project.heroImage || "/assets/placeholders/placeholder-logo.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
        />
      )}
      <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-white dark:text-primary">
          {formatProjectIndex(index)}
        </span>
      </div>
    </div>
  )
}

// Project Modal Header Component (from project-modal-header.tsx)
interface ProjectModalHeaderProps {
  project: Project
  onClose: () => void
}

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