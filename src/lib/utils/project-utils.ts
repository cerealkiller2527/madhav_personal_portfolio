// Project utility functions - display utilities and content helpers

import type { Project, TechStackItem } from "@/lib/schemas"
import type { ProjectContent as NotionProject } from "@/lib/schemas"

export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

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

export function isNotionProject(project: unknown): project is NotionProject {
  return typeof project === 'object' && project !== null && 'recordMap' in project && (project as NotionProject).recordMap !== undefined
}

export function getDisplayProject(project: Project): Project {
  return project
}

/**
 * Transform Notion project to local Project format
 * Centralized function to avoid duplication across pages
 */
export function transformNotionToLocalProject(notionProject: NotionProject): Project & { recordMap?: NotionProject['recordMap'] } {
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
    heroImage: notionProject.heroImage || notionProject.coverImage || "/assets/placeholders/placeholder-logo.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    sketchfabEmbedUrl: notionProject.sketchfabEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack as TechStackItem[] || [],
    recordMap: notionProject.recordMap,
  }
}