import { BlogPost, BlogPostPreview } from "@/lib/types/blog"
import { notionClient } from "./notion-client"
import { transformNotionPageToBlogPost, transformNotionPageToBlogPreview } from "./blog-transforms"

export async function getAllBlogPosts(): Promise<BlogPostPreview[]> {
  if (!notionClient.isConfigured()) {
    console.warn("Notion not configured, returning empty blog posts")
    return []
  }

  try {
    const databaseId = process.env.NOTION_DATABASE_ID!
    const pages = await notionClient.getDatabasePages(databaseId)
    
    const blogPosts = await Promise.all(
      pages.map(async (page: any) => {
        return transformNotionPageToBlogPreview(page)
      })
    )

    return blogPosts.filter(Boolean) as BlogPostPreview[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!notionClient.isConfigured()) {
    console.warn("Notion not configured, returning null for blog post")
    return null
  }

  try {
    const allPosts = await getAllBlogPosts()
    const postPreview = allPosts.find(post => post.slug === slug)
    
    if (!postPreview) {
      return null
    }

    const recordMap = await notionClient.getPage(postPreview.id)
    return transformNotionPageToBlogPost(postPreview, recordMap)
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
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