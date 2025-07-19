import { ExtendedRecordMap } from "notion-types"
import { NotionProject, NotionProjectPreview, ProjectCategory, TechCategory, ProjectStatistic, ProjectGalleryItem, ProjectFeature, ProjectTechStackItem } from "@/types/projectTypes"
import { NotionPage, NotionPropertyValue } from "@/types/notionTypes"
import { withServerErrorHandling } from "@/lib/errors/server-error-handlers"

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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
      default:
        return null
    }
  } catch (error) {
    console.warn(`Failed to extract property ${propertyName}:`, error)
    return null
  }
}

function parseProjectCategory(category: string | null): ProjectCategory {
  if (!category) return ProjectCategory.SOFTWARE
  
  const normalizedCategory = category.toLowerCase()
  switch (normalizedCategory) {
    case "software":
      return ProjectCategory.SOFTWARE
    case "hardware":
      return ProjectCategory.HARDWARE
    case "hybrid":
      return ProjectCategory.HYBRID
    default:
      return ProjectCategory.SOFTWARE
  }
}

function parseStatistics(statsString: string | null): ProjectStatistic[] {
  if (!statsString) return []
  
  try {
    // Expected format: "value1|label1,value2|label2"
    return statsString.split(',').map(stat => {
      const [value, label] = stat.split('|').map(s => s.trim())
      return { value, label }
    }).filter(stat => stat.value && stat.label)
  } catch (error) {
    console.warn("Error parsing statistics:", error)
    return []
  }
}

function parseGallery(galleryString: string | null): ProjectGalleryItem[] {
  if (!galleryString) return []
  
  try {
    // Expected format: "url1|caption1,url2|caption2"
    return galleryString.split(',').map(item => {
      const [url, caption] = item.split('|').map(s => s.trim())
      return { 
        url: normalizeNotionImageUrl(url), 
        caption: caption || '',
        alt: caption || ''
      }
    }).filter(item => item.url)
  } catch (error) {
    console.warn("Error parsing gallery:", error)
    return []
  }
}

function parseKeyFeatures(featuresString: string | null): ProjectFeature[] {
  if (!featuresString) return []
  
  try {
    // Expected format: "title1|desc1,title2|desc2"
    return featuresString.split(',').map(feature => {
      const [title, description] = feature.split('|').map(s => s.trim())
      return { title, description }
    }).filter(feature => feature.title && feature.description)
  } catch (error) {
    console.warn("Error parsing key features:", error)
    return []
  }
}

function parseTechStack(techString: string | null): ProjectTechStackItem[] {
  if (!techString) return []
  
  try {
    // Expected format: "name1|category1,name2|category2"
    return techString.split(',').map(tech => {
      const [name, category] = tech.split('|').map(s => s.trim())
      return { 
        name, 
        category: category as TechCategory || TechCategory.SOFTWARE
      }
    }).filter(tech => tech.name)
  } catch (error) {
    console.warn("Error parsing tech stack:", error)
    return []
  }
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
    console.warn("Error extracting cover image from recordMap:", error)
    return undefined
  }
}

export function transformNotionPageToProjectPreview(page: NotionPage): NotionProjectPreview | null {
  try {
    const properties = page.properties
    
    // Extract basic properties
    const title = extractPropertyValue(properties, "Name") || extractPropertyValue(properties, "Title")
    const subtitle = extractPropertyValue(properties, "Subtitle") || extractPropertyValue(properties, "Tagline")
    const description = extractPropertyValue(properties, "Description") || extractPropertyValue(properties, "Summary")
    const publishedAt = extractPropertyValue(properties, "Published Date") || extractPropertyValue(properties, "Date") || page.created_time
    const category = extractPropertyValue(properties, "Category")
    const award = extractPropertyValue(properties, "Award")
    const rawTags = extractPropertyValue(properties, "Tags")
    const tags = Array.isArray(rawTags) ? rawTags : []
    const liveLink = extractPropertyValue(properties, "Live Link") || extractPropertyValue(properties, "Demo URL")
    const githubLink = extractPropertyValue(properties, "GitHub") || extractPropertyValue(properties, "Repository")
    const vectaryEmbedUrl = extractPropertyValue(properties, "Vectary URL") || extractPropertyValue(properties, "3D Model")
    const statsString = extractPropertyValue(properties, "Statistics") || extractPropertyValue(properties, "Stats")
    
    // Try multiple possible property names for cover image
    let heroImage = extractPropertyValue(properties, "Hero Image") || 
                    extractPropertyValue(properties, "Cover") || 
                    extractPropertyValue(properties, "Image") ||
                    extractPropertyValue(properties, "Featured Image")

    if (!title || typeof title !== "string" || !publishedAt || typeof publishedAt !== "string") {
      console.warn("Missing required fields for project preview:", { title, publishedAt })
      return null
    }

    const slug = createSlugFromTitle(title)
    const projectCategory = parseProjectCategory(typeof category === "string" ? category : null)
    const stats = parseStatistics(typeof statsString === "string" ? statsString : null)

    return {
      id: page.id,
      slug,
      title,
      subtitle: typeof subtitle === "string" ? subtitle : "",
      description: typeof description === "string" ? description : "",
      category: projectCategory,
      award: typeof award === "string" ? award : undefined,
      stats,
      tags,
      liveLink: typeof liveLink === "string" ? liveLink : undefined,
      githubLink: typeof githubLink === "string" ? githubLink : undefined,
      heroImage: typeof heroImage === "string" ? heroImage : undefined,
      vectaryEmbedUrl: typeof vectaryEmbedUrl === "string" ? vectaryEmbedUrl : undefined,
      published: true,
      publishedAt,
    }
  } catch (error) {
    console.error("Error transforming Notion page to project preview:", error)
    return null
  }
}

export function transformNotionPageToProject(
  preview: NotionProjectPreview, 
  recordMap: ExtendedRecordMap
): NotionProject {
  // Try to get additional data from recordMap if available
  const coverImageFromRecordMap = getCoverImageFromRecordMap(recordMap, preview.id)
  
  // For now, use preview data for gallery, features, and tech stack
  // In a real implementation, you might extract these from the Notion content
  const gallery: ProjectGalleryItem[] = []
  const keyFeatures: ProjectFeature[] = []
  const techStack: ProjectTechStackItem[] = []

  return {
    id: preview.id,
    slug: preview.slug,
    title: preview.title,
    subtitle: preview.subtitle,
    description: preview.description,
    category: preview.category,
    award: preview.award,
    stats: preview.stats,
    tags: preview.tags,
    liveLink: preview.liveLink,
    githubLink: preview.githubLink,
    heroImage: coverImageFromRecordMap || preview.heroImage,
    vectaryEmbedUrl: preview.vectaryEmbedUrl,
    gallery,
    keyFeatures,
    techStack,
    published: preview.published,
    publishedAt: preview.publishedAt,
    updatedAt: preview.publishedAt, // Use published date as fallback
    recordMap,
  }
}