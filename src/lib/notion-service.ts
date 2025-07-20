/**
 * Unified Notion Service
 * High-level service layer that combines client, transforms, validation, and caching
 */

import { 
  BlogContent, 
  BlogPreview,
  ProjectContent,
  ProjectPreview,
  NotionError,
  NotionErrorCode
} from "@/types/notion-unified"
import { notionClient } from "@/lib/notion-client"
import { 
  transformToBlogPreview,
  transformToBlogContent,
  transformToProjectPreview,
  transformToProjectContent
} from "@/lib/notion-transforms"
import {
  sanitizeBlogPreview,
  sanitizeBlogContent,
  sanitizeProjectPreview,
  sanitizeProjectContent,
  validateEnvironmentConfig
} from "@/lib/notion-validation"
import { 
  getCachedData,
  clearCache,
  getBlogCacheKey,
  getProjectsCacheKey
} from "@/lib/simple-cache"
import { withServerErrorHandling } from "@/lib/server-errors"

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_DURATION = {
  BLOG_POSTS_LIST: 60 * 5, // 5 minutes
  BLOG_SINGLE_POST: 60 * 10, // 10 minutes
  PROJECTS_LIST: 60 * 5, // 5 minutes
  SINGLE_PROJECT: 60 * 10, // 10 minutes
  FEATURED_PROJECTS: 60 * 15, // 15 minutes
} as const

// =============================================================================
// BLOG SERVICE METHODS
// =============================================================================

async function _getAllBlogPosts(): Promise<BlogPreview[]> {
  // Validate environment
  const envValidation = validateEnvironmentConfig()
  if (!envValidation.isValid) {
    return []
  }

  if (!notionClient.isBlogConfigured()) {
    return []
  }

  try {
    const pages = await notionClient.getBlogPosts()
    
    const blogPosts = pages
      .map(page => {
        try {
          const preview = transformToBlogPreview(page)
          return sanitizeBlogPreview(preview)
        } catch (error) {
          console.warn(`Failed to transform blog post ${page.id}:`, error)
          return null
        }
      })
      .filter(Boolean) as BlogPreview[]

    return blogPosts
  } catch (error) {
    throw new NotionError(
      "Failed to fetch blog posts from Notion",
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

async function _getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  // Validate environment
  const envValidation = validateEnvironmentConfig()
  if (!envValidation.isValid) {
    return null
  }

  if (!notionClient.isBlogConfigured()) {
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
    const recordMap = await notionClient.getPage(matchingPost.id)
    
    const blogContent = await transformToBlogContent(matchingPost, recordMap)
    return sanitizeBlogContent(blogContent)
  } catch (error) {
    throw new NotionError(
      `Failed to fetch blog post: ${slug}`,
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

// =============================================================================
// PROJECT SERVICE METHODS
// =============================================================================

async function _getAllProjects(): Promise<ProjectPreview[]> {
  // Validate environment
  const envValidation = validateEnvironmentConfig()
  if (!envValidation.isValid) {
    return []
  }

  if (!notionClient.isProjectsConfigured()) {
    return []
  }

  try {
    const pages = await notionClient.getProjects()
    
    const projects = pages
      .map(page => {
        try {
          const preview = transformToProjectPreview(page)
          return sanitizeProjectPreview(preview)
        } catch (error) {
          console.warn(`Failed to transform project ${page.id}:`, error)
          return null
        }
      })
      .filter(Boolean) as ProjectPreview[]

    return projects
  } catch (error) {
    throw new NotionError(
      "Failed to fetch projects from Notion",
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

async function _getProjectById(id: string): Promise<ProjectContent | null> {
  // Validate environment
  const envValidation = validateEnvironmentConfig()
  if (!envValidation.isValid) {
    return null
  }

  if (!notionClient.isProjectsConfigured()) {
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
    const recordMap = await notionClient.getPage(matchingProject.id)
    
    const projectContent = await transformToProjectContent(matchingProject, recordMap)
    return sanitizeProjectContent(projectContent)
  } catch (error) {
    throw new NotionError(
      `Failed to fetch project: ${id}`,
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

async function _getFeaturedProjects(limit: number = 4): Promise<ProjectPreview[]> {
  // Validate environment
  const envValidation = validateEnvironmentConfig()
  if (!envValidation.isValid) {
    return []
  }

  if (!notionClient.isProjectsConfigured()) {
    return []
  }

  try {
    const pages = await notionClient.getFeaturedProjects(limit)
    
    const projects = pages
      .map(page => {
        try {
          const preview = transformToProjectPreview(page)
          return sanitizeProjectPreview(preview)
        } catch (error) {
          console.warn(`Failed to transform featured project ${page.id}:`, error)
          return null
        }
      })
      .filter(Boolean) as ProjectPreview[]

    return projects.slice(0, limit)
  } catch (error) {
    throw new NotionError(
      "Failed to fetch featured projects from Notion",
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

// =============================================================================
// PUBLIC API WITH CACHING AND ERROR HANDLING
// =============================================================================

export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  return withServerErrorHandling(
    () => getCachedData(
      getBlogCacheKey("posts_list"),
      _getAllBlogPosts,
      CACHE_DURATION.BLOG_POSTS_LIST,
      []
    ),
    "fetch-all-blog-posts",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  return withServerErrorHandling(
    () => getCachedData(
      getBlogCacheKey("single_post", slug),
      () => _getBlogPostBySlug(slug),
      CACHE_DURATION.BLOG_SINGLE_POST,
      null
    ),
    "fetch-blog-post-by-slug",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("not found")
    }
  )
}

export async function getAllProjects(): Promise<ProjectPreview[]> {
  return withServerErrorHandling(
    () => getCachedData(
      getProjectsCacheKey("projects_list"),
      _getAllProjects,
      CACHE_DURATION.PROJECTS_LIST,
      []
    ),
    "fetch-all-projects",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getProjectById(id: string): Promise<ProjectContent | null> {
  return withServerErrorHandling(
    () => getCachedData(
      getProjectsCacheKey("single_project", id),
      () => _getProjectById(id),
      CACHE_DURATION.SINGLE_PROJECT,
      null
    ),
    "fetch-project-by-id",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("not found")
    }
  )
}

export async function getFeaturedProjects(limit: number = 4): Promise<ProjectPreview[]> {
  return withServerErrorHandling(
    () => getCachedData(
      getProjectsCacheKey("featured_projects"),
      () => _getFeaturedProjects(limit),
      CACHE_DURATION.FEATURED_PROJECTS,
      []
    ),
    "fetch-featured-projects",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

// =============================================================================
// UTILITY METHODS
// =============================================================================

export function isBlogConfigured(): boolean {
  return notionClient.isBlogConfigured()
}

export function isProjectsConfigured(): boolean {
  return notionClient.isProjectsConfigured()
}

export function clearAllCache(): void {
  clearCache()
}

export function clearBlogCache(slug?: string): void {
  clearCache("blog")
  if (slug) {
    clearCache(getBlogCacheKey("single_post", slug))
  }
}

export function clearProjectsCache(id?: string): void {
  clearCache("projects")
  if (id) {
    clearCache(getProjectsCacheKey("single_project", id))
  }
}

// Export client for direct access if needed
export { notionClient }