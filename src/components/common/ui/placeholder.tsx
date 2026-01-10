// Placeholder component for missing images

import { Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/core/utils"

interface PlaceholderProps {
  className?: string
}

export function Placeholder({ className }: PlaceholderProps) {
  return (
    <div className={cn(
      "w-full h-full glass-subtle flex items-center justify-center",
      className
    )}>
      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
    </div>
  )
}
