"use client"

import Image from "next/image"
import { useState } from "react"
import { FileText } from "lucide-react"

interface BlogImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  showFallback?: boolean
  fallbackIcon?: React.ReactNode
}

export function BlogImage({ 
  src, 
  alt, 
  fill = false, 
  className = "", 
  priority = false,
  width,
  height,
  showFallback = true,
  fallbackIcon
}: BlogImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError && showFallback) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        {fallbackIcon || <FileText className="h-8 w-8 text-muted-foreground/50" />}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  )
}