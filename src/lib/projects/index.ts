/**
 * Unified Project Utilities
 * Content helpers, UI styling, and display utilities for projects
 */

import type { Project } from "@/types"
import type { ProjectContent as NotionProject } from "@/types"
import { createSlugFromTitle } from "@/lib/notion/transforms"

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface ProjectSection {
  id: string
  label: string
  level?: number
}

export interface NotionHeading {
  id: string
  label: string
  level: number
}

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

// =============================================================================
// CONTENT ANALYSIS UTILITIES
// =============================================================================

// Type guard to check if project has Notion content
export function isNotionProject(project: Project): project is NotionProject {
  return 'recordMap' in project && project.recordMap !== undefined
}

// Extract headings from Notion recordMap to generate TOC
export function extractNotionHeadings(recordMap: unknown): NotionHeading[] {
  const headings: NotionHeading[] = []
  
  const recordMapObj = recordMap as { block?: Record<string, { value?: unknown }> }
  if (!recordMapObj?.block) return headings

  for (const [blockId, block] of Object.entries(recordMapObj.block || {})) {
    const blockValue = block?.value
    if (!blockValue) continue

    const { type, properties } = blockValue
    
    // Check if it's a heading block
    if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
      const title = properties?.title?.[0]?.[0] || ''
      if (title) {
        const id = createSlugFromTitle(title)
        const level = getHeadingLevel(type)
        
        headings.push({
          id: id || blockId,
          label: title,
          level
        })
      }
    }
  }

  return headings
}

// Get numeric heading level from Notion type
function getHeadingLevel(type: string): number {
  switch (type) {
    case 'header': return 1
    case 'sub_header': return 2
    case 'sub_sub_header': return 3
    default: return 1
  }
}

// Default sections for local projects
export const DEFAULT_PROJECT_SECTIONS: ProjectSection[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Key Features" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "gallery", label: "Gallery" },
]

// Generate sections based on project content
export function generateProjectSections(project: Project): ProjectSection[] {
  const notionProject = isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap

  if (hasNotionContent) {
    return extractNotionHeadings(notionProject.recordMap).map(h => ({
      id: h.id,
      label: h.label,
      level: h.level
    }))
  }

  // Filter default sections based on available content
  return DEFAULT_PROJECT_SECTIONS.filter(section => {
    switch (section.id) {
      case 'features':
        return project.keyFeatures?.length > 0
      case 'tech-stack':
        return project.techStack?.length > 0
      case 'gallery':
        return project.gallery?.length > 0
      default:
        return true // Always show overview
    }
  })
}

// Get the display project (Notion or local)
export function getDisplayProject(project: Project): Project {
  const notionProject = isNotionProject(project) ? project : null
  return notionProject || project
}

// Check if project has specific content sections
export function hasProjectContent(project: Project, sectionId: string): boolean {
  switch (sectionId) {
    case 'features':
      return (project.keyFeatures?.length ?? 0) > 0
    case 'tech-stack':
      return (project.techStack?.length ?? 0) > 0
    case 'gallery':
      return (project.gallery?.length ?? 0) > 0
    default:
      return true
  }
}

// =============================================================================
// UI STYLING UTILITIES
// =============================================================================

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

// =============================================================================
// DISPLAY UTILITIES
// =============================================================================

// Format project index for display
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// Get display tags with limit
export function getDisplayProjectTags(tags: string[], limit = 3): string[] {
  return tags.slice(0, limit)
}

// Re-export createSlugFromTitle for convenience
export { createSlugFromTitle }