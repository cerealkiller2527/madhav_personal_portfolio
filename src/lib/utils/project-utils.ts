/**
 * Project Utility Functions
 * 
 * Display utilities and content helpers for project data.
 */

import type { Project, ProjectContent as NotionProject } from "@/lib/schemas"
import { PROJECT_SECTIONS, type ProjectSectionId } from "@/lib/core/constants"

// ============================================================================
// Display Formatting
// ============================================================================

/**
 * Formats a zero-based index as a two-digit display string.
 * 
 * @param index - Zero-based project index
 * @returns Formatted string like "01", "02", etc.
 */
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// ============================================================================
// Content Detection
// ============================================================================

/**
 * Checks if a project has content for a specific section.
 * Used to conditionally render sections in project displays.
 */
export function hasProjectContent(project: Project, sectionId: ProjectSectionId): boolean {
  switch (sectionId) {
    case PROJECT_SECTIONS.features:
      return (project.keyFeatures?.length ?? 0) > 0
    case PROJECT_SECTIONS.techStack:
      return (project.techStack?.length ?? 0) > 0
    case PROJECT_SECTIONS.gallery:
      return (project.gallery?.length ?? 0) > 0
    case PROJECT_SECTIONS.statistics:
      return (project.stats?.length ?? 0) > 0
    default:
      return false
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a project has Notion content (recordMap).
 * 
 * @param project - Unknown project object
 * @returns Whether the project has a Notion recordMap
 */
export function isNotionProject(project: unknown): project is NotionProject {
  return (
    typeof project === 'object' && 
    project !== null && 
    'recordMap' in project && 
    (project as NotionProject).recordMap !== undefined
  )
}

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Transforms a Notion project (ProjectContent) to the local Project format.
 * Handles missing fields with sensible defaults.
 * 
 * @param notionProject - The Notion project content
 * @returns A Project object with recordMap for Notion rendering
 */
export function transformNotionToLocalProject(
  notionProject: NotionProject
): Project & { recordMap?: NotionProject['recordMap'] } {
  return {
    id: notionProject.id,
    title: notionProject.title,
    subtitle: notionProject.subtitle,
    description: notionProject.description || "",
    category: notionProject.category,
    award: notionProject.award,
    awardRank: notionProject.awardRank,
    stats: notionProject.stats || [],
    tags: notionProject.tags,
    liveLink: notionProject.liveLink,
    githubLink: notionProject.githubLink,
    heroImage: notionProject.heroImage || notionProject.coverImage || "",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    sketchfabEmbedUrl: notionProject.sketchfabEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack || [],
    recordMap: notionProject.recordMap,
  }
}
