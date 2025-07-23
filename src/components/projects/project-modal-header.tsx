import Link from "next/link"
import type { Project } from "@/schemas"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Maximize, X } from "lucide-react"

interface ProjectModalHeaderProps {
  project: Project
  onClose: () => void
}

export function ProjectModalHeader({ project, onClose }: ProjectModalHeaderProps) {
  return (
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
  )
}