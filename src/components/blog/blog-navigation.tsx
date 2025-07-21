import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogPreview } from "@/types"

interface BlogNavigationProps {
  previousPost?: BlogPreview
  nextPost?: BlogPreview
}

const BlogNavCard = ({ post, direction }: { post: BlogPreview; direction: "left" | "right" }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group flex items-center w-full max-w-md md:w-[28rem] p-6 gap-6 rounded-2xl border border-orange-200/20 dark:border-orange-400/20 bg-orange-50/10 dark:bg-orange-900/10 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-orange-400/40 hover:bg-orange-100/20 dark:hover:bg-orange-800/20 hover:shadow-orange-200/20 dark:hover:shadow-orange-400/20"
  >
    {direction === "left" ? (
      <>
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={post.coverImage || "/placeholder.svg?height=80&width=80&text=Blog"}
            alt={post.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-3 flex-grow min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="h-3 w-3" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
              Previous
            </p>
          </div>
          <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
            <span className="block truncate">{post.title}</span>
          </h4>
          {post.description && (
            <p className="text-xs text-muted-foreground truncate">
              {post.description}
            </p>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="flex flex-col gap-3 flex-grow min-w-0 text-right">
          <div className="flex items-center gap-3 justify-end">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
              Next
            </p>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
          <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
            <span className="block truncate">{post.title}</span>
          </h4>
          {post.description && (
            <p className="text-xs text-muted-foreground truncate">
              {post.description}
            </p>
          )}
        </div>
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={post.coverImage || "/placeholder.svg?height=80&width=80&text=Blog"}
            alt={post.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </>
    )}
  </Link>
)

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <div className="mt-24 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        {/* Left Card Wrapper */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          {previousPost ? (
            <BlogNavCard post={previousPost} direction="left" />
          ) : (
            /* Placeholder to maintain symmetry if no previous post */
            <div className="hidden md:block w-[28rem] h-1" />
          )}
        </div>

        {/* Center "All Posts" Button */}
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              All Posts
            </Link>
          </Button>
        </div>

        {/* Right Card Wrapper */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          {nextPost ? (
            <BlogNavCard post={nextPost} direction="right" />
          ) : (
            /* Placeholder to maintain symmetry if no next post */
            <div className="hidden md:block w-[28rem] h-1" />
          )}
        </div>
      </div>
    </div>
  )
}