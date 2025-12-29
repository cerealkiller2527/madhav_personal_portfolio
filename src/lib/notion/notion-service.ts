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
  NotionProjectPreview
} from "@/lib/schemas"
import { notionClient } from "./notion-client"
import { 
  transformToBlogPreview,
  transformToBlogContent,
  transformToProjectPreview,
  transformToProjectContent
} from "./notion-transforms"

// ============================================================================
// Blog Posts
// ============================================================================

export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  try {
    if (!notionClient.isBlogConfigured()) return []
    const pages = await notionClient.getBlogContents()
    return pages.map(page => transformToBlogPreview(page)).filter(Boolean) as BlogPreview[]
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  try {
    if (!notionClient.isBlogConfigured()) return null

    const allPosts = await getAllBlogPosts()
    const matchingPost = allPosts.find(post => post.slug === slug)
    if (!matchingPost) return null

    const recordMap = await notionClient.getPage(matchingPost.id)
    return await transformToBlogContent(matchingPost, recordMap)
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
}

// ============================================================================
// Projects
// ============================================================================

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  try {
    if (!notionClient.isProjectsConfigured()) return []
    const pages = await notionClient.getProjects()
    return pages.map(page => transformToProjectPreview(page)).filter(Boolean) as NotionProjectPreview[]
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export async function getProjectById(id: string): Promise<ProjectContent | null> {
  try {
    if (!notionClient.isProjectsConfigured()) return null

    const allProjects = await getAllProjects()
    const matchingProject = allProjects.find(project => project.id === id)
    if (!matchingProject) return null

    const recordMap = await notionClient.getPage(matchingProject.id)
    return await transformToProjectContent(matchingProject, recordMap)
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}
