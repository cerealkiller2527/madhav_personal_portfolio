import Image from "next/image"
import type { Project } from "@/schemas"
import { formatProjectIndex } from "@/lib/projects"

interface ProjectMediaProps {
  project: Project
  index: number
}

export function ProjectMedia({ project, index }: ProjectMediaProps) {
  return (
    <div className="relative w-full aspect-video bg-secondary/10 overflow-hidden rounded-t-2xl">
      {project.vectaryEmbedUrl ? (
        <iframe
          src={project.vectaryEmbedUrl}
          title={`${project.title} 3D Model`}
          frameBorder="0"
          className="w-full h-full"
          allow="fullscreen; xr-spatial-tracking; camera; microphone"
        />
      ) : (
        <Image
          src={project.heroImage || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
        />
      )}
      <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-white dark:text-primary">
          {formatProjectIndex(index)}
        </span>
      </div>
    </div>
  )
}