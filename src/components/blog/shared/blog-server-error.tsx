import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogServerErrorProps {
  title?: string
  description?: string
  showRetry?: boolean
}

export function BlogServerError({ 
  title = "Something went wrong",
  description = "An error occurred while loading the blog content. This might be a temporary issue.",
  showRetry = true
}: BlogServerErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      <div className="flex gap-3">
        {showRetry && (
          <Button asChild variant="outline">
            <Link href="/blog">
              Refresh Page
            </Link>
          </Button>
        )}
        <Button asChild variant="default">
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}