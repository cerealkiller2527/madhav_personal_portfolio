import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog/blog-queries"
import { BlogRenderer } from "@/components/blog/blog-post/blog-renderer"
import { BlogHeader } from "@/components/blog/blog-post/blog-header"
import { BlogNavigation } from "@/components/blog/blog-post/blog-navigation"
import { BlogLoading } from "@/components/blog/shared/blog-loading"
import { Button } from "@/components/ui/button"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60 // Revalidate every 60 seconds

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: "Post Not Found - Blog - Madhav Lodha",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} - Blog - Madhav Lodha`,
    description: post.description || "Blog post by Madhav Lodha",
    openGraph: {
      title: post.title,
      description: post.description || "Blog post by Madhav Lodha",
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Madhav Lodha"],
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  }
}

async function BlogPostContent({ slug }: { slug: string }) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts()
  ])

  if (!post) {
    notFound()
  }

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article>
            <BlogHeader 
              post={post}
              author={{
                name: "Madhav Lodha",
                avatar: "/assets/portfolio/avatar-logo.png"
              }}
              readingTime={post.description?.split(' ').length ? Math.ceil(post.description.split(' ').length / 200) : undefined}
            />

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <BlogRenderer recordMap={post.recordMap} />
            </div>
          </article>

          <BlogNavigation 
            previousPost={previousPost}
            nextPost={nextPost}
          />
        </div>
      </div>
    </div>
  )
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <BlogLoading variant="page" />
          </div>
        </div>
      </div>
    }>
      <BlogPostContent slug={params.slug} />
    </Suspense>
  )
}