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


function getProperty(properties: Record<string, NotionPropertyValue>, name: string): string | string[] | boolean | number | null {
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
    case "number": return prop.number || null
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

function normalizeImageUrl(url: string): string {
  if (!url || url.startsWith('data:')) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `https://www.notion.so${url}`
  if (!url.includes('://')) return `https://www.notion.so/${url}`
  return url
}

/**
 * Normalizes and enhances Sketchfab embed URLs with optimal parameters
 * Adds: transparent background, slow auto-rotation, and hides UI elements
 */
function normalizeSketchfabUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string' || !url.trim()) return undefined
  
  try {
    const sketchfabUrl = new URL(url.trim())
    
    // Only process sketchfab.com URLs
    if (!sketchfabUrl.hostname.includes('sketchfab.com')) {
      return url
    }
    
    // Parameters to add/override for optimal embedding
    const params = new URLSearchParams(sketchfabUrl.search)
    
    // Transparent background
    params.set('transparent', '1')
    
    // Slow auto-rotation (0.1 degrees per second - very slow)
    params.set('autospin', '0.1')
    
    // Autostart the model
    params.set('autostart', '1')
    
    // Hide UI elements
    params.set('ui_hint', '0')          // Hide navigation hint on hover
    params.set('ui_controls', '0')      // Hide bottom controls
    params.set('ui_annotations', '0')   // Hide annotations
    params.set('ui_infos', '0')         // Hide top info bar (model name, author)
    params.set('ui_stop', '0')          // Hide stop button
    params.set('ui_help', '0')          // Hide help button
    params.set('ui_inspector', '0')     // Hide inspector button
    params.set('ui_settings', '0')      // Hide settings button
    params.set('ui_vr', '0')            // Hide VR button
    params.set('ui_fullscreen', '0')    // Hide fullscreen button
    params.set('ui_ar', '0')            // Hide AR button
    params.set('ui_ar_help', '0')       // Hide AR help
    params.set('ui_ar_qrcode', '0')     // Hide AR QR code
    params.set('ui_watermark', '1')     // Keep watermark (user is fine with it)
    
    // Build the enhanced URL
    sketchfabUrl.search = params.toString()
    
    return sketchfabUrl.toString()
  } catch {
    // If URL parsing fails, return original URL
    return url
  }
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


// Note: Reading time is calculated dynamically when full content is loaded
// This avoids expensive operations during preview generation
export function transformToBlogPreview(page: NotionPage): BlogPreview | null {
  const { properties, cover } = page
  
  const title = getProperty(properties, "Name") || getProperty(properties, "Title")
  const publishedAt = getProperty(properties, "Published Date") || getProperty(properties, "Date")
  
  if (typeof title !== 'string' || !title || typeof publishedAt !== 'string' || !publishedAt) {
    return null
  }

  // Get reading time from Notion property, fallback to calculated or default
  const readingTimeFromNotion = getProperty(properties, "Reading Time") as number | null
  const readingTime = readingTimeFromNotion && readingTimeFromNotion > 0 ? readingTimeFromNotion : 1

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
    readingTime,
  }
}

export async function transformToBlogContent(
  preview: BlogPreview,
  recordMap: ExtendedRecordMap
): Promise<BlogContent> {
  const textContent = extractTextFromRecordMap(recordMap)
  const calculatedReadingTime = calculateReadingTime(textContent)
  
  return {
    ...preview,
    recordMap,
    readingTime: calculatedReadingTime,
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
    sketchfabEmbedUrl: normalizeSketchfabUrl(getProperty(properties, "Sketchfab URL") as string),
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


function extractTextFromRecordMap(recordMap: ExtendedRecordMap): string {
  try {
    const textContent: string[] = []
    
    if (recordMap.block) {
      // Process all blocks efficiently using the proper structure
      Object.values(recordMap.block).forEach(blockWrapper => {
        const block = blockWrapper?.value
        if (!block || !block.properties) return
        
        const properties = block.properties
        
        // Extract text from common text-containing properties
        const textProperties = ['title', 'rich_text', 'caption'] as const
        
        for (const prop of textProperties) {
          if (properties[prop] && Array.isArray(properties[prop])) {
            // Each property is an array of rich text elements
            // Each element is typically [text, decorations] format
            const text = properties[prop]
              .map((item: unknown) => {
                if (Array.isArray(item) && item.length > 0) {
                  return String(item[0] || '')
                } else if (typeof item === 'string') {
                  return item
                }
                return ''
              })
              .join('')
              .trim()
            
            if (text) textContent.push(text)
          }
        }
      })
    }
    
    return textContent.join(' ').trim()
  } catch (error) {
    console.error('Error extracting text from recordMap:', error)
    return ''
  }
}

function calculateReadingTime(content: string, wordsPerMinute = 160): number {
  if (!content || typeof content !== 'string') return 1
  
  const words = content.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  if (wordCount === 0) return 1
  
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}