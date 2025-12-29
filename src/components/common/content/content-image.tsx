// Image component with loading states and fallback icons

"use client"

import Image from "next/image"
import { useState } from "react"
import { FileText, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/core/utils"

interface ContentImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  fallbackType?: 'blog' | 'project' | 'generic'
  sizes?: string
}

const FALLBACK_ICONS = {
  blog: FileText,
  project: ImageIcon,
  generic: ImageIcon,
} as const

export function ContentImage({ 
  src, 
  alt, 
  fill = false, 
  className, 
  priority = false,
  width,
  height,
  fallbackType = 'generic',
  sizes
}: ContentImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Handle empty src - show fallback immediately
  if (!src || src.trim() === '') {
    const FallbackIcon = FALLBACK_ICONS[fallbackType]
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <FallbackIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    )
  }

  if (hasError) {
    const FallbackIcon = FALLBACK_ICONS[fallbackType]
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <FallbackIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    )
  }

  if (fill) {
    return (
      <>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          priority={priority}
          sizes={sizes}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </>
    )
  }
  
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        priority={priority}
        sizes={sizes}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  )
}