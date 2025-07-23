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
} from "@/lib/schemas"

function getProperty(properties: Record<string, NotionPropertyValue>, name: string): string | string[] | boolean | null {
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

function parseStatistics(statisticsText: string | null): Array<{value: string, label: string}> {
  if (!statisticsText) return []
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(statisticsText)
    if (Array.isArray(parsed)) {
      return parsed.filter(stat => stat.value && stat.label)
    }
  } catch {
    // If JSON parsing fails, try to parse as simple text format
    // Expected format: "label1: value1, label2: value2" or "label1|value1,label2|value2"
    const stats: Array<{value: string, label: string}> = []
    
    // Split by comma and parse each stat
    const statPairs = statisticsText.split(',').map(s => s.trim())
    
    for (const pair of statPairs) {
      // Try colon separator first
      let parts = pair.split(':')
      if (parts.length !== 2) {
        // Try pipe separator
        parts = pair.split('|')
      }
      
      if (parts.length === 2) {
        const label = parts[0].trim()
        const value = parts[1].trim()
        if (label && value) {
          stats.push({ label, value })
        }
      }
    }
    
    return stats
  }
  
  return []
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function normalizeImageUrl(url: string): string {
  // Skip base64 images - they're too large for HTTP headers
  if (url.startsWith('data:')) {
    return ''
  }
  
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
  
  const titleValue = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAtValue = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  // Ensure title is a string
  if (typeof titleValue !== 'string' || !titleValue) return null
  if (typeof publishedAtValue !== 'string' || !publishedAtValue) return null
  
  const title = titleValue
  const publishedAt = publishedAtValue

  const descriptionValue = getProperty(properties, "Description")
  const description = typeof descriptionValue === 'string' ? descriptionValue : undefined
  
  const tagsValue = getProperty(properties, "Tags")
  const tags = Array.isArray(tagsValue) ? tagsValue : []
  
  const categoryValue = getProperty(properties, "Category")
  const category = typeof categoryValue === 'string' ? categoryValue : undefined
  
  const coverImageValue = getProperty(properties, "Cover")
  const coverImage = typeof coverImageValue === 'string' ? normalizeImageUrl(coverImageValue) : undefined

  return {
    id: page.id,
    slug: createSlug(title),
    title,
    description,
    publishedAt,
    updatedAt: publishedAt,
    tags,
    category,
    coverImage,
    published: true,
    readingTime: 5,
  }
}

export async function transformToBlogContent(
  preview: BlogPreview,
  recordMap: ExtendedRecordMap
): Promise<BlogContent> {
  // Get the root page block to access page cover
  const pageId = Object.keys(recordMap.block)[0]
  const page = recordMap.block[pageId]?.value
  
  // Priority: database Cover property > Notion page cover
  let coverImage = preview.coverImage
  if (!coverImage && page?.format?.page_cover) {
    coverImage = normalizeImageUrl(page.format.page_cover)
  }
  
  return {
    ...preview,
    coverImage,
    recordMap,
  }
}

export function transformToProjectPreview(page: NotionPage): NotionProjectPreview | null {
  const { properties } = page
  
  const titleValue = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAtValue = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  // Ensure required fields are strings
  if (typeof titleValue !== 'string' || !titleValue) return null
  if (typeof publishedAtValue !== 'string' || !publishedAtValue) return null
  
  const title = titleValue
  const publishedAt = publishedAtValue
  
  const subtitleValue = getProperty(properties, "Subtitle")
  const subtitle = typeof subtitleValue === 'string' ? subtitleValue : ""
  
  const descriptionValue = getProperty(properties, "Description")
  const description = typeof descriptionValue === 'string' ? descriptionValue : ""
  
  const categoryValue = getProperty(properties, "Category")
  const category = (typeof categoryValue === 'string' && ['Software', 'Hardware', 'Hybrid'].includes(categoryValue)) 
    ? categoryValue as 'Software' | 'Hardware' | 'Hybrid' : 'Software'
  
  const awardValue = getProperty(properties, "Award")
  const award = typeof awardValue === 'string' ? awardValue : undefined
  
  const awardRankValue = getProperty(properties, "Award Rank")
  const awardRank = typeof awardRankValue === 'string' ? awardRankValue : undefined
  
  const tagsValue = getProperty(properties, "Tags")
  const tags = Array.isArray(tagsValue) ? tagsValue : []
  
  const liveLinkValue = getProperty(properties, "Live Link")
  const liveLink = typeof liveLinkValue === 'string' ? liveLinkValue : undefined
  
  const githubLinkValue = getProperty(properties, "GitHub")
  const githubLink = typeof githubLinkValue === 'string' ? githubLinkValue : undefined
  
  const heroImageValue = getProperty(properties, "Hero Image")
  const heroImage = typeof heroImageValue === 'string' ? normalizeImageUrl(heroImageValue) : undefined
  
  const vectaryEmbedUrlValue = getProperty(properties, "Vectary URL")
  const vectaryEmbedUrl = typeof vectaryEmbedUrlValue === 'string' ? vectaryEmbedUrlValue : undefined
  
  // Projects don't have Cover property - only Hero Image
  // const coverImageValue = getProperty(properties, "Cover")
  // const coverImage = typeof coverImageValue === 'string' ? coverImageValue : undefined
  
  const statisticsValue = getProperty(properties, "Statistics")
  const stats = parseStatistics(typeof statisticsValue === 'string' ? statisticsValue : null)

  const preview = {
    id: page.id,
    slug: createSlug(title),
    title,
    subtitle,
    description,
    publishedAt,
    updatedAt: publishedAt,
    category,
    award,
    awardRank,
    tags,
    liveLink,
    githubLink,
    heroImage,
    vectaryEmbedUrl,
    stats,
    published: true,
    coverImage: heroImage, // Use heroImage as coverImage for projects
  }
  
  return preview
}

export async function transformToProjectContent(
  preview: NotionProjectPreview,
  recordMap: ExtendedRecordMap
): Promise<ProjectContent> {
  // Get the root page block to access page cover
  const pageId = Object.keys(recordMap.block)[0]
  const page = recordMap.block[pageId]?.value
  
  // Priority for hero image: vectaryEmbedUrl > heroImage > Notion page cover
  let heroImage = preview.heroImage
  let coverImage = preview.coverImage
  
  // If vectaryEmbedUrl exists, it takes priority
  if (preview.vectaryEmbedUrl) {
    // Vectary is for 3D content, so we keep the URL but might need special handling
    heroImage = preview.vectaryEmbedUrl
    coverImage = preview.vectaryEmbedUrl
  } else if (!heroImage && page?.format?.page_cover) {
    // If no heroImage from database, use Notion page cover
    const pagecover = normalizeImageUrl(page.format.page_cover)
    heroImage = pagecover
    coverImage = pagecover
  } else if (heroImage) {
    // Normalize existing hero image URL
    heroImage = normalizeImageUrl(heroImage)
    coverImage = heroImage
  }
  
  const finalProject = {
    ...preview,
    heroImage,
    coverImage,
    recordMap,
    gallery: [],
    keyFeatures: [],
    techStack: [],
  }
  
  console.log('🎆 Final Project:', {
    id: finalProject.id,
    title: finalProject.title,
    heroImage: finalProject.heroImage,
    coverImage: finalProject.coverImage
  })
  
  return finalProject
}