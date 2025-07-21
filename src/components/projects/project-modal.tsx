"use client"

import { useRef } from "react"
import Image from "next/image"
import type { Project } from "@/types"
import { EnhancedTableOfContents } from "@/components/ui/enhanced-table-of-contents"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProjectRenderer } from "@/components/projects/project-renderer"
import { ProjectModalHeader } from "@/components/projects/project-modal-header"
import { ProjectContentSections } from "@/components/projects/project-content-sections"
import { 
  isNotionProject, 
  generateProjectSections, 
  getDisplayProject
} from "@/lib/projects"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  if (!project) {
    return null
  }

  const notionProject = isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap
  const displayProject = getDisplayProject(project)
  const sections = generateProjectSections(project)

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <ProjectModalHeader project={displayProject} onClose={onClose} />

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

            <ProjectContentSections 
              project={displayProject} 
              hasNotionContent={hasNotionContent} 
            />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
