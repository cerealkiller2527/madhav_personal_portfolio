/**
 * Unified Notion Service
 * High-level service layer that combines client, transforms, validation, and caching
 */

import { 
  BlogContent, 
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/schemas"
import { notionClient } from "./client"
import { 
  transformToBlogPreview,
  transformToBlogContent,
  transformToProjectPreview,
  transformToProjectContent
} from "./transforms"
import {
  sanitizeBlogPreview,
  sanitizeBlogContent,
  sanitizeProjectPreview,
  sanitizeProjectContent
} from "./validation"
import { 
  getCachedData,
  clearCache,
  getBlogCacheKey,
  getProjectsCacheKey
} from "@/lib/core/cache"
import { logError } from "@/lib/errors"

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
  if (!notionClient.isBlogConfigured()) {
    return []
  }

  const pages = await notionClient.getBlogContents()
  
  const blogPosts = pages
    .map(page => {
      try {
        const preview = transformToBlogPreview(page)
        return sanitizeBlogPreview(preview)
      } catch {
        return null
      }
    })
    .filter(Boolean) as BlogPreview[]

  return blogPosts
}

async function _getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  if (!notionClient.isBlogConfigured()) {
    return null
  }

  const allPosts = await getAllBlogPosts()
  const matchingPost = allPosts.find(post => post.slug === slug)
  
  if (!matchingPost) {
    return null
  }

  const recordMap = await notionClient.getPage(matchingPost.id)
  const blogContent = await transformToBlogContent(matchingPost, recordMap)
  return sanitizeBlogContent(blogContent)
}

// =============================================================================
// PROJECT SERVICE METHODS
// =============================================================================

async function _getAllProjects(): Promise<NotionProjectPreview[]> {
  if (!notionClient.isProjectsConfigured()) {
    return []
  }

  const pages = await notionClient.getProjects()
  
  const projects = pages
    .map(page => {
      try {
        const preview = transformToProjectPreview(page)
        return sanitizeProjectPreview(preview)
      } catch {
        return null
      }
    })
    .filter(Boolean) as NotionProjectPreview[]

  return projects
}

async function _getProjectById(id: string): Promise<ProjectContent | null> {
  if (!notionClient.isProjectsConfigured()) {
    return null
  }

  const allProjects = await getAllProjects()
  const matchingProject = allProjects.find(project => project.id === id)
  
  if (!matchingProject) {
    return null
  }

  const recordMap = await notionClient.getPage(matchingProject.id)
  const projectContent = await transformToProjectContent(matchingProject, recordMap)
  return sanitizeProjectContent(projectContent)
}

async function _getFeaturedProjects(limit: number = 4): Promise<NotionProjectPreview[]> {
  if (!notionClient.isProjectsConfigured()) {
    return []
  }

  const pages = await notionClient.getFeaturedProjects(limit)
  
  const projects = pages
    .map(page => {
      try {
        const preview = transformToProjectPreview(page)
        return sanitizeProjectPreview(preview)
      } catch {
        return null
      }
    })
    .filter(Boolean) as NotionProjectPreview[]

  return projects.slice(0, limit)
}

// =============================================================================
// PUBLIC API WITH CACHING AND ERROR HANDLING
// =============================================================================

export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  try {
    return await getCachedData(
      getBlogCacheKey("posts_list"),
      _getAllBlogPosts,
      CACHE_DURATION.BLOG_POSTS_LIST,
      []
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), "fetch-all-blog-posts")
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  try {
    return await getCachedData(
      getBlogCacheKey("single_post", slug),
      () => _getBlogPostBySlug(slug),
      CACHE_DURATION.BLOG_SINGLE_POST,
      null
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), "fetch-blog-post-by-slug")
    return null
  }
}

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  try {
    return await getCachedData(
      getProjectsCacheKey("projects_list"),
      _getAllProjects,
      CACHE_DURATION.PROJECTS_LIST,
      []
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), "fetch-all-projects")
    return []
  }
}

export async function getProjectById(id: string): Promise<ProjectContent | null> {
  try {
    return await getCachedData(
      getProjectsCacheKey("single_project", id),
      () => _getProjectById(id),
      CACHE_DURATION.SINGLE_PROJECT,
      null
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), "fetch-project-by-id")
    return null
  }
}

export async function getFeaturedProjects(limit: number = 4): Promise<NotionProjectPreview[]> {
  try {
    return await getCachedData(
      getProjectsCacheKey("featured_projects"),
      () => _getFeaturedProjects(limit),
      CACHE_DURATION.FEATURED_PROJECTS,
      []
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), "fetch-featured-projects")
    return []
  }
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