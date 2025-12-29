// Renders project content sections (features, tech stack, gallery)

import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { hasProjectContent } from "@/lib/utils/project-utils"
import { ContentImage } from "@/components/common/content/content-image"
import { PROJECT_SECTIONS, PROJECT_IMAGE_HEIGHTS } from "@/lib/core/data"
import { cn } from "@/lib/core/utils"

// ============================================================================
// Types
// ============================================================================

interface ProjectContentSectionsProps {
  project: Project
  hasNotionContent: boolean
  variant?: "modal" | "full-page"
}

// ============================================================================
// Component
// ============================================================================

export function ProjectContentSections({ 
  project, 
  hasNotionContent,
  variant = "modal"
}: ProjectContentSectionsProps) {
  if (hasNotionContent) {
    return null
  }

  const isFullPage = variant === "full-page"
  const headingClass = isFullPage 
    ? "text-3xl font-bold mb-4 border-b pb-3" 
    : "text-xl font-semibold mb-4 border-b pb-2"
  const sectionClass = isFullPage 
    ? "mt-12 scroll-mt-28" 
    : "mt-12 scroll-mt-24"
  const featureTextClass = isFullPage
    ? "font-semibold text-lg text-foreground"
    : "font-semibold text-foreground"
  const featureDescClass = isFullPage
    ? "text-muted-foreground"
    : "text-muted-foreground text-sm"
  const galleryHeight = isFullPage 
    ? PROJECT_IMAGE_HEIGHTS.fullPage.gallery 
    : PROJECT_IMAGE_HEIGHTS.modal.gallery

  return (
    <>
      {hasProjectContent(project, PROJECT_SECTIONS.features) && (
        <section id={PROJECT_SECTIONS.features} className={sectionClass}>
          <h2 className={headingClass}>Key Features</h2>
          <ul className="space-y-6">
            {project.keyFeatures?.map((feature) => (
              <li key={feature.title}>
                <p className={featureTextClass}>{feature.title}</p>
                <p className={featureDescClass}>{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasProjectContent(project, PROJECT_SECTIONS.techStack) && (
        <section id={PROJECT_SECTIONS.techStack} className={sectionClass}>
          <h2 className={headingClass}>Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech) => (
              <Badge 
                key={tech.name} 
                variant="secondary"
                className={isFullPage ? "text-sm px-3 py-1" : undefined}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {hasProjectContent(project, PROJECT_SECTIONS.gallery) && (
        <section id={PROJECT_SECTIONS.gallery} className={sectionClass}>
          <h2 className={headingClass}>Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery?.map((image, index) => (
              <div key={index} className={cn("relative w-full rounded-md overflow-hidden", galleryHeight)}>
                <ContentImage
                  src={image.url || ""}
                  alt={image.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover bg-secondary"
                  fallbackType="project"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
