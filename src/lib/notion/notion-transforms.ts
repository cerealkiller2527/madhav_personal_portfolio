// Notion data transformations

import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionPropertyValue,
  BlogContent,
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/lib/schemas"


type NotionCover = {
  external?: { url?: string }
  file?: { url?: string }
}

function isNotionCover(cover: unknown): cover is NotionCover {
  if (!cover || typeof cover !== 'object') return false
  const c = cover as Record<string, unknown>
  
  if (c.external && typeof c.external === 'object') {
    const ext = c.external as Record<string, unknown>
    if (typeof ext.url === 'string') return true
  }
  
  if (c.file && typeof c.file === 'object') {
    const file = c.file as Record<string, unknown>
    if (typeof file.url === 'string') return true
  }
  
  return false
}


function getProperty(properties: Record<string, NotionPropertyValue>, name: string): string | string[] | boolean | null {
  const prop = properties[name]
  if (!prop) return null
  
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

function parseStatistics(text: string | null): Array<{value: string, label: string}> {
  if (!text) return []
  
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.filter(stat => stat.value && stat.label)
    }
  } catch {
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

function createSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function normalizeImageUrl(url: string): string {
  if (!url || url.startsWith('data:')) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `https://www.notion.so${url}`
  if (!url.includes('://')) return `https://www.notion.so/${url}`
  return url
}

function getCoverImageUrl(cover: unknown): string | undefined {
  if (!isNotionCover(cover)) return undefined
  
  const url = cover.external?.url || cover.file?.url
  return url ? normalizeImageUrl(url) : undefined
}

function getImageUrl(properties: Record<string, NotionPropertyValue>, cover: unknown, imageProperty: string): string | undefined {
  const imageUrl = getProperty(properties, imageProperty) as string
  if (imageUrl) return normalizeImageUrl(imageUrl)
  
  return getCoverImageUrl(cover)
}


export function transformToBlogPreview(page: NotionPage): BlogPreview | null {
  const { properties, cover } = page
  
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
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
  const { properties, cover } = page
  
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  if (typeof title !== 'string' || !title || typeof publishedAt !== 'string' || !publishedAt) {
    return null
  }
  
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


export const createSlugFromTitle = createSlug
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || typeof content !== 'string') return 0
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}