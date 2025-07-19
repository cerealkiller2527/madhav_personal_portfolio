"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import type { Project } from "@/lib/types"
import type { NotionProject } from "@/types/projects"
import { Badge } from "@/components/ui/badge"
import { EnhancedTableOfContents } from "@/components/ui/enhanced-table-of-contents"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, X, Loader2 } from "lucide-react"
import { ProjectRenderer } from "@/components/projects/project-renderer"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const defaultSections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Key Features" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "gallery", label: "Gallery" },
]

// Extract headings from Notion recordMap to generate TOC
function extractNotionHeadings(recordMap: any): { id: string; label: string; level: number }[] {
  const headings: { id: string; label: string; level: number }[] = []
  
  if (!recordMap?.block) return headings

  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = (block as any)?.value
    if (!blockValue) continue

    const { type, properties } = blockValue
    
    // Check if it's a heading block
    if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
      const title = properties?.title?.[0]?.[0] || ''
      if (title) {
        // Generate a URL-friendly ID from the title
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

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  // Type guard to check if project has Notion content
  const isNotionProject = (p: Project): p is NotionProject => {
    return 'recordMap' in p && p.recordMap !== undefined
  }
  
  const notionProject = project && isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap

  if (!project) {
    return null
  }

  // Use Notion data if available, otherwise fall back to local data
  const displayProject = notionProject || project
  
  // Generate sections based on content type
  const sections = hasNotionContent 
    ? extractNotionHeadings(notionProject.recordMap).map(h => ({ id: h.id, label: h.label, level: h.level }))
    : defaultSections.filter(section => {
        // Only show sections that have content
        if (section.id === 'features') return displayProject.keyFeatures?.length > 0
        if (section.id === 'tech-stack') return displayProject.techStack?.length > 0
        if (section.id === 'gallery') return displayProject.gallery?.length > 0
        return true // Always show overview
      })

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl">{displayProject.title}</DialogTitle>
            <DialogDescription>{displayProject.subtitle}</DialogDescription>
          </div>
          <div className="flex items-center gap-2 -mt-2 -mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-primary hover:text-white"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View project in a new page"
                    >
                      <Maximize className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View full page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden">
          <aside className="hidden md:block md:col-span-1 p-6 border-r">
            <EnhancedTableOfContents sections={sections} containerRef={contentRef} />
          </aside>

          <main className="md:col-span-4 overflow-y-auto p-8" ref={contentRef}>
            <div id="overview" className="scroll-mt-24">
              <div className="relative w-full h-64 md:h-80 mb-8 rounded-md overflow-hidden">
                <Image
                  src={displayProject.heroImage || "/placeholder.svg"}
                  alt={`${displayProject.title} hero image`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover bg-secondary"
                />
              </div>
              
              {/* Render Notion content if available, otherwise use local content */}
              {hasNotionContent ? (
                <div className="notion-project-modal">
                  <ProjectRenderer 
                    recordMap={notionProject.recordMap}
                    rootPageId={notionProject.id}
                    className="prose dark:prose-invert max-w-none"
                  />
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: displayProject.detailedDescription }}
                />
              )}
            </div>

            {/* Only show additional sections if we don't have Notion content or if local data has content */}
            {(!hasNotionContent && displayProject.keyFeatures?.length > 0) && (
              <div id="features" className="mt-12 scroll-mt-24">
                <h4 className="text-xl font-semibold mb-4 border-b pb-2">Key Features</h4>
                <ul className="space-y-4">
                  {displayProject.keyFeatures.map((feature) => (
                    <li key={feature.title}>
                      <p className="font-semibold text-foreground">{feature.title}</p>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!hasNotionContent && displayProject.techStack?.length > 0) && (
              <div id="tech-stack" className="mt-12 scroll-mt-24">
                <h4 className="text-xl font-semibold mb-4 border-b pb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {displayProject.techStack.map((tech) => (
                    <Badge key={tech.name} variant="secondary">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(!hasNotionContent && displayProject.gallery?.length > 0) && (
              <div id="gallery" className="mt-12 scroll-mt-24">
                <h4 className="text-xl font-semibold mb-4 border-b pb-2">Gallery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayProject.gallery.map((image, index) => (
                    <div key={index} className="relative w-full h-48 rounded-md overflow-hidden">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover bg-secondary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
