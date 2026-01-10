// Image component with loading states and placeholder support

"use client"

import Image from "next/image"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Placeholder } from "@/components/common/ui/placeholder"
import { cn } from "@/lib/core/utils"

type PlaceholderType = "project" | "blog" | "generic"

interface ContentImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  sizes?: string
  placeholderType?: PlaceholderType
}

export function ContentImage({ 
  src, 
  alt, 
  fill = false, 
  className, 
  priority = false,
  width,
  height,
  sizes,
  placeholderType = "generic"
}: ContentImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Show placeholder if no src provided
  if (!src || src.trim() === '') {
    if (fill) {
      return <Placeholder type={placeholderType} className="absolute inset-0" />
    }
    return <Placeholder type={placeholderType} />
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
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <Skeleton className="absolute inset-0" />
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
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
    </div>
  )
}
