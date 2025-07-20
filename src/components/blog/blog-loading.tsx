import { LogoSpinner, LogoSpinnerInline } from "@/components/ui/logo-spinner"

interface BlogLoadingProps {
  variant?: 'card' | 'page' | 'list' | 'spinner'
  count?: number
}

export function BlogLoading({ variant = 'card', count = 3 }: BlogLoadingProps) {
  // Centered spinner variant for when we want the logo
  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center py-12">
        <LogoSpinner size="lg" showText text="Loading blog posts..." />
      </div>
    )
  }
  if (variant === 'page') {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full"></div>
          ))}
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-muted rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}