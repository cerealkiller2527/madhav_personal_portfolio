import { ExtendedRecordMap } from "notion-types"
import { BlogPost, BlogPostPreview } from "@/lib/types/blog"

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function extractPropertyValue(properties: any, propertyName: string): any {
  const property = properties[propertyName]
  if (!property) return null

  switch (property.type) {
    case "title":
      return property.title?.[0]?.plain_text || ""
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || ""
    case "date":
      return property.date?.start || null
    case "checkbox":
      return property.checkbox || false
    case "multi_select":
      return property.multi_select?.map((tag: any) => tag.name) || []
    case "select":
      return property.select?.name || null
    case "files":
      return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || null
    default:
      return null
  }
}

export function transformNotionPageToBlogPreview(page: any): BlogPostPreview | null {
  try {
    const properties = page.properties
    
    const title = extractPropertyValue(properties, "Name") || extractPropertyValue(properties, "Title")
    const description = extractPropertyValue(properties, "Description") || extractPropertyValue(properties, "Summary")
    const publishedAt = extractPropertyValue(properties, "Published Date") || extractPropertyValue(properties, "Date")
    const tags = extractPropertyValue(properties, "Tags") || []
    const category = extractPropertyValue(properties, "Category")
    const coverImage = extractPropertyValue(properties, "Cover") || extractPropertyValue(properties, "Image")
    
    if (!title || !publishedAt) {
      console.warn("Missing required fields for blog post preview:", { title, publishedAt })
      return null
    }

    const slug = createSlugFromTitle(title)

    return {
      id: page.id,
      slug,
      title,
      description,
      publishedAt,
      tags,
      category,
      coverImage,
      readingTime: Math.ceil(Math.random() * 10 + 2), // Placeholder reading time
    }
  } catch (error) {
    console.error("Error transforming Notion page to blog preview:", error)
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