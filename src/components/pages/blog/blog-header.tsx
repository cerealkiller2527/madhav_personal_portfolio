import { Calendar, Clock, Tag } from "lucide-react"
import { BlogContent } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ContentImage } from "@/components/common/content/content-image"
import { formatBlogDate } from "@/lib/utils/blog-utils"

interface BlogHeaderProps {
  post: BlogContent
  author?: {
    name: string
    avatar?: string
  }
  readingTime?: number
}

export function BlogHeader({ post, author, readingTime }: BlogHeaderProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="mb-8">
      {post.coverImage && (
        <div className="mb-8 -mx-4 md:mx-0 rounded-none md:rounded-lg overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <ContentImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 800px"
            />
          </AspectRatio>
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight break-words">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar || "/assets/portfolio/avatar-logo.png"} alt={author.name} />
                <AvatarFallback className="text-xs">{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <span>{author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatBlogDate(post.publishedAt)}</span>
          </div>

          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          )}

          {post.category && (
            <Badge variant="outline">
              {post.category}
            </Badge>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}

        <Separator />
      </div>
    </header>
  )
}
