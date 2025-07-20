/**
 * Consolidated Notion Integration
 * All Notion API clients, queries, and transforms in one place
 */

import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionPropertyValue, 
  NotionClientInterface 
} from "@/types/notionTypes"
import { 
  BlogPost, 
  BlogPostPreview, 
  BlogErrorCode 
} from "@/types/blogTypes"
import { 
  NotionProject, 
  NotionProjectPreview 
} from "@/types/projectTypes"
import { withServerErrorHandling, BlogErrorHandler } from "@/lib/server-errors"
import { 
  validateBlogEnvironment, 
  sanitizeBlogPostPreview 
} from "@/lib/blog/blog-validation"
import { 
  validateProjectEnvironment, 
  sanitizeProjectPreview 
} from "@/lib/projects/project-validation"
import { getCachedBlogPosts, getCachedBlogPost, getCachedProjects, getCachedProject } from "@/lib/cache"

// =============================================================================
// BASE NOTION CLIENT
// =============================================================================

const notion = new NotionAPI()

export class BaseNotionClient implements NotionClientInterface {
  protected client: Client | null = null

  constructor(token?: string) {
    const notionToken = token || process.env.NOTION_TOKEN
    if (notionToken) {
      this.client = new Client({
        auth: notionToken,
      })
    }
  }

  async getPage(pageId: string): Promise<ExtendedRecordMap> {
    try {
      const recordMap = await notion.getPage(pageId)
      return recordMap
    } catch (error) {
      throw new Error(`Failed to fetch page: ${pageId}`)
    }
  }

  async getDatabasePages(
    databaseId: string, 
    filter?: Record<string, unknown>, 
    sorts?: Array<Record<string, unknown>>
  ) {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      })

      return response.results
    } catch (error) {
      throw new Error(`Failed to fetch database: ${databaseId}`)
    }
  }

  async getPageWithCover(pageId: string) {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }

    try {
      const page = await this.client.pages.retrieve({ page_id: pageId })
      return page
    } catch (error) {
      throw new Error(`Failed to fetch page with cover: ${pageId}`)
    }
  }

  isConfigured(): boolean {
    return !!this.client
  }

  protected getClient(): Client {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }
    return this.client
  }
}

// =============================================================================
// BLOG CLIENT
// =============================================================================

export class NotionBlogClient extends BaseNotionClient {
  constructor() {
    super()
  }

  async getBlogPosts(databaseId: string) {
    const filter = {
      property: "Published",
      checkbox: {
        equals: true,
      },
    }

    const sorts = [
      {
        property: "Published Date", 
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  isConfigured(): boolean {
    return !!(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)
  }
}

// =============================================================================
// PROJECTS CLIENT
// =============================================================================

export class NotionProjectsClient extends BaseNotionClient {
  constructor() {
    super()
  }

  async getProjects(databaseId: string) {
    const filter = {
      property: "Published",
      checkbox: {
        equals: true,
      },
    }

    const sorts = [
      {
        property: "Published Date",
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  async getProjectsByCategory(databaseId: string, category: string) {
    const filter = {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Category",
          select: {
            equals: category,
          },
        },
      ],
    }

    const sorts = [
      {
        property: "Published Date",
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  async getFeaturedProjects(databaseId: string, limit: number = 4) {
    const filter = {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
      ],
    }

    const sorts = [
      {
        property: "Published Date",
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  isConfigured(): boolean {
    return !!(process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID)
  }
}

// =============================================================================
// CLIENT INSTANCES
// =============================================================================

export const notionBlogClient = new NotionBlogClient()
export const notionProjectsClient = new NotionProjectsClient()

// =============================================================================
// TRANSFORM UTILITIES
// =============================================================================

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

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

// =============================================================================
// BLOG TRANSFORMS
// =============================================================================

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

// =============================================================================
// PROJECT TRANSFORMS
// =============================================================================

export function transformNotionPageToProjectPreview(page: NotionPage): NotionProjectPreview | null {
  try {
    const properties = page.properties
    
    const title = extractPropertyValue(properties, "Name") || extractPropertyValue(properties, "Title")
    const subtitle = extractPropertyValue(properties, "Subtitle") || extractPropertyValue(properties, "Short Description")
    const description = extractPropertyValue(properties, "Description") || extractPropertyValue(properties, "Summary")
    const publishedAt = extractPropertyValue(properties, "Published Date") || extractPropertyValue(properties, "Date")
    const category = extractPropertyValue(properties, "Category")
    const rawTags = extractPropertyValue(properties, "Tags")
    const tags = Array.isArray(rawTags) ? rawTags : []
    
    let heroImage = extractPropertyValue(properties, "Hero Image") || 
                    extractPropertyValue(properties, "Cover") ||
                    extractPropertyValue(properties, "Image")
    
    if (!title || typeof title !== "string" || !publishedAt || typeof publishedAt !== "string") {
      return null
    }

    const slug = createSlugFromTitle(title)

    return {
      id: page.id,
      slug,
      title,
      subtitle: typeof subtitle === "string" ? subtitle : "",
      description: typeof description === "string" ? description : "",
      publishedAt,
      category: typeof category === "string" ? category as any : "Software",
      tags,
      heroImage: typeof heroImage === "string" ? heroImage : undefined,
      published: true,
      stats: [], // Will be filled from project data
    }
  } catch (error) {
    return null
  }
}

export function transformNotionPageToProject(
  preview: NotionProjectPreview,
  recordMap: ExtendedRecordMap
): NotionProject {
  const coverImageFromRecordMap = getCoverImageFromRecordMap(recordMap, preview.id)
  
  return {
    ...preview,
    updatedAt: preview.publishedAt, // Use published date as fallback
    heroImage: coverImageFromRecordMap || preview.heroImage,
    recordMap,
    gallery: [], // Will be populated from project data
    keyFeatures: [], // Will be populated from project data
    techStack: [], // Will be populated from project data
  }
}

// =============================================================================
// BLOG QUERIES
// =============================================================================

export async function getAllBlogPosts(): Promise<BlogPostPreview[]> {
  return withServerErrorHandling(
    () => getCachedBlogPosts(async () => {
    // Validate environment first
    const envValidation = validateBlogEnvironment()
    if (!envValidation.isValid) {
      return []
    }

    if (!notionBlogClient.isConfigured()) {
      return []
    }

    try {
      const databaseId = process.env.NOTION_DATABASE_ID!
      const pages = await notionBlogClient.getBlogPosts(databaseId)
      
      const blogPosts = pages
        .map((page: NotionPage) => {
          try {
            const preview = transformNotionPageToBlogPreview(page)
            return sanitizeBlogPostPreview(preview)
          } catch (error) {
            return null
          }
        })
        .filter(Boolean) as BlogPostPreview[]

      return blogPosts
    } catch (error) {
      throw new Error("Failed to fetch blog posts from Notion")
    }
  }),
    "fetch-all-blog-posts",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return withServerErrorHandling(
    () => getCachedBlogPost(slug, async (slug: string) => {
    // Validate environment first
    const envValidation = validateBlogEnvironment()
    if (!envValidation.isValid) {
      return null
    }

    if (!notionBlogClient.isConfigured()) {
      return null
    }

    try {
      // First get all posts to find the one with matching slug
      const allPosts = await getAllBlogPosts()
      const matchingPost = allPosts.find(post => post.slug === slug)
      
      if (!matchingPost) {
        return null
      }

      // Get the full page content
      const recordMap = await notionBlogClient.getPage(matchingPost.id)
      
      return transformNotionPageToBlogPost(matchingPost, recordMap)
    } catch (error) {
      throw new Error(`Failed to fetch blog post: ${slug}`)
    }
  }),
    "fetch-blog-post-by-slug",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("not found")
    }
  )
}

// =============================================================================
// PROJECT QUERIES
// =============================================================================

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  return withServerErrorHandling(
    () => getCachedProjects(async () => {
    // Validate environment first
    const envValidation = validateProjectEnvironment()
    if (!envValidation.isValid) {
      return []
    }

    if (!notionProjectsClient.isConfigured()) {
      return []
    }

    try {
      const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID!
      const pages = await notionProjectsClient.getProjects(databaseId)
      
      const projects = pages
        .map((page: NotionPage) => {
          try {
            const preview = transformNotionPageToProjectPreview(page)
            return sanitizeProjectPreview(preview)
          } catch (error) {
            return null
          }
        })
        .filter(Boolean) as NotionProjectPreview[]

      return projects
    } catch (error) {
      throw new Error("Failed to fetch projects from Notion")
    }
  }),
    "fetch-all-projects",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getProjectById(id: string): Promise<NotionProject | null> {
  return withServerErrorHandling(
    () => getCachedProject(id, async (id: string) => {
    // Validate environment first
    const envValidation = validateProjectEnvironment()
    if (!envValidation.isValid) {
      return null
    }

    if (!notionProjectsClient.isConfigured()) {
      return null
    }

    try {
      // First get all projects to find the one with matching ID
      const allProjects = await getAllProjects()
      const matchingProject = allProjects.find(project => project.id === id)
      
      if (!matchingProject) {
        return null
      }

      // Get the full page content
      const recordMap = await notionProjectsClient.getPage(matchingProject.id)
      
      return transformNotionPageToProject(matchingProject, recordMap)
    } catch (error) {
      throw new Error(`Failed to fetch project: ${id}`)
    }
  }),
    "fetch-project-by-id",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("not found")
    }
  )
}

export async function getFeaturedProjects(limit: number = 4): Promise<NotionProjectPreview[]> {
  return withServerErrorHandling(
    async () => {
    // Validate environment first
    const envValidation = validateProjectEnvironment()
    if (!envValidation.isValid) {
      return []
    }

    if (!notionProjectsClient.isConfigured()) {
      return []
    }

    try {
      const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID!
      const pages = await notionProjectsClient.getFeaturedProjects(databaseId, limit)
      
      const projects = pages
        .map((page: NotionPage) => {
          try {
            const preview = transformNotionPageToProjectPreview(page)
            return sanitizeProjectPreview(preview)
          } catch (error) {
            return null
          }
        })
        .filter(Boolean) as NotionProjectPreview[]

      return projects.slice(0, limit)
    } catch (error) {
      throw new Error("Failed to fetch featured projects from Notion")
    }
  },
    "fetch-featured-projects",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

// =============================================================================
// READING TIME CALCULATION
// =============================================================================

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}