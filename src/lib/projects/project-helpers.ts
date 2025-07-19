import type { Project } from "@/types"
import type { NotionProject } from "@/types/projectTypes"

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

// Type guard to check if project has Notion content
export function isNotionProject(project: Project): project is NotionProject {
  return 'recordMap' in project && project.recordMap !== undefined
}

// Extract headings from Notion recordMap to generate TOC
export function extractNotionHeadings(recordMap: any): NotionHeading[] {
  const headings: NotionHeading[] = []
  
  if (!recordMap?.block) return headings

  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = (block as any)?.value
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

// Generate URL-friendly ID from title
export function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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