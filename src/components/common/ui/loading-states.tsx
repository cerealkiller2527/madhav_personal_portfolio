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
  variant: 'blog'
  className?: string
}

/**
 * Loading skeleton for blog cards
 */
export function LoadingCard({ className = "" }: LoadingCardProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-48 bg-muted rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  )
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
          <LoadingCard key={i} variant="blog" />
        ))}
      </ContentGrid>
    </div>
  )
}
