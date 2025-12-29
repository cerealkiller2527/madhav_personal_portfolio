// Project utility functions for display formatting and content detection

import type { Project, ProjectContent as NotionProject } from "@/lib/types"
import { PROJECT_SECTIONS, type ProjectSectionId } from "@/lib/core/data"

// --- Display Formatting ---

// Formats a zero-based index as a two-digit display string
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// --- Content Detection ---

// Checks if a project has content for a specific section
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

// --- Type Guards ---

// Type guard to check if a project has Notion content (recordMap)
export function isNotionProject(project: unknown): project is NotionProject {
  return (
    typeof project === 'object' && 
    project !== null && 
    'recordMap' in project && 
    (project as NotionProject).recordMap !== undefined
  )
}

// --- Data Transformation ---

// Transforms a Notion project to the local Project format with defaults
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
