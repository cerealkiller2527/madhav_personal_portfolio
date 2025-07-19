import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogPostPreview } from "@/lib/types/blog"

interface BlogNavigationProps {
  previousPost?: BlogPostPreview
  nextPost?: BlogPostPreview
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="border-t pt-8 mt-12">
      <div className="flex justify-between items-center gap-4">
        {previousPost ? (
          <Button asChild variant="outline" className="flex-1 h-auto p-4 justify-start">
            <Link href={`/blog/${previousPost.slug}`}>
              <div className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Previous
                  </div>
                  <div className="font-medium truncate">
                    {previousPost.title}
                  </div>
                </div>
              </div>
            </Link>
          </Button>
        ) : (
          <div className="flex-1" />
        )}

        <Button asChild variant="outline">
          <Link href="/blog">
            All Posts
          </Link>
        </Button>

        {nextPost ? (
          <Button asChild variant="outline" className="flex-1 h-auto p-4 justify-end">
            <Link href={`/blog/${nextPost.slug}`}>
              <div className="flex items-center gap-3">
                <div className="text-right min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Next
                  </div>
                  <div className="font-medium truncate">
                    {nextPost.title}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </div>
            </Link>
          </Button>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  )
}