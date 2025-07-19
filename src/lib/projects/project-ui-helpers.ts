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
      badgeClasses: "text-amber-700 bg-amber-100/80 backdrop-blur-sm dark:text-yellow-400 dark:bg-yellow-400/20",
      iconClasses: "text-amber-700 dark:text-yellow-400",
      hoverClasses: "hover:bg-amber-200/80 dark:hover:bg-yellow-400/30",
    }
  }

  // Silver - 2nd place
  if (lowerAward.includes("2nd") || lowerAward.includes("second")) {
    return {
      badgeClasses: "text-slate-600 bg-slate-200/80 backdrop-blur-sm dark:text-gray-300 dark:bg-gray-500/20",
      iconClasses: "text-slate-600 dark:text-gray-300",
      hoverClasses: "hover:bg-slate-300/80 dark:hover:bg-gray-500/30",
    }
  }

  // Bronze - 3rd place
  if (lowerAward.includes("3rd") || lowerAward.includes("third")) {
    return {
      badgeClasses: "text-orange-800 bg-orange-100/80 backdrop-blur-sm dark:text-amber-500 dark:bg-amber-500/20",
      iconClasses: "text-orange-800 dark:text-amber-500",
      hoverClasses: "hover:bg-orange-200/80 dark:hover:bg-amber-500/30",
    }
  }

  // Default (Gold) for any other award
  return {
    badgeClasses: "text-amber-700 bg-amber-100/80 backdrop-blur-sm dark:text-yellow-400 dark:bg-yellow-400/20",
    iconClasses: "text-amber-700 dark:text-yellow-400",
    hoverClasses: "hover:bg-amber-200/80 dark:hover:bg-yellow-400/30",
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

// Get category badge custom classes
export function getCategoryBadgeClasses(category: Project['category']): string {
  if (category === 'Hybrid') {
    return "border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-900/90"
  }
  return ""
}

// Format project index for display
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// Get display tags with limit
export function getDisplayProjectTags(tags: string[], limit = 3): string[] {
  return tags.slice(0, limit)
}