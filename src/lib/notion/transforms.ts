/**
 * Simplified Notion Data Transformations
 */

import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionPropertyValue,
  BlogContent,
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/schemas"

function getProperty(properties: Record<string, NotionPropertyValue>, name: string): any {
  const prop = properties[name]
  if (!prop) return null
  
  switch (prop.type) {
    case "title": return prop.title?.[0]?.plain_text || null
    case "rich_text": return prop.rich_text?.[0]?.plain_text || null
    case "date": return prop.date?.start || null
    case "checkbox": return prop.checkbox || false
    case "multi_select": return prop.multi_select?.map(tag => tag.name) || []
    case "select": return prop.select?.name || null
    case "url": return prop.url || null
    case "files": return prop.files?.[0]?.file?.url || prop.files?.[0]?.external?.url || null
    default: return null
  }
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function normalizeImageUrl(url: string): string {
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

export const createSlugFromTitle = createSlug

export function transformToBlogPreview(page: NotionPage): BlogPreview | null {
  const { properties } = page
  
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  if (!title || !publishedAt) return null

  return {
    id: page.id,
    slug: createSlug(title),
    title,
    description: getProperty(properties, "Description"),
    publishedAt,
    updatedAt: publishedAt,
    tags: getProperty(properties, "Tags") || [],
    category: getProperty(properties, "Category"),
    coverImage: getProperty(properties, "Cover"),
    published: true,
    readingTime: 5,
  }
}

export async function transformToBlogContent(
  preview: BlogPreview,
  recordMap: ExtendedRecordMap
): Promise<BlogContent> {
  return {
    ...preview,
    recordMap,
  }
}

export function transformToProjectPreview(page: NotionPage): NotionProjectPreview | null {
  const { properties } = page
  
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const subtitle = getProperty(properties, "Subtitle")
  const description = getProperty(properties, "Description")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  const categoryValue = getProperty(properties, "Category")
  
  if (!title || !publishedAt) return null

  const category = ['Software', 'Hardware', 'Hybrid'].includes(categoryValue) 
    ? categoryValue : 'Software'

  return {
    id: page.id,
    slug: createSlug(title),
    title,
    subtitle: subtitle || "",
    description: description || "",
    publishedAt,
    updatedAt: publishedAt,
    category: category as 'Software' | 'Hardware' | 'Hybrid',
    award: getProperty(properties, "Award"),
    awardRank: getProperty(properties, "Award Rank"),
    tags: getProperty(properties, "Tags") || [],
    liveLink: getProperty(properties, "Live Link"),
    githubLink: getProperty(properties, "GitHub Link"),
    heroImage: getProperty(properties, "Hero Image"),
    vectaryEmbedUrl: getProperty(properties, "Vectary Embed URL"),
    stats: [],
    published: true,
    coverImage: getProperty(properties, "Cover"),
  }
}

export async function transformToProjectContent(
  preview: NotionProjectPreview,
  recordMap: ExtendedRecordMap
): Promise<ProjectContent> {
  return {
    ...preview,
    recordMap,
    gallery: [],
    keyFeatures: [],
    techStack: [],
  }
}