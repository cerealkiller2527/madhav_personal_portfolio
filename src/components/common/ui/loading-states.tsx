/**
 * Loading States Component
 * Provides consistent loading skeletons for blog content
 */

import { ContentGrid, GRID_CONFIGS } from "@/components/common/content/content-grid"

interface LoadingGridProps {
  count?: number
  className?: string
}

/**
 * Loading skeleton for blog cards
 */
function LoadingCard({ className = "" }: { className?: string }) {
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
 * Loading grid for blog posts
 */
export function LoadingGrid({ count = 6, className = "" }: LoadingGridProps) {
  return (
    <div className={className}>
      <ContentGrid config={GRID_CONFIGS.blog}>
        {Array.from({ length: count }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </ContentGrid>
    </div>
  )
}
