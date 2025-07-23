import Link from "next/link"
import { Calendar, Clock, FileText } from "lucide-react"
import { BlogPreview } from "@/schemas"
import { Badge } from "@/components/ui/badge"
import { BlogImage } from "@/components/blog/blog-image"

interface BlogCardProps {
  post: BlogPreview
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {post.coverImage ? (
          <BlogImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackIcon={<FileText className="h-12 w-12 text-muted-foreground/50" />}
          />
        ) : (
          <div className="relative h-48 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
            {post.description}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}