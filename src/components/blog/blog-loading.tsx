import { LogoSpinner } from "@/components/ui/logo-spinner"

interface BlogLoadingProps {
  variant?: 'grid' | 'spinner'
  count?: number
}

export function BlogLoading({ variant = 'grid', count = 6 }: BlogLoadingProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center py-12">
        <LogoSpinner size="lg" showText text="Loading..." />
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