/**
 * Universal Content Image Component
 * Meta Engineering Standards: Reusable, performant, accessible
 * Handles images for both Blog and Project content with consistent fallbacks
 */

"use client"

import Image from "next/image"
import { useState } from "react"
import { FileText, Image as ImageIcon } from "lucide-react"

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
  className = "", 
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
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <FallbackIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    )
  }

  // Don't show fallback for placeholder.svg - just return empty div
  if (hasError && src.includes('placeholder.svg')) {
    return <div className={`bg-muted ${className}`} />
  }

  if (hasError) {
    const FallbackIcon = FALLBACK_ICONS[fallbackType]
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <FallbackIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${!fill ? className : ''}`}
        priority={priority}
        sizes={sizes}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className={`absolute inset-0 bg-muted animate-pulse ${fill ? '' : className}`} />
      )}
    </div>
  )
}