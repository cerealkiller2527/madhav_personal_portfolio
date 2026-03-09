// High-level API for fetching and transforming Notion content

import { 
  BlogContent, 
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/lib/types"
import { notionClient } from "./notion-client"
import { 
  transformToBlogPreview,
  transformToBlogContent,
  transformToProjectPreview,
  transformToProjectContent
} from "./notion-transforms"
import { cacheNotionImage, processRecordMapImages } from "./notion-image-cache"

async function cachePreviewImages<T extends { coverImage?: string; heroImage?: string }>(
  preview: T
): Promise<T> {
  const [coverImage, heroImage] = await Promise.all([
    preview.coverImage ? cacheNotionImage(preview.coverImage) : Promise.resolve(preview.coverImage),
    'heroImage' in preview && preview.heroImage
      ? cacheNotionImage(preview.heroImage)
      : Promise.resolve((preview as { heroImage?: string }).heroImage),
  ])
  return { ...preview, coverImage, heroImage }
}

// --- Blog Posts ---

export async function getAllBlogPosts(): Promise<BlogPreview[]> {
  try {
    if (!notionClient.isBlogConfigured()) return []
    const pages = await notionClient.getBlogContents()
    const previews = pages.map(page => transformToBlogPreview(page)).filter(Boolean) as BlogPreview[]
    return Promise.all(previews.map(cachePreviewImages))
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
    const cachedRecordMap = await processRecordMapImages(recordMap)
    return await transformToBlogContent(matchingPost, cachedRecordMap)
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
}

// --- Projects ---

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  try {
    if (!notionClient.isProjectsConfigured()) return []
    const pages = await notionClient.getProjects()
    const previews = pages.map(page => transformToProjectPreview(page)).filter(Boolean) as NotionProjectPreview[]
    return Promise.all(previews.map(cachePreviewImages))
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
    const cachedRecordMap = await processRecordMapImages(recordMap)
    return await transformToProjectContent(matchingProject, cachedRecordMap)
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}
