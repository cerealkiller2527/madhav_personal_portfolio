import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { BlogPostPreview } from "@/lib/types/blog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/common/section"

interface BlogPreviewProps {
  posts: BlogPostPreview[]
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) {
    return null // Don't show section if no posts
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Section 
      id="blog" 
      title="Latest Blog Posts"
      description="Thoughts on software engineering, web development, and technology"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} min
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {post.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {post.description}
                </p>
              )}

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Read more
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length > 3 && (
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </Section>
  )
}