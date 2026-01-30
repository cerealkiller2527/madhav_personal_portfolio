// Project detail page component with TOC sidebar and navigation

"use client"

import type { Project } from "@/lib/types"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { ProjectNavigation } from "@/components/common/content/content-navigation"
import { BackButton } from "@/components/common/content/content-navigation"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { Comments } from "@/components/common/comments"
import { ProjectContentSections } from "@/components/projects/project-content-sections"
import { ProjectHeroMedia, ProjectLinks, ProjectStats } from "@/components/projects/project-components"
import { ArrowLeft } from "lucide-react"
import { useContentTOC } from "@/lib/hooks/use-content-toc"

interface ProjectDetailPageProps {
  project: Project
  previousProject?: Project
  nextProject?: Project
}

export default function ProjectDetailPage({ project, previousProject, nextProject }: ProjectDetailPageProps) {
  const hasNotionContent = Boolean(project.recordMap && Object.keys(project.recordMap).length > 0)
  
  const { nestedSections, sectionIds } = useContentTOC({ 
    recordMap: hasNotionContent ? project.recordMap : undefined,
    project: hasNotionContent ? undefined : project
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <aside className="hidden lg:block lg:col-span-1 py-16">
          <div className="sticky top-28">
            <div className="mb-8">
              <BackButton sectionId="projects" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </BackButton>
            </div>
            <TableOfContents sections={nestedSections} sectionIds={sectionIds} />
          </div>
        </aside>

        <main className="lg:col-span-4 py-16">
          <div className="lg:hidden mb-8">
            <BackButton sectionId="projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </BackButton>
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-balance">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                {project.subtitle}
              </p>
              <ProjectLinks project={project} showLabels className="mt-6" />
            </header>

            {/* Hero Media - 3D model or hero image */}
            <div id="overview" className="scroll-mt-28">
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg bg-secondary">
                <ProjectHeroMedia
                  project={project}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Inline stats display for immediate visibility */}
              {project.stats && project.stats.length > 0 && (
                <ProjectStats stats={project.stats} variant="section" className="mb-8" />
              )}
              
              {/* Notion content or local description */}
              {hasNotionContent ? (
                <div className="notion-project-full-page">
                  <NotionRenderer 
                    recordMap={project.recordMap!}
                    rootPageId={project.id}
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

            {/* Content sections (features, tech stack, gallery) */}
            <ProjectContentSections 
              project={project} 
              hasNotionContent={hasNotionContent} 
              variant="full-page"
            />

            <ProjectNavigation 
              previousProject={previousProject}
              nextProject={nextProject}
            />

            <Comments />
          </article>
        </main>
      </div>
    </div>
  )
}