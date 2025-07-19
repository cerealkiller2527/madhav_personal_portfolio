import { ExtendedRecordMap } from "notion-types"
import { BlogPost, BlogPostPreview } from "@/types/blog"
import { NotionPage, NotionPropertyValue } from "@/types/notion"
import { BlogErrorHandler } from "@/lib/errors/server-error-handlers"
import { BlogErrorCode } from "@/types/blog"

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function extractPropertyValue(properties: Record<string, NotionPropertyValue>, propertyName: string): string | string[] | boolean | null {
  const property = properties[propertyName]
  if (!property) return null

  try {
    switch (property.type) {
      case "title":
        return property.title?.[0]?.plain_text || ""
      case "rich_text":
        return property.rich_text?.[0]?.plain_text || ""
      case "date":
        return property.date?.start || null
      case "checkbox":
        return property.checkbox
      case "multi_select":
        return property.multi_select?.map(tag => tag.name) || []
      case "select":
        return property.select?.name || null
      case "files":
        return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || null
      default:
        return null
    }
  } catch (error) {
    console.warn(`Failed to extract property ${propertyName}:`, error)
    return null
  }
}

export function transformNotionPageToBlogPreview(page: NotionPage): BlogPostPreview | null {
  try {
    const properties = page.properties
    
    const title = extractPropertyValue(properties, "Name") || extractPropertyValue(properties, "Title")
    const description = extractPropertyValue(properties, "Description") || extractPropertyValue(properties, "Summary")
    const publishedAt = extractPropertyValue(properties, "Published Date") || extractPropertyValue(properties, "Date")
    const rawTags = extractPropertyValue(properties, "Tags")
    const tags = Array.isArray(rawTags) ? rawTags : []
    const category = extractPropertyValue(properties, "Category")
    const coverImage = extractPropertyValue(properties, "Cover") || extractPropertyValue(properties, "Image")
    
    if (!title || typeof title !== "string" || !publishedAt || typeof publishedAt !== "string") {
      console.warn("Missing required fields for blog post preview:", { title, publishedAt })
      return null
    }

    const slug = createSlugFromTitle(title)

    return {
      id: page.id,
      slug,
      title,
      description: typeof description === "string" ? description : undefined,
      publishedAt,
      tags,
      category: typeof category === "string" ? category : undefined,
      coverImage: typeof coverImage === "string" ? coverImage : undefined,
      readingTime: Math.ceil(Math.random() * 10 + 2), // Placeholder reading time
    }
  } catch (error) {
    const blogError = BlogErrorHandler.handleBlogError(error, "transform-blog-preview")
    console.error("Error transforming Notion page to blog preview:", blogError)
    return null
  }
}

export function transformNotionPageToBlogPost(
  preview: BlogPostPreview, 
  recordMap: ExtendedRecordMap
): BlogPost {
  return {
    id: preview.id,
    slug: preview.slug,
    title: preview.title,
    description: preview.description,
    publishedAt: preview.publishedAt,
    updatedAt: preview.publishedAt, // Use published date as fallback
    tags: preview.tags,
    category: preview.category,
    coverImage: preview.coverImage,
    published: true,
    recordMap,
  }
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}