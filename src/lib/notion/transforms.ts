/**
 * Unified Notion Data Transformations
 * Handles converting Notion pages to typed content objects
 */

import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionPropertyValue,
  BlogContent,
  BlogPreview,
  ProjectContent,
  ProjectPreview,
  NotionError,
  NotionErrorCode
} from "@/types"

// =============================================================================
// PROPERTY EXTRACTION UTILITIES
// =============================================================================

function extractPropertyValue(
  properties: Record<string, NotionPropertyValue>,
  propertyName: string
): string | string[] | boolean | null {
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
        return property.checkbox || false
      case "multi_select":
        return property.multi_select?.map(tag => tag.name) || []
      case "select":
        return property.select?.name || null
      case "url":
        return property.url ? normalizeImageUrl(property.url) : null
      case "files":
        const file = property.files?.[0]
        if (file?.file?.url) return normalizeImageUrl(file.file.url)
        if (file?.external?.url) return normalizeImageUrl(file.external.url)
        return null
      default:
        return null
    }
  } catch {
    return null
  }
}

function tryMultipleProperties(
  properties: Record<string, NotionPropertyValue>,
  propertyNames: string[]
): string | string[] | boolean | null {
  for (const name of propertyNames) {
    const value = extractPropertyValue(properties, name)
    if (value !== null && value !== "") {
      return value
    }
  }
  return null
}

function normalizeImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/')) {
    return `https://www.notion.so${url}`
  }
  
  if (!url.includes('://') && url.length > 0) {
    return `https://www.notion.so/${url}`
  }
  
  return url
}

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function extractCoverImageFromRecordMap(recordMap: ExtendedRecordMap, pageId: string): string | undefined {
  try {
    const block = recordMap.block?.[pageId]?.value
    if (block?.format?.page_cover) {
      return normalizeImageUrl(block.format.page_cover)
    }
    return undefined
  } catch {
    return undefined
  }
}

// =============================================================================
// BLOG TRANSFORMS
// =============================================================================

export function transformToBlogPreview(page: NotionPage): BlogPreview | null {
  try {
    const properties = page.properties
    
    // Extract required fields
    const title = tryMultipleProperties(properties, ["Name", "Title"]) as string
    const publishedAt = tryMultipleProperties(properties, ["Published Date", "Date"]) as string
    
    if (!title || !publishedAt) {
      return null
    }

    // Extract optional fields
    const description = tryMultipleProperties(properties, ["Description", "Summary"]) as string
    const category = tryMultipleProperties(properties, ["Category"]) as string
    const rawTags = tryMultipleProperties(properties, ["Tags"]) as string[]
    const tags = Array.isArray(rawTags) ? rawTags : []
    
    // Try to get cover image from multiple possible property names
    const coverImage = tryMultipleProperties(properties, [
      "Cover", "Image", "cover", "Featured Image", "Cover Image", "image", "URL", "url"
    ]) as string

    const slug = createSlugFromTitle(title)

    return {
      id: page.id,
      slug,
      title,
      description: description || undefined,
      publishedAt,
      updatedAt: publishedAt, // Use publishedAt as fallback
      tags,
      category: category || undefined,
      coverImage: coverImage || undefined,
      published: true,
      readingTime: Math.ceil(Math.random() * 10 + 2), // Placeholder
    }
  } catch (error) {
    throw new NotionError(
      "Failed to transform blog preview",
      NotionErrorCode.TRANSFORM_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

export async function transformToBlogContent(
  preview: BlogPreview,
  recordMap: ExtendedRecordMap
): Promise<BlogContent> {
  // Extract cover image from recordMap (more reliable than database properties)
  const coverImageFromRecordMap = extractCoverImageFromRecordMap(recordMap, preview.id)
  
  return {
    ...preview,
    coverImage: coverImageFromRecordMap || preview.coverImage,
    recordMap,
  }
}

// =============================================================================
// PROJECT TRANSFORMS
// =============================================================================

export function transformToProjectPreview(page: NotionPage): ProjectPreview | null {
  try {
    const properties = page.properties
    
    // Extract required fields
    const title = tryMultipleProperties(properties, ["Name", "Title"]) as string
    const subtitle = tryMultipleProperties(properties, ["Subtitle", "Short Description"]) as string
    const description = tryMultipleProperties(properties, ["Description", "Summary"]) as string
    const publishedAt = tryMultipleProperties(properties, ["Published Date", "Date"]) as string
    const categoryValue = tryMultipleProperties(properties, ["Category"]) as string
    
    if (!title || !subtitle || !description || !publishedAt || !categoryValue) {
      return null
    }

    // Validate and convert category
    const category = ['Software', 'Hardware', 'Hybrid'].includes(categoryValue) 
      ? categoryValue as 'Software' | 'Hardware' | 'Hybrid'
      : 'Software'

    // Extract optional fields
    const award = tryMultipleProperties(properties, ["Award"]) as string
    const awardRank = tryMultipleProperties(properties, ["awardRank", "Award Rank"]) as string
    const rawTags = tryMultipleProperties(properties, ["Tags"]) as string[]
    const tags = Array.isArray(rawTags) ? rawTags : []
    const liveLink = tryMultipleProperties(properties, ["Live Link", "Website"]) as string
    const githubLink = tryMultipleProperties(properties, ["GitHub Link", "GitHub"]) as string
    const heroImage = tryMultipleProperties(properties, ["Hero Image", "Cover", "Image"]) as string
    const vectaryEmbedUrl = tryMultipleProperties(properties, ["Vectary Embed URL"]) as string

    const slug = createSlugFromTitle(title)

    return {
      id: page.id,
      slug,
      title,
      subtitle,
      description,
      publishedAt,
      updatedAt: publishedAt, // Use publishedAt as fallback
      category,
      award: award || undefined,
      awardRank: awardRank || undefined,
      tags,
      liveLink: liveLink || undefined,
      githubLink: githubLink || undefined,
      heroImage: heroImage || undefined,
      vectaryEmbedUrl: vectaryEmbedUrl || undefined,
      stats: [], // Will be populated from static data
      published: true,
      coverImage: heroImage || undefined,
    }
  } catch (error) {
    throw new NotionError(
      "Failed to transform project preview",
      NotionErrorCode.TRANSFORM_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

export async function transformToProjectContent(
  preview: ProjectPreview,
  recordMap: ExtendedRecordMap
): Promise<ProjectContent> {
  // Extract cover image from recordMap (more reliable than database properties)
  const coverImageFromRecordMap = extractCoverImageFromRecordMap(recordMap, preview.id)
  
  return {
    ...preview,
    heroImage: coverImageFromRecordMap || preview.heroImage,
    coverImage: coverImageFromRecordMap || preview.coverImage,
    recordMap,
    gallery: [], // Will be populated from static data if needed
    keyFeatures: [], // Will be populated from static data if needed
    techStack: [], // Will be populated from static data if needed
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export { normalizeImageUrl, createSlugFromTitle }