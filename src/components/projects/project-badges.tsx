import { Trophy } from "lucide-react"
import type { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  getTrophyStyles, 
  getCategoryBadgeVariant, 
  getCategoryBadgeClasses 
} from "@/lib/projects/project-ui-helpers"

interface ProjectBadgesProps {
  project: Project
}

export function ProjectBadges({ project }: ProjectBadgesProps) {
  const trophyStyles = project.award ? getTrophyStyles(project.award) : null
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
      
      {project.award && trophyStyles && (
        <Badge 
          className={cn(
            "border-transparent", 
            trophyStyles.badgeClasses, 
            trophyStyles.hoverClasses
          )}
        >
          <Trophy className={cn("mr-1.5 h-3.5 w-3.5", trophyStyles.iconClasses)} />
          {project.award}
        </Badge>
      )}
    </div>
  )
}