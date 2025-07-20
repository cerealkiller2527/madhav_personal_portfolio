import Image from "next/image"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { BlogPost } from "@/types/blogTypes"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BlogImage } from "@/components/blog/blog-image"

interface BlogHeaderProps {
  post: BlogPost
  author?: {
    name: string
    avatar?: string
  }
  readingTime?: number
}

export function BlogHeader({ post, author, readingTime }: BlogHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <header className="mb-8">
      {post.coverImage && (
        <div className="relative h-64 md:h-80 mb-8 -mx-4 md:mx-0 rounded-none md:rounded-lg overflow-hidden">
          <BlogImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            showFallback={false}
          />
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
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
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <User className="h-4 w-4" />
              <span>{author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
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

        {post.tags.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              {post.tags.map((tag) => (
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