"use client"

import type { Project } from "@/lib/types"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProjectModalHeader, ProjectHeroMedia, ProjectStats } from "@/components/projects/project-components"
import { ProjectContentSections } from "@/components/projects/project-content-sections"
import { isNotionProject } from "@/lib/utils/project-utils"
import { useContentTOC } from "@/lib/hooks/use-content-toc"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const notionProject = project && isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap
  const { nestedSections, sectionIds } = useContentTOC({ 
    recordMap: notionProject?.recordMap,
    project: hasNotionContent ? undefined : project || undefined
  })

  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <ProjectModalHeader project={project} onClose={onClose} />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden">
          <aside className="hidden md:block md:col-span-1 p-6 border-r">
            <TableOfContents sections={nestedSections} sectionIds={sectionIds} />
          </aside>

          <main className="md:col-span-4 overflow-y-auto p-8">
            <div id="overview" className="scroll-mt-24">
              <div className="relative w-full h-64 md:h-80 mb-6 rounded-md overflow-hidden bg-secondary">
                <ProjectHeroMedia
                  project={project}
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover bg-secondary"
                />
              </div>
              
              {/* Inline stats display for immediate visibility */}
              {project.stats && project.stats.length > 0 && (
                <ProjectStats stats={project.stats} variant="default" className="mb-6" />
              )}
              
              {/* Render Notion content if available, otherwise use local content */}
              {hasNotionContent && notionProject?.recordMap ? (
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
                  dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
                />
              )}
            </div>

            <ProjectContentSections 
              project={project} 
              hasNotionContent={Boolean(hasNotionContent)} 
            />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
