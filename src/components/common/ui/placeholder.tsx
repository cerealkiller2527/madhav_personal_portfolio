// Placeholder component for missing images

import { Image as ImageIcon, FileText, Box } from "lucide-react"
import { cn } from "@/lib/core/utils"

type PlaceholderType = "project" | "blog" | "generic"

interface PlaceholderProps {
  type?: PlaceholderType
  className?: string
  iconSize?: "sm" | "md" | "lg"
}

const ICONS = {
  project: Box,
  blog: FileText,
  generic: ImageIcon,
} as const

const ICON_SIZES = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
}

export function Placeholder({ 
  type = "generic", 
  className,
  iconSize = "md" 
}: PlaceholderProps) {
  const Icon = ICONS[type]
  
  return (
    <div className={cn(
      "w-full h-full glass-subtle flex items-center justify-center",
      className
    )}>
      <Icon className={cn(ICON_SIZES[iconSize], "text-muted-foreground/40")} />
    </div>
  )
}
