/**
 * Project Utility Functions
 * Display utilities and content helpers for projects
 */

import type { Project } from "@/lib/schemas"
import type { ProjectContent as NotionProject } from "@/lib/schemas"

// Format project index for display
export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

// Check if project has content for a specific section
export function hasProjectContent(project: Project, sectionId: string): boolean {
  switch (sectionId) {
    case 'features':
      return (project.keyFeatures?.length ?? 0) > 0
    case 'tech-stack':
      return (project.techStack?.length ?? 0) > 0
    case 'gallery':
      return (project.gallery?.length ?? 0) > 0
    case 'statistics':
      return (project.stats?.length ?? 0) > 0
    default:
      return false
  }
}

// Type guard for Notion projects
export function isNotionProject(project: unknown): project is NotionProject {
  return typeof project === 'object' && project !== null && 'recordMap' in project && (project as NotionProject).recordMap !== undefined
}

// Get display version of project (for backward compatibility)
export function getDisplayProject(project: Project): Project {
  return project
}