"use client"

import { useRef } from "react"
import type { Project } from "@/lib/schemas"
import { ContentImage } from "@/components/common/content/content-image"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProjectModalHeader } from "@/components/projects/project-components"
import { ProjectContentSections } from "@/components/projects/project-content-sections"
import { 
  isNotionProject, 
  getDisplayProject
} from "@/lib/utils/project-utils"
import { useContentTOC } from "@/lib/hooks/use-content-toc"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null) // For scroll spy in TOC
  
  // Check if project has Notion content or is local
  const notionProject = project && isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap
  const displayProject = project ? getDisplayProject(project) : null
  
  // Generate table of contents from either Notion or local content
  const { sections } = useContentTOC({ 
    recordMap: notionProject?.recordMap,
    project: hasNotionContent ? undefined : displayProject || undefined
  })

  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <ProjectModalHeader project={displayProject!} onClose={onClose} />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden">
          {/* Sidebar with table of contents - hidden on mobile */}
          <aside className="hidden md:block md:col-span-1 p-6 border-r">
            <TableOfContents sections={sections} containerRef={contentRef as React.RefObject<HTMLElement>} />
          </aside>

          {/* Main content area */}
          <main className="md:col-span-4 overflow-y-auto p-8" ref={contentRef}>
            <div id="overview" className="scroll-mt-24">
              {/* Hero image */}
              <div className="relative w-full h-64 md:h-80 mb-8 rounded-md overflow-hidden">
                <ContentImage
                  src={displayProject!.heroImage || ""}
                  alt={`${displayProject!.title} hero image`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover bg-secondary"
                  fallbackType="project"
                />
              </div>
              
              {/* Render Notion content if available, otherwise use local content */}
              {hasNotionContent ? (
                <div className="notion-project-modal">
                  <NotionRenderer 
                    recordMap={notionProject.recordMap}
                    rootPageId={notionProject.id}
                    className="prose dark:prose-invert max-w-none"
                    contentType="project"
                  />
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: displayProject!.detailedDescription }}
                />
              )}
            </div>

            {/* Additional project sections (features, tech stack, etc) */}
            <ProjectContentSections 
              project={displayProject!} 
              hasNotionContent={hasNotionContent} 
            />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
