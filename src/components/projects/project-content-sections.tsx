/**
 * Project Content Sections Component
 * 
 * Renders project content sections (features, tech stack, gallery)
 * for both modal and full-page views with appropriate styling.
 */

import type { Project } from "@/lib/schemas"
import { Badge } from "@/components/ui/badge"
import { hasProjectContent } from "@/lib/utils/project-utils"
import { ContentImage } from "@/components/common/content/content-image"

// ============================================================================
// Types
// ============================================================================

interface ProjectContentSectionsProps {
  /** The project data to display */
  project: Project
  /** Whether the project has Notion content (sections are hidden if true) */
  hasNotionContent: boolean
  /** Display variant - affects heading sizes and spacing */
  variant?: "modal" | "full-page"
}

// ============================================================================
// Component
// ============================================================================

/**
 * Renders project content sections when Notion content is not available.
 * Adapts styling based on whether it's displayed in a modal or full page.
 */
export function ProjectContentSections({ 
  project, 
  hasNotionContent,
  variant = "modal"
}: ProjectContentSectionsProps) {
  // Don't render if Notion content is available (it includes these sections)
  if (hasNotionContent) {
    return null
  }

  // Styling based on variant
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
  const galleryHeight = isFullPage ? "h-56" : "h-48"

  return (
    <>
      {/* Key Features Section */}
      {hasProjectContent(project, 'features') && (
        <section id="features" className={sectionClass}>
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

      {/* Tech Stack Section */}
      {hasProjectContent(project, 'tech-stack') && (
        <section id="tech-stack" className={sectionClass}>
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

      {/* Gallery Section */}
      {hasProjectContent(project, 'gallery') && (
        <section id="gallery" className={sectionClass}>
          <h2 className={headingClass}>Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery?.map((image, index) => (
              <div key={index} className={`relative w-full ${galleryHeight} rounded-md overflow-hidden`}>
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
