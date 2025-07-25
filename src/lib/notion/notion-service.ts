
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
import { 
  getCachedData,
  clearCache,
  getBlogCacheKey,
  getProjectsCacheKey
} from "@/lib/core/cache"
import { NotionPage } from "@/lib/schemas"


const CACHE_DURATION = {
  BLOG_POSTS_LIST: 5 * 60,     // 5 minutes
  BLOG_SINGLE_POST: 10 * 60,   // 10 minutes
  PROJECTS_LIST: 5 * 60,       // 5 minutes
  SINGLE_PROJECT: 10 * 60,     // 10 minutes
  FEATURED_PROJECTS: 15 * 60,  // 15 minutes
} as const


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

async function _getFeaturedProjects(limit: number = 4): Promise<NotionProjectPreview[]> {
  if (!notionClient.isProjectsConfigured()) return []
  const pages = await notionClient.getFeaturedProjects(limit)
  return safeTransform(pages, transformToProjectPreview).slice(0, limit)
}


export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  try {
    return await getCachedData(
      getBlogCacheKey("posts_list"),
      _getAllBlogPosts,
      CACHE_DURATION.BLOG_POSTS_LIST,
      []
    )
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    return []
  }
}


export function isBlogConfigured(): boolean {
  return notionClient.isBlogConfigured()
}

export function isProjectsConfigured(): boolean {
  return notionClient.isProjectsConfigured()
}

export function clearAllCache(): void {
  clearCache()
}

export function clearBlogCache(): void {
  clearCache()
}

export function clearProjectsCache(): void {
  clearCache()
}

export { notionClient }