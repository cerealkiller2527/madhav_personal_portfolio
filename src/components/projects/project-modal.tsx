"use client"

import { useRef } from "react"
import type { Project } from "@/lib/types"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ProjectModalHeader, ProjectHeroMedia, ProjectStats } from "@/components/projects/project-components"
import { ProjectContentSections } from "@/components/projects/project-content-sections"
import { isNotionProject } from "@/lib/utils/project-utils"
import { useContentTOC } from "@/lib/hooks/use-content-toc"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLElement>(null)
  
  const notionProject = project && isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap
  const { sections, showTOC } = useContentTOC({ 
    recordMap: notionProject?.recordMap,
    project: hasNotionContent ? undefined : project
  })

  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <ProjectModalHeader project={project} onClose={onClose} />

        <div className={`flex-1 grid grid-cols-1 gap-0 overflow-hidden ${showTOC ? 'md:grid-cols-5' : ''}`}>
          {/* TOC Sidebar */}
          {showTOC && (
            <aside className="hidden md:block md:col-span-1 p-4">
              <div className="sticky top-4">
                <Card variant="glass-subtle" className="p-4">
                  <ScrollArea className="max-h-[calc(90vh-8rem)]">
                    <TableOfContents sections={sections} containerRef={contentRef} />
                  </ScrollArea>
                </Card>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <ScrollArea className={showTOC ? 'md:col-span-4 h-full' : 'h-full'}>
            <main className="p-6" ref={contentRef as React.RefObject<HTMLElement>}>
              <div id="overview" className="scroll-mt-24">
                <Card variant="glass-subtle" className="mb-6 overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <ProjectHeroMedia
                      project={project}
                      sizes="(max-width: 1200px) 100vw, 800px"
                      className="object-cover"
                    />
                  </AspectRatio>
                </Card>
                
                {/* Inline stats display */}
                {project.stats && project.stats.length > 0 && (
                  <ProjectStats stats={project.stats} variant="default" className="mb-6" />
                )}
                
                {/* Render Notion content if available, otherwise use local content */}
                {(hasNotionContent || project.detailedDescription?.trim()) && (
                  <Card variant="glass-subtle" className="p-6">
                    {hasNotionContent ? (
                      <div className="notion-project-modal">
                        <NotionRenderer 
                          recordMap={notionProject!.recordMap!}
                          rootPageId={notionProject!.id}
                          className="prose dark:prose-invert max-w-none"
                          contentType="project"
                        />
                      </div>
                    ) : (
                      <div
                        className="prose dark:prose-invert max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
                      />
                    )}
                  </Card>
                )}
              </div>

              <ProjectContentSections 
                project={project} 
                hasNotionContent={Boolean(hasNotionContent)} 
              />
            </main>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
