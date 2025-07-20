import Image from "next/image"
import type { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { hasProjectContent } from "@/lib/projects/project-helpers"

interface ProjectContentSectionsProps {
  project: Project
  hasNotionContent: boolean
}

export function ProjectContentSections({ project, hasNotionContent }: ProjectContentSectionsProps) {
  if (hasNotionContent) {
    return null // Notion content is rendered separately
  }

  return (
    <>
      {hasProjectContent(project, 'features') && (
        <div id="features" className="mt-12 scroll-mt-24">
          <h4 className="text-xl font-semibold mb-4 border-b pb-2">Key Features</h4>
          <ul className="space-y-4">
            {project.keyFeatures?.map((feature) => (
              <li key={feature.title}>
                <p className="font-semibold text-foreground">{feature.title}</p>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasProjectContent(project, 'tech-stack') && (
        <div id="tech-stack" className="mt-12 scroll-mt-24">
          <h4 className="text-xl font-semibold mb-4 border-b pb-2">Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech) => (
              <Badge key={tech.name} variant="secondary">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasProjectContent(project, 'gallery') && (
        <div id="gallery" className="mt-12 scroll-mt-24">
          <h4 className="text-xl font-semibold mb-4 border-b pb-2">Gallery</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery?.map((image, index) => (
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
    </>
  )
}