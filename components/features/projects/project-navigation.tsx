"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectNavigationProps {
  nextProject?: Project | null
  previousProject?: Project | null
}

const NavCard = ({ project, direction }: { project: Project; direction: "left" | "right" }) => (
  <Link
    href={`/projects/${project.id}`}
    className="group flex items-center w-full max-w-sm md:w-96 p-6 gap-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/5 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-primary/10"
  >
    {direction === "left" ? (
      <>
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={project.heroImage || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-3 flex-grow min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="h-3 w-3" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
              Previous
            </p>
          </div>
          <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
            <span className="block truncate">{project.title}</span>
          </h4>
        </div>
      </>
    ) : (
      <>
        <div className="flex flex-col gap-3 flex-grow min-w-0 text-right">
          <div className="flex items-center gap-3 justify-end">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
              Next
            </p>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
          <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
            <span className="block truncate">{project.title}</span>
          </h4>
        </div>
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={project.heroImage || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </>
    )}
  </Link>
)

export function ProjectNavigation({ nextProject, previousProject }: ProjectNavigationProps) {
  return (
    <div className="mt-24 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        {/* Left Card Wrapper */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          {previousProject ? (
            <NavCard project={previousProject} direction="left" />
          ) : (
            /* Placeholder to maintain symmetry if no previous project */
            <div className="hidden md:block w-96 h-1" />
          )}
        </div>
        {/* Right Card Wrapper */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          {nextProject ? (
            <NavCard project={nextProject} direction="right" />
          ) : (
            /* Placeholder to maintain symmetry if no next project */
            <div className="hidden md:block w-96 h-1" />
          )}
        </div>
      </div>
    </div>
  )
}
