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
      return []
    }

    if (!notionBlogClient.isConfigured()) {
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
            return null
          }
        })
        .filter(Boolean) as BlogPostPreview[]

      return blogPosts
    } catch (error) {
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
      return null
    }

    try {
      const allPosts = await getAllBlogPosts()
      const postPreview = allPosts.find(post => post.slug === slug)
      
      if (!postPreview) {
        return null
      }

      const recordMap = await notionBlogClient.getPage(postPreview.id)
      const blogPost = transformNotionPageToBlogPost(postPreview, recordMap)
      
      return blogPost
    } catch (error) {
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