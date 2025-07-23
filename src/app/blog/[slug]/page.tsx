import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/notion/notion-service"
import type { BlogPreview } from "@/lib/schemas"
import { LoadingGrid } from "@/components/common/ui/loading-states"
import { BlogContentWithTOC } from "@/components/pages/blog/blog-post-with-toc"

interface BlogContentPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogContentPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
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

export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts()
    if (!posts || posts.length === 0) {
      console.log('No blog posts found for static generation')
      return []
    }
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams for blog:', error)
    return []
  }
}

async function BlogContentContent({ slug }: { slug: string }) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts()
  ])

  if (!post) {
    notFound()
  }

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p: BlogPreview) => p.slug === slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined

  return (
    <BlogContentWithTOC 
      post={post}
      previousPost={previousPost}
      nextPost={nextPost}
    />
  )
}

export default async function BlogContentPage({ params }: BlogContentPageProps) {
  const { slug } = await params
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <LoadingGrid variant="blog" count={1} />
          </div>
        </div>
      </div>
    }>
      <BlogContentContent slug={slug} />
    </Suspense>
  )
}