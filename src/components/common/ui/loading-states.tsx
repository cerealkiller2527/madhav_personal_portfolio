/**
 * Universal Loading States Component
 * Provides consistent loading skeletons across all domains
 */

import { ContentGrid, GRID_CONFIGS, type GridConfigName } from "@/components/common/content/content-grid"

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
      <div className={`animate-pulse ${className}`}>
        <div className="h-48 bg-muted rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    ),
    project: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-64 bg-muted rounded-xl mb-6"></div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    ),
    experience: (
      <div className={`animate-pulse ${className}`}>
        <div className="flex gap-4">
          <div className="h-16 w-16 bg-muted rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
    generic: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-muted rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
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
