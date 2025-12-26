/**
 * Notion Service
 * 
 * High-level API for fetching and transforming Notion content.
 * Provides blog posts and projects from Notion databases.
 */

import { 
  BlogContent, 
  BlogPreview,
  ProjectContent,
  NotionProjectPreview,
  NotionPage
} from "@/lib/schemas"
import { notionClient } from "./notion-client"
import { 
  transformToBlogPreview,
  transformToBlogContent,
  transformToProjectPreview,
  transformToProjectContent
} from "./notion-transforms"
import { fetchWithFallback } from "@/lib/core/cache"

// ============================================================================
// Helper Functions
// ============================================================================

function safeTransform<T>(pages: NotionPage[], transformFn: (page: NotionPage) => T | null): T[] {
  return pages
    .map(page => {
      try {
        return transformFn(page)
      } catch {
        return null
      }
    })
    .filter(Boolean) as T[]
}

// ============================================================================
// Blog Posts
// ============================================================================

async function _getAllBlogPosts(): Promise<BlogPreview[]> {
  if (!notionClient.isBlogConfigured()) return []
  const pages = await notionClient.getBlogContents()
  
  const previews = pages.map(page => transformToBlogPreview(page))
  return previews.filter(Boolean) as BlogPreview[]
}

async function _getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  if (!notionClient.isBlogConfigured()) return null

  const allPosts = await getAllBlogPosts()
  const matchingPost = allPosts.find(post => post.slug === slug)
  if (!matchingPost) return null

  const recordMap = await notionClient.getPage(matchingPost.id)
  return await transformToBlogContent(matchingPost, recordMap)
}

export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  return fetchWithFallback(_getAllBlogPosts, [])
}

export async function getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  return fetchWithFallback(() => _getBlogPostBySlug(slug), null)
}

// ============================================================================
// Projects
// ============================================================================

async function _getAllProjects(): Promise<NotionProjectPreview[]> {
  if (!notionClient.isProjectsConfigured()) return []
  const pages = await notionClient.getProjects()
  return safeTransform(pages, transformToProjectPreview)
}

async function _getProjectById(id: string): Promise<ProjectContent | null> {
  if (!notionClient.isProjectsConfigured()) return null

  const allProjects = await getAllProjects()
  const matchingProject = allProjects.find(project => project.id === id)
  if (!matchingProject) return null

  const recordMap = await notionClient.getPage(matchingProject.id)
  return await transformToProjectContent(matchingProject, recordMap)
}

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  return fetchWithFallback(_getAllProjects, [])
}

export async function getProjectById(id: string): Promise<ProjectContent | null> {
  return fetchWithFallback(() => _getProjectById(id), null)
}

// ============================================================================
// Configuration Checks
// ============================================================================

export function isBlogConfigured(): boolean {
  return notionClient.isBlogConfigured()
}

export function isProjectsConfigured(): boolean {
  return notionClient.isProjectsConfigured()
}

export { notionClient }
