/**
 * Badge Utility Functions
 * 
 * Provides consistent badge styling for project categories and awards.
 */

import type { Project } from "@/lib/schemas"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"
export type CategoryType = Project['category']

/**
 * Badge styling utilities for project displays.
 */
export class BadgeUtil {
  /**
   * Get the badge variant for a project category.
   */
  static getCategoryVariant(category: CategoryType): BadgeVariant {
    const categoryMap: Record<CategoryType, BadgeVariant> = {
      "Software": "default",
      "Hardware": "secondary", 
      "Hybrid": "outline"
    }
    return categoryMap[category] || "default"
  }

  /**
   * Get Tailwind classes for category badge styling.
   */
  static getCategoryClasses(category: CategoryType): string {
    const classMap: Record<CategoryType, string> = {
      "Software": "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
      "Hardware": "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
      "Hybrid": "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20"
    }
    return classMap[category] || "bg-muted/80 text-muted-foreground"
  }

  /**
   * Get styling for award trophy badges based on rank.
   */
  static getTrophyStyles(awardRank: string) {
    const lowerRank = awardRank.toLowerCase()
    
    if (lowerRank.includes("1st") || lowerRank.includes("first") || lowerRank.includes("gold")) {
      return {
        badgeClasses: "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200",
        containerClasses: "bg-amber-100/80 backdrop-blur-sm dark:bg-yellow-400/20",
        iconClasses: "text-yellow-800 dark:text-yellow-400",
        hoverClasses: "hover:border-yellow-500/50"
      }
    }
    
    if (lowerRank.includes("2nd") || lowerRank.includes("second") || lowerRank.includes("silver")) {
      return {
        badgeClasses: "bg-gray-400/20 border-gray-400/30 hover:bg-gray-400/30 text-gray-900 dark:text-gray-200",
        containerClasses: "bg-slate-200/80 backdrop-blur-sm dark:bg-gray-500/20",
        iconClasses: "text-gray-800 dark:text-gray-300",
        hoverClasses: "hover:border-gray-400/50"
      }
    }

    if (lowerRank.includes("3rd") || lowerRank.includes("third") || lowerRank.includes("bronze")) {
      return {
        badgeClasses: "bg-orange-600/20 border-orange-600/30 hover:bg-orange-600/30 text-orange-900 dark:text-orange-200",
        containerClasses: "bg-orange-100/80 backdrop-blur-sm dark:bg-amber-500/20",
        iconClasses: "text-orange-900 dark:text-amber-400",
        hoverClasses: "hover:border-orange-600/50"
      }
    }

    // Default award styling
    return {
      badgeClasses: "bg-primary/20 border-primary/30 hover:bg-primary/30 text-black dark:text-white",
      containerClasses: "bg-primary/20 backdrop-blur-sm",
      iconClasses: "text-black dark:text-primary",
      hoverClasses: "hover:border-primary/50"
    }
  }
}

