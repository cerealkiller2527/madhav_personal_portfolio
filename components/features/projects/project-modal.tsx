"use client"

import { useRef } from "react"
import Image from "next/image"
import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { TableOfContents } from "@/components/ui/table-of-contents"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, X } from "lucide-react"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Key Features" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "gallery", label: "Gallery" },
]

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-4rem)] max-w-6xl h-[90vh] max-h-[900px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl">{project.title}</DialogTitle>
            <DialogDescription>{project.subtitle}</DialogDescription>
          </div>
          <div className="flex items-center gap-2 -mt-2 -mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-primary hover:text-white"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View project in a new page"
                    >
                      <Maximize className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View full page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden">
          <aside className="hidden md:block md:col-span-1 p-6 border-r">
            <TableOfContents sections={sections} containerRef={contentRef} />
          </aside>

          <main className="md:col-span-4 overflow-y-auto p-8" ref={contentRef}>
            <div id="overview" className="scroll-mt-24">
              <div className="relative w-full h-64 md:h-80 mb-8 rounded-md overflow-hidden">
                <Image
                  src={project.heroImage || "/placeholder.svg"}
                  alt={`${project.title} hero image`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover bg-secondary"
                />
              </div>
              <div
                className="prose dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
              />
            </div>

            <div id="features" className="mt-12 scroll-mt-24">
              <h4 className="text-xl font-semibold mb-4 border-b pb-2">Key Features</h4>
              <ul className="space-y-4">
                {project.keyFeatures.map((feature) => (
                  <li key={feature.title}>
                    <p className="font-semibold text-foreground">{feature.title}</p>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div id="tech-stack" className="mt-12 scroll-mt-24">
              <h4 className="text-xl font-semibold mb-4 border-b pb-2">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech.name} variant="secondary">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div id="gallery" className="mt-12 scroll-mt-24">
              <h4 className="text-xl font-semibold mb-4 border-b pb-2">Gallery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((image, index) => (
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
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
