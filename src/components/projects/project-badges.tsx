import { Trophy } from "lucide-react"
import type { Project } from "@/schemas"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/core/utils"
import { 
  getTrophyStyles, 
  getCategoryBadgeVariant, 
  getCategoryBadgeClasses 
} from "@/lib/projects"

interface ProjectBadgesProps {
  project: Project
}

export function ProjectBadges({ project }: ProjectBadgesProps) {
  // Use award description for display, but awardRank for trophy styling
  const awardText = project.award
  const trophyStyles = project.awardRank ? getTrophyStyles(project.awardRank) : null
  const categoryVariant = getCategoryBadgeVariant(project.category)
  const categoryClasses = getCategoryBadgeClasses(project.category)

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