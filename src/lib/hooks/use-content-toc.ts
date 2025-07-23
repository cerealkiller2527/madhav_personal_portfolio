import { useMemo } from "react"
import type { ExtendedRecordMap } from "notion-types"
import type { Project } from "@/lib/schemas"

export interface TOCSection {
  id: string
  label: string
  level: number
}

function extractNotionHeadings(recordMap: ExtendedRecordMap | undefined): TOCSection[] {
  if (!recordMap?.block) return []

  const headings: TOCSection[] = []

  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = (block as { value?: { type?: string; properties?: { title?: string[][] } } })?.value
    if (!blockValue) continue

    const { type, properties } = blockValue
    
    if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
      const title = properties?.title?.[0]?.[0] || ''
      if (title) {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        
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

function generateProjectSections(project: Project): TOCSection[] {
  const sections: TOCSection[] = [{ id: "overview", label: "Overview", level: 1 }]
  
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
    if (content.recordMap) {
      return extractNotionHeadings(content.recordMap)
    }
    
    if (content.project) {
      return generateProjectSections(content.project)
    }
    
    return []
  }, [content.recordMap, content.project])

  const showTOC = sections.length >= 2

  return { sections, showTOC }
}