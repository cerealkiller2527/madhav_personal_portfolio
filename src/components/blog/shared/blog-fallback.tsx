import { AlertCircle, FileText, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogFallbackProps {
  type?: 'error' | 'offline' | 'empty' | 'loading'
  title?: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function BlogFallback({ 
  type = 'error', 
  title, 
  description, 
  action 
}: BlogFallbackProps) {
  const getDefaults = () => {
    switch (type) {
      case 'offline':
        return {
          icon: <Wifi className="h-12 w-12 text-muted-foreground" />,
          defaultTitle: "You're offline",
          defaultDescription: "Check your internet connection and try again.",
          defaultAction: { label: "Retry", onClick: () => window.location.reload() }
        }
      case 'empty':
        return {
          icon: <FileText className="h-12 w-12 text-muted-foreground" />,
          defaultTitle: "No posts found",
          defaultDescription: "There are no blog posts available at the moment. Check back later for new content.",
          defaultAction: { label: "Go to Homepage", href: "/" }
        }
      case 'loading':
        return {
          icon: (
            <div className="h-12 w-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
          ),
          defaultTitle: "Loading...",
          defaultDescription: "Please wait while we fetch the latest blog content.",
          defaultAction: undefined
        }
      default: // error
        return {
          icon: <AlertCircle className="h-12 w-12 text-destructive" />,
          defaultTitle: "Unable to load content",
          defaultDescription: "There was an error loading the blog content. Please try again.",
          defaultAction: { label: "Try again", onClick: () => window.location.reload() }
        }
    }
  }

  const defaults = getDefaults()
  const finalTitle = title || defaults.defaultTitle
  const finalDescription = description || defaults.defaultDescription
  const finalAction = action || defaults.defaultAction

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        {defaults.icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">
        {finalTitle}
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        {finalDescription}
      </p>

      {finalAction && (
        <div className="flex gap-3">
          {finalAction.href ? (
            <Button asChild variant={type === 'error' ? 'default' : 'outline'}>
              <Link href={finalAction.href}>
                {finalAction.label}
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={finalAction.onClick}
              variant={type === 'error' ? 'default' : 'outline'}
            >
              {finalAction.label}
            </Button>
          )}
          
          {type !== 'empty' && type !== 'loading' && (
            <Button asChild variant="ghost">
              <Link href="/blog">
                Back to Blog
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}