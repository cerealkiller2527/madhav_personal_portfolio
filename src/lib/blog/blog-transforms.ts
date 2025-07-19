import { ExtendedRecordMap } from "notion-types"
import { BlogPost, BlogPostPreview } from "@/types/blog"
import { NotionPage, NotionPropertyValue } from "@/types/notion"
import { BlogErrorHandler } from "@/lib/errors/server-error-handlers"
import { BlogErrorCode } from "@/types/blog"
import { notionBlogClient } from "@/lib/notion/blog-client"

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function extractCoverImageFromPage(page: NotionPage): string | undefined {
  try {
    if (page.cover) {
      if (page.cover.type === "external" && page.cover.external?.url) {
        return normalizeNotionImageUrl(page.cover.external.url)
      }
      if (page.cover.type === "file" && page.cover.file?.url) {
        return normalizeNotionImageUrl(page.cover.file.url)
      }
    }
    return undefined
  } catch (error) {
    return undefined
  }
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
      case "url":
        return property.url ? normalizeNotionImageUrl(property.url) : null
      case "files":
        const file = property.files?.[0]
        if (file?.file?.url) return normalizeNotionImageUrl(file.file.url)
        if (file?.external?.url) return normalizeNotionImageUrl(file.external.url)
        return null
      case "rich_text":
        // Sometimes URLs are stored as rich text
        const richText = property.rich_text?.[0]?.plain_text
        if (richText && (richText.startsWith('http') || richText.includes('.'))) {
          return normalizeNotionImageUrl(richText)
        }
        return richText || null
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

export function transformNotionPageToBlogPreview(page: NotionPage): BlogPostPreview | null {
  try {
    const properties = page.properties
    
    // Property extraction for blog post preview
    
    const title = extractPropertyValue(properties, "Name") || extractPropertyValue(properties, "Title")
    const description = extractPropertyValue(properties, "Description") || extractPropertyValue(properties, "Summary")
    const publishedAt = extractPropertyValue(properties, "Published Date") || extractPropertyValue(properties, "Date")
    const rawTags = extractPropertyValue(properties, "Tags")
    const tags = Array.isArray(rawTags) ? rawTags : []
    const category = extractPropertyValue(properties, "Category")
    
    // Try multiple possible property names for cover image
    let coverImage = extractPropertyValue(properties, "Cover") || 
                     extractPropertyValue(properties, "Image") || 
                     extractPropertyValue(properties, "cover") ||
                     extractPropertyValue(properties, "Featured Image") ||
                     extractPropertyValue(properties, "Cover Image") ||
                     extractPropertyValue(properties, "image") ||
                     extractPropertyValue(properties, "URL") ||
                     extractPropertyValue(properties, "url")
    
    // If we still don't have a cover image, try to find any property that might contain an image URL
    if (!coverImage) {
      for (const [key, property] of Object.entries(properties)) {
        const lowerKey = key.toLowerCase()
        if ((lowerKey.includes('image') || lowerKey.includes('cover') || lowerKey.includes('url') || lowerKey.includes('pic')) 
            && (property.type === 'url' || property.type === 'files' || property.type === 'rich_text')) {
          const value = extractPropertyValue(properties, key)
          if (value && typeof value === 'string') {
            coverImage = value
            break
          }
        }
      }
    }
    
    if (!title || typeof title !== "string" || !publishedAt || typeof publishedAt !== "string") {
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
    return null
  }
}

export async function transformNotionPageToBlogPreviewWithCover(page: NotionPage): Promise<BlogPostPreview | null> {
  try {
    // First get the basic preview
    const preview = transformNotionPageToBlogPreview(page)
    if (!preview) return null
    
    // Try to get cover image from official API
    try {
      const pageWithCover = await notionBlogClient.getPageWithCover(page.id)
      const coverImageFromAPI = extractCoverImageFromPage(pageWithCover)
      
      return {
        ...preview,
        coverImage: coverImageFromAPI || preview.coverImage
      }
    } catch (error) {
      return preview // Return preview without cover if API call fails
    }
  } catch (error) {
    const blogError = BlogErrorHandler.handleBlogError(error, "transform-blog-preview-with-cover")
    return null
  }
}

function normalizeNotionImageUrl(url: string): string {
  // If it's already a full URL (external URL), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Handle relative URLs by converting them to full Notion URLs
  if (url.startsWith('/')) {
    return `https://www.notion.so${url}`
  }
  
  // If it doesn't start with protocol or slash, assume it's a relative path
  if (!url.includes('://') && url.length > 0) {
    return `https://www.notion.so/${url}`
  }
  
  return url
}

function getCoverImageFromRecordMap(recordMap: ExtendedRecordMap, pageId: string): string | undefined {
  try {
    const block = recordMap.block?.[pageId]?.value
    if (block?.format?.page_cover) {
      const coverUrl = block.format.page_cover
      return normalizeNotionImageUrl(coverUrl)
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

export function transformNotionPageToBlogPost(
  preview: BlogPostPreview, 
  recordMap: ExtendedRecordMap
): BlogPost {
  // Extract cover image from recordMap (this is more reliable than database properties)
  const coverImageFromRecordMap = getCoverImageFromRecordMap(recordMap, preview.id)
  
  return {
    id: preview.id,
    slug: preview.slug,
    title: preview.title,
    description: preview.description,
    publishedAt: preview.publishedAt,
    updatedAt: preview.publishedAt, // Use published date as fallback
    tags: preview.tags,
    category: preview.category,
    coverImage: coverImageFromRecordMap || preview.coverImage, // Prefer recordMap cover over database property
    published: true,
    recordMap,
  }
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}