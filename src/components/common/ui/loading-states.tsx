// Loading skeleton components for blog content

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ContentGrid, GRID_CONFIGS } from "@/components/common/content/content-grid"

interface LoadingGridProps {
  count?: number
  className?: string
}

// Loading skeleton for blog cards
function LoadingCard({ className = "" }: { className?: string }) {
  return (
    <Card className={className}>
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  )
}

// Loading grid for blog posts
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
