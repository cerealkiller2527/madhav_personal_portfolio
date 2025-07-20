import type { Project } from "@/types"

export interface TrophyStyles {
  badgeClasses: string
  iconClasses: string
  hoverClasses: string
}

export interface CategoryBadgeProps {
  category: Project['category']
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  className?: string
}

// Trophy award styling based on award text
export function getTrophyStyles(award: string): TrophyStyles {
  const lowerAward = award.toLowerCase()

  // Gold - 1st place, winner, champion
  if (
    lowerAward.includes("1st") ||
    lowerAward.includes("winner") ||
    lowerAward.includes("champion") ||
    lowerAward.includes("first")
  ) {
    return {
      badgeClasses: "text-amber-800 bg-gradient-to-br from-amber-100/90 to-yellow-100/80 backdrop-blur-md border border-amber-200/50 dark:text-yellow-300 dark:from-yellow-400/25 dark:to-amber-400/20 dark:border-yellow-400/30 shadow-lg",
      iconClasses: "text-amber-700 dark:text-yellow-400 drop-shadow-sm",
      hoverClasses: "hover:from-amber-200/90 hover:to-yellow-200/80 dark:hover:from-yellow-400/35 dark:hover:to-amber-400/30",
    }
  }

  // Silver - 2nd place
  if (lowerAward.includes("2nd") || lowerAward.includes("second")) {
    return {
      badgeClasses: "text-slate-700 bg-gradient-to-br from-slate-200/90 to-gray-200/80 backdrop-blur-md border border-slate-300/50 dark:text-gray-200 dark:from-gray-500/25 dark:to-slate-500/20 dark:border-gray-500/30 shadow-lg",
      iconClasses: "text-slate-600 dark:text-gray-300 drop-shadow-sm",
      hoverClasses: "hover:from-slate-300/90 hover:to-gray-300/80 dark:hover:from-gray-500/35 dark:hover:to-slate-500/30",
    }
  }

  // Bronze - 3rd place
  if (lowerAward.includes("3rd") || lowerAward.includes("third")) {
    return {
      badgeClasses: "text-orange-800 bg-gradient-to-br from-orange-100/90 to-amber-100/80 backdrop-blur-md border border-orange-200/50 dark:text-amber-400 dark:from-amber-500/25 dark:to-orange-500/20 dark:border-amber-500/30 shadow-lg",
      iconClasses: "text-orange-700 dark:text-amber-500 drop-shadow-sm",
      hoverClasses: "hover:from-orange-200/90 hover:to-amber-200/80 dark:hover:from-amber-500/35 dark:hover:to-orange-500/30",
    }
  }

  // Default (Gold) for any other award
  return {
    badgeClasses: "text-amber-800 bg-gradient-to-br from-amber-100/90 to-yellow-100/80 backdrop-blur-md border border-amber-200/50 dark:text-yellow-300 dark:from-yellow-400/25 dark:to-amber-400/20 dark:border-yellow-400/30 shadow-lg",
    iconClasses: "text-amber-700 dark:text-yellow-400 drop-shadow-sm",
    hoverClasses: "hover:from-amber-200/90 hover:to-yellow-200/80 dark:hover:from-yellow-400/35 dark:hover:to-amber-400/30",
  }
}

// Get category badge variant
export function getCategoryBadgeVariant(category: Project['category']): CategoryBadgeProps['variant'] {
  switch (category) {
    case 'Software':
      return 'default'
    case 'Hardware':
      return 'destructive'
    case 'Hybrid':
      return 'outline' // Will be overridden with custom classes
    default:
      return 'secondary'
  }
}

// Get category badge custom classes with glass effects
export function getCategoryBadgeClasses(category: Project['category']): string {
  switch (category) {
    case 'Software':
      return "border-transparent bg-blue-100/80 backdrop-blur-sm text-blue-800 hover:bg-blue-200/80 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30 shadow-lg"
    case 'Hardware':
      return "border-transparent bg-red-100/80 backdrop-blur-sm text-red-800 hover:bg-red-200/80 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 shadow-lg"
    case 'Hybrid':
      return "border-transparent bg-violet-100/80 backdrop-blur-sm text-violet-800 hover:bg-violet-200/80 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30 shadow-lg"
    default:
      return ""
  }
}

// Format project index for display
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// Get display tags with limit
export function getDisplayProjectTags(tags: string[], limit = 3): string[] {
  return tags.slice(0, limit)
}