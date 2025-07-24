/**
 * Notion Data Transformations
 * Converts Notion API responses to our app's data structures
 */

import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionPropertyValue,
  BlogContent,
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/lib/schemas"

// =============================================================================
// TYPE GUARDS
// =============================================================================

type NotionCover = {
  external?: { url?: string }
  file?: { url?: string }
}

// Check if an object is a valid Notion cover image
function isNotionCover(cover: unknown): cover is NotionCover {
  if (!cover || typeof cover !== 'object') return false
  const c = cover as Record<string, unknown>
  
  // Check for external URL (linked images)
  if (c.external && typeof c.external === 'object') {
    const ext = c.external as Record<string, unknown>
    if (typeof ext.url === 'string') return true
  }
  
  // Check for file URL (uploaded images)
  if (c.file && typeof c.file === 'object') {
    const file = c.file as Record<string, unknown>
    if (typeof file.url === 'string') return true
  }
  
  return false
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Extract value from Notion property based on its type
function getProperty(properties: Record<string, NotionPropertyValue>, name: string): string | string[] | boolean | null {
  const prop = properties[name]
  if (!prop) return null
  
  // Handle different Notion property types
  switch (prop.type) {
    case "title": return prop.title?.[0]?.plain_text || null
    case "rich_text": {
      if (!prop.rich_text || prop.rich_text.length === 0) return null
      return prop.rich_text.map(text => text.plain_text).join('') || null
    }
    case "date": return prop.date?.start || null
    case "checkbox": return prop.checkbox || false
    case "multi_select": return prop.multi_select?.map(tag => tag.name) || []
    case "select": return prop.select?.name || null
    case "url": return prop.url || null
    case "files": return prop.files?.[0]?.file?.url || prop.files?.[0]?.external?.url || null
    default: return null
  }
}

// Parse statistics from JSON or formatted text
function parseStatistics(text: string | null): Array<{value: string, label: string}> {
  if (!text) return []
  
  try {
    // Try parsing as JSON first
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.filter(stat => stat.value && stat.label)
    }
  } catch {
    // Fallback: Parse "label: value" or "label|value" format
    return text.split(',')
      .map(s => s.trim())
      .map(pair => {
        const parts = pair.includes(':') ? pair.split(':') : pair.split('|')
        if (parts.length === 2) {
          const [label, value] = parts.map(p => p.trim())
          if (label && value) return { label, value }
        }
        return null
      })
      .filter(Boolean) as Array<{value: string, label: string}>
  }
  
  return []
}

// Generate URL-friendly slug from title
function createSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")  // Remove special characters
    .trim()
    .replace(/\s+/g, "-")          // Replace spaces with hyphens
}

// Ensure image URLs are absolute
export function normalizeImageUrl(url: string): string {
  if (!url || url.startsWith('data:')) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `https://www.notion.so${url}`
  if (!url.includes('://')) return `https://www.notion.so/${url}`
  return url
}

// Extract cover image URL from Notion page
function getCoverImageUrl(cover: unknown): string | undefined {
  if (!isNotionCover(cover)) return undefined
  
  const url = cover.external?.url || cover.file?.url
  return url ? normalizeImageUrl(url) : undefined
}

// Get image URL with fallback to cover
function getImageUrl(properties: Record<string, NotionPropertyValue>, cover: unknown, imageProperty: string): string | undefined {
  // Priority: Database Image Property > Page Cover
  const imageUrl = getProperty(properties, imageProperty) as string
  if (imageUrl) return normalizeImageUrl(imageUrl)
  
  return getCoverImageUrl(cover)
}

// =============================================================================
// BLOG TRANSFORMATIONS
// =============================================================================

// Convert Notion page to blog preview format
export function transformToBlogPreview(page: NotionPage): BlogPreview | null {
  const { properties, cover } = page
  
  // Extract required fields
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  // Validate required fields
  if (typeof title !== 'string' || !title || typeof publishedAt !== 'string' || !publishedAt) {
    return null
  }

  return {
    id: page.id,
    slug: createSlug(title),
    title,
    description: getProperty(properties, "Description") as string,
    publishedAt,
    updatedAt: publishedAt,
    tags: getProperty(properties, "Tags") as string[] || [],
    category: getProperty(properties, "Category") as string,
    coverImage: getImageUrl(properties, cover, "Cover"),
    published: true,
    readingTime: 5, // Default estimate
  }
}

// Add full content to blog preview
export async function transformToBlogContent(
  preview: BlogPreview,
  recordMap: ExtendedRecordMap
): Promise<BlogContent> {
  return {
    ...preview,
    recordMap, // Full Notion page content
  }
}

// =============================================================================
// PROJECT TRANSFORMATIONS
// =============================================================================

// Convert Notion page to project preview format
export function transformToProjectPreview(page: NotionPage): NotionProjectPreview | null {
  const { properties, cover } = page
  
  // Extract required fields
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  // Validate required fields
  if (typeof title !== 'string' || !title || typeof publishedAt !== 'string' || !publishedAt) {
    return null
  }
  
  // Ensure valid category
  const category = getProperty(properties, "Category") as string
  const validCategory = ['Software', 'Hardware', 'Hybrid'].includes(category) ? category : 'Software'
  
  const heroImage = getImageUrl(properties, cover, "Hero Image")
  const statistics = getProperty(properties, "Statistics") as string
  
  return {
    id: page.id,
    slug: createSlug(title),
    title,
    subtitle: getProperty(properties, "Subtitle") as string || "",
    description: getProperty(properties, "Description") as string || "",
    publishedAt,
    updatedAt: publishedAt,
    category: validCategory as 'Software' | 'Hardware' | 'Hybrid',
    award: getProperty(properties, "Award") as string,
    awardRank: getProperty(properties, "Award Rank") as string,
    tags: getProperty(properties, "Tags") as string[] || [],
    liveLink: getProperty(properties, "Live Link") as string,
    githubLink: getProperty(properties, "GitHub") as string,
    heroImage,
    vectaryEmbedUrl: getProperty(properties, "Vectary URL") as string,
    stats: parseStatistics(statistics),
    published: true,
    coverImage: heroImage,
  }
}

// Add full content to project preview
export async function transformToProjectContent(
  preview: NotionProjectPreview,
  recordMap: ExtendedRecordMap
): Promise<ProjectContent> {
  return {
    ...preview,
    recordMap, // Full Notion page content
    gallery: [], // Could be populated from page content
    keyFeatures: [], // Could be extracted from content
    techStack: [], // Could be parsed from properties
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const createSlugFromTitle = createSlug

// Calculate reading time based on word count
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || typeof content !== 'string') return 0
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}