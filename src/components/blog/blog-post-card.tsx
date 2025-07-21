import Link from "next/link"
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react"
import { BlogPreview } from "@/types"
import { Badge } from "@/components/ui/badge"
import { BlogImage } from "@/components/blog/blog-image"
import { formatBlogDate, getDisplayTags } from "@/lib/blog"

interface BlogContentCardProps {
  post: BlogPreview
}

export function BlogContentCard({ post }: BlogContentCardProps) {
  const { visible: visibleTags, overflow: overflowCount } = getDisplayTags(post.tags)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        {post.coverImage ? (
          <BlogImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackIcon={<FileText className="h-8 w-8 text-muted-foreground/50" />}
          />
        ) : (
          <div className="relative h-40 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatBlogDate(post.publishedAt)}
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
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{overflowCount}
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
  )
}