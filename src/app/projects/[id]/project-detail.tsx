"use client"

import { useRef } from "react"
import Image from "next/image"
import type { Project } from "@/types"
import type { NotionProject } from "@/types/projects"
import { Badge } from "@/components/ui/badge"
import { EnhancedTableOfContents } from "@/components/ui/enhanced-table-of-contents"
import { ProjectNavigation } from "@/components/sections/projects/project-navigation"
import { BackButton } from "@/components/ui/back-button"
import { ProjectRenderer } from "@/components/projects/project-renderer"
import { ArrowLeft } from "lucide-react"

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

interface ProjectDetailPageProps {
  projectData: {
    project: Project | NotionProject
    isNotion: boolean
  }
  previousProject?: Project | NotionProject
  nextProject?: Project | NotionProject
}

export default function ProjectDetailPage({ projectData, previousProject, nextProject }: ProjectDetailPageProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { project, isNotion } = projectData
  
  // Type guard to check if it's a NotionProject
  const isNotionProject = (p: Project | NotionProject): p is NotionProject => {
    return isNotion && 'recordMap' in p
  }
  
  const notionProject = isNotionProject(project) ? project : null
  const hasNotionContent = notionProject?.recordMap
  
  // Generate sections based on content type
  const sections = hasNotionContent 
    ? extractNotionHeadings(notionProject.recordMap).map(h => ({ id: h.id, label: h.label, level: h.level }))
    : defaultSections.filter(section => {
        // Only show sections that have content
        if (section.id === 'features') return project.keyFeatures?.length > 0
        if (section.id === 'tech-stack') return project.techStack?.length > 0
        if (section.id === 'gallery') return project.gallery?.length > 0
        return true // Always show overview
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
            <EnhancedTableOfContents sections={sections} containerRef={contentRef} />
          </div>
        </aside>

        <main className="lg:col-span-4 py-16" ref={contentRef}>
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
            </header>

            <div id="overview" className="scroll-mt-28">
              <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden shadow-lg bg-secondary">
                <Image
                  src={project.heroImage || "/placeholder.svg"}
                  alt={`${project.title} hero image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Render Notion content if available, otherwise use local content */}
              {hasNotionContent ? (
                <div className="notion-project-full-page">
                  <ProjectRenderer 
                    recordMap={notionProject.recordMap}
                    rootPageId={notionProject.id}
                    className="prose dark:prose-invert max-w-none"
                  />
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
                />
              )}
            </div>

            {/* Only show additional sections if we don't have Notion content or if local data has content */}
            {(!hasNotionContent && project.keyFeatures?.length > 0) && (
              <section id="features" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Key Features</h2>
                <ul className="space-y-6">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature.title}>
                      <p className="font-semibold text-lg text-foreground">{feature.title}</p>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(!hasNotionContent && project.techStack?.length > 0) && (
              <section id="tech-stack" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech.name} variant="secondary" className="text-sm px-3 py-1">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {(!hasNotionContent && project.gallery?.length > 0) && (
              <section id="gallery" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative w-full h-56 rounded-md overflow-hidden bg-secondary">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Navigation */}
            <ProjectNavigation 
              previousProject={previousProject}
              nextProject={nextProject}
            />
          </article>
        </main>
      </div>
    </div>
  )
}