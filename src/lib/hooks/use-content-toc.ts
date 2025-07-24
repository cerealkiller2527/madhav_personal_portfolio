import { useMemo } from "react"
import type { ExtendedRecordMap } from "notion-types"
import type { Project } from "@/lib/schemas"

export interface TOCSection {
  id: string
  label: string
  level: number
}

// Extract headings from Notion content blocks
function extractNotionHeadings(recordMap: ExtendedRecordMap | undefined): TOCSection[] {
  if (!recordMap?.block) return []

  const headings: TOCSection[] = []

  // Iterate through all blocks in the Notion page
  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = (block as { value?: { type?: string; properties?: { title?: string[][] } } })?.value
    if (!blockValue) continue

    const { type, properties } = blockValue
    
    // Check if block is a heading type
    if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
      const title = properties?.title?.[0]?.[0] || ''
      if (title) {
        // Generate URL-friendly ID from heading text
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        
        // Map heading type to level (1-3)
        const level = type === 'header' ? 1 : type === 'sub_header' ? 2 : 3
        
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

// Generate standard sections for project content
function generateProjectSections(project: Project): TOCSection[] {
  const sections: TOCSection[] = [{ id: "overview", label: "Overview", level: 1 }]
  
  // Add sections based on available content
  if (project.keyFeatures?.length) {
    sections.push({ id: "features", label: "Key Features", level: 1 })
  }
  
  if (project.techStack?.length) {
    sections.push({ id: "tech-stack", label: "Technology Stack", level: 1 })
  }
  
  if (project.gallery?.length) {
    sections.push({ id: "gallery", label: "Gallery", level: 1 })
  }

  return sections
}

    
export function useContentTOC(content: {
  recordMap?: ExtendedRecordMap
  project?: Project
}): {
  sections: TOCSection[]
  showTOC: boolean
} {
  const sections = useMemo(() => {
    // Use Notion headings if available
    if (content.recordMap) {
      return extractNotionHeadings(content.recordMap)
    }
    
    // Otherwise generate from project structure
    if (content.project) {
      return generateProjectSections(content.project)
    }
    
    return []
  }, [content.recordMap, content.project])

  // Only show TOC if there are at least 2 sections
  const showTOC = sections.length >= 2

  return { sections, showTOC }
}