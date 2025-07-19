import { BlogPost, BlogPostPreview } from "@/types/blog"
import { NotionPage } from "@/types/notion"
import { withServerErrorHandling } from "@/lib/errors/server-error-handlers"
import { notionBlogClient } from "@/lib/notion/blog-client"
import { transformNotionPageToBlogPost, transformNotionPageToBlogPreview } from "./blog-transforms"
import { validateBlogEnvironment, sanitizeBlogPostPreview } from "./blog-validation"
import { getCachedBlogPosts, getCachedBlogPost } from "./blog-cache"

export async function getAllBlogPosts(): Promise<BlogPostPreview[]> {
  return withServerErrorHandling(
    () => getCachedBlogPosts(async () => {
    // Validate environment first
    const envValidation = validateBlogEnvironment()
    if (!envValidation.isValid) {
      console.warn("Blog environment validation failed:", envValidation.errors)
      return []
    }

    if (!notionBlogClient.isConfigured()) {
      console.warn("Notion not configured, returning empty blog posts")
      return []
    }

    try {
      const databaseId = process.env.NOTION_DATABASE_ID!
      const pages = await notionBlogClient.getBlogPosts(databaseId)
      
      const blogPosts = pages
        .map((page: NotionPage) => {
          try {
            const preview = transformNotionPageToBlogPreview(page)
            return sanitizeBlogPostPreview(preview)
          } catch (error) {
            console.error("Error transforming blog post preview:", error)
            return null
          }
        })
        .filter(Boolean) as BlogPostPreview[]

      console.log(`Successfully fetched ${blogPosts.length} blog posts`)
      return blogPosts
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      throw new Error("Failed to fetch blog posts from Notion")
    }
  }),
    "fetch-all-blog-posts",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return withServerErrorHandling(
    () => getCachedBlogPost(slug, async (slug: string) => {
    if (!notionBlogClient.isConfigured()) {
      console.warn("Notion not configured, returning null for blog post")
      return null
    }

    try {
      const allPosts = await getAllBlogPosts()
      const postPreview = allPosts.find(post => post.slug === slug)
      
      if (!postPreview) {
        console.warn(`Blog post with slug "${slug}" not found`)
        return null
      }

      const recordMap = await notionBlogClient.getPage(postPreview.id)
      const blogPost = transformNotionPageToBlogPost(postPreview, recordMap)
      
      console.log(`Successfully fetched blog post: ${slug}`)
      return blogPost
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error)
      throw new Error(`Failed to fetch blog post: ${slug}`)
    }
  }),
    `fetch-blog-post-${slug}`,
    {
      maxRetries: 2,
      baseDelay: 1000
    }
  )
}

export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPostPreview[]> {
  const allPosts = await getAllBlogPosts()
  return allPosts.slice(0, limit)
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPostPreview[]> {
  const allPosts = await getAllBlogPosts()
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
}