"use client"

import { useRef } from "react"
import type { Project } from "@/lib/types"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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

// Check if HTML has actual text content (not just empty tags)
function hasTextContent(html: string | undefined): boolean {
  if (!html) return false
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
}

// Check if Notion recordMap has meaningful visible content (not just empty blocks)
function hasNotionVisibleContent(recordMap: { block?: Record<string, { value?: { type?: string; properties?: Record<string, unknown> } }> } | undefined): boolean {
  if (!recordMap?.block) return false
  const blocks = Object.values(recordMap.block)
  // Filter out page blocks and check if remaining blocks have content
  const contentBlocks = blocks.filter(b => {
    const type = b?.value?.type
    return type && type !== 'page'
  })
  if (contentBlocks.length === 0) return false
  // Check if any block has actual text properties
  return contentBlocks.some(b => {
    const props = b?.value?.properties
    if (!props) return false
    // Check title/content properties for text
    const titleProp = props.title as string[][] | undefined
    if (titleProp && Array.isArray(titleProp) && titleProp.length > 0) {
      const text = titleProp.map(t => t[0]).join('').trim()
      if (text.length > 0) return true
    }
    return false
  })
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLElement>(null)
  
  const notionProject = project && isNotionProject(project) ? project : null
  const hasNotionContent = hasNotionVisibleContent(notionProject?.recordMap)
  const { sections, showTOC } = useContentTOC({ 
    recordMap: notionProject?.recordMap,
    project: hasNotionContent ? undefined : project ?? undefined
  })

  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-6xl h-[calc(100dvh-2rem)] sm:h-[calc(100dvh-4rem)] max-h-[900px] flex flex-col p-0 gap-0 overflow-hidden [&>button]:hidden">
        <ProjectModalHeader project={project} onClose={onClose} />

        <div className={`flex-1 min-h-0 grid grid-cols-1 gap-0 overflow-hidden ${showTOC ? 'md:grid-cols-5' : ''}`}>
          {/* TOC Sidebar */}
          {showTOC && (
            <aside className="hidden md:block md:col-span-1 p-4 overflow-auto">
              <Card variant="glass-subtle" className="p-4">
                <TableOfContents sections={sections} containerRef={contentRef} />
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <div className={`overflow-y-auto overflow-x-hidden ${showTOC ? 'md:col-span-4' : ''}`}>
            <main className="p-4 sm:p-6" ref={contentRef as React.RefObject<HTMLElement>}>
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
                {(hasNotionContent || hasTextContent(project.detailedDescription)) && (
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
