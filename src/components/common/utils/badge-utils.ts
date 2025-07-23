/**
 * Badge Utility Class - Centralized badge logic for consistent styling
 * Meta Engineering Standards: OOP design, type-safe, extensible
 */

import type { Project } from "@/lib/schemas"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"
export type CategoryType = Project['category']
export type AwardRank = string

export class BadgeUtil {
  /**
   * Get badge variant for project category
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
   * Get category-specific CSS classes
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
   * Get trophy badge styling based on award rank
   */
  static getTrophyStyles(awardRank: AwardRank) {
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

    // Default for any other award
    return {
      badgeClasses: "bg-primary/20 border-primary/30 hover:bg-primary/30 text-black dark:text-white",
      containerClasses: "bg-primary/20 backdrop-blur-sm",
      iconClasses: "text-black dark:text-primary",
      hoverClasses: "hover:border-primary/50"
    }
  }

  /**
   * Get tech stack badge styling
   */
  static getTechStackClasses(): string {
    return "bg-secondary/80 text-secondary-foreground hover:bg-secondary border-secondary"
  }

  /**
   * Validation: Check if badge variant is valid
   */
  static isValidVariant(variant: string): variant is BadgeVariant {
    return ["default", "secondary", "destructive", "outline"].includes(variant)
  }

  /**
   * Validation: Check if category is valid
   */
  static isValidCategory(category: string): category is CategoryType {
    return ["Software", "Hardware", "Hybrid"].includes(category)
  }
}