/**
 * Universal Loading States Component
 * Provides consistent loading skeletons across all domains
 */

import { ContentGrid, GRID_CONFIGS, type GridConfigName } from "@/components/common/content/content-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface LoadingGridProps {
  variant: GridConfigName
  count?: number
  className?: string
}

interface LoadingCardProps {
  variant: 'blog' | 'project' | 'experience' | 'generic'
  className?: string
}

/**
 * Loading skeleton for individual cards
 */
export function LoadingCard({ variant, className = "" }: LoadingCardProps) {
  const variants = {
    blog: (
      <Card className={className}>
        <Skeleton className="h-48 rounded-lg mb-4" />
        <CardContent className="space-y-2 p-6">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    ),
    project: (
      <Card className={className}>
        <Skeleton className="h-64 rounded-xl mb-6" />
        <CardContent className="space-y-3 p-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ),
    experience: (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    generic: (
      <Card className={className}>
        <Skeleton className="h-32 rounded-lg mb-4" />
        <CardContent className="space-y-2 p-6">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  return variants[variant]
}

/**
 * Loading grid for collections of items
 */
export function LoadingGrid({ variant, count = 6, className = "" }: LoadingGridProps) {
  const config = GRID_CONFIGS[variant]
  
  return (
    <div className={className}>
      <ContentGrid config={config}>
        {Array.from({ length: count }).map((_, i) => (
          <LoadingCard 
            key={i} 
            variant={variant === 'blog' ? 'blog' : variant === 'projects' ? 'project' : 'generic'} 
          />
        ))}
      </ContentGrid>
    </div>
  )
}

/**
 * Simple loading spinner
 */
export function LoadingSpinner({ size = 'md', className = "" }: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]} ${className}`} />
  )
}

/**
 * Loading text with animated dots
 */
export function LoadingText({ text = "Loading", className = "" }: {
  text?: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-1 text-muted-foreground ${className}`}>
      <span>{text}</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}