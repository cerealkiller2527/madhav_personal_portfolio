import { CacheEntry } from "@/types/blogTypes"
import { BlogPost, BlogPostPreview } from "@/types/blogTypes"
import { NotionProject, NotionProjectPreview } from "@/types/projectTypes"

// Generic cache implementation for both blog and projects
const cache = new Map<string, CacheEntry<unknown>>()

// Cache configuration
const CACHE_DURATION = {
  // Blog caching
  BLOG_POSTS_LIST: 60 * 5, // 5 minutes
  BLOG_SINGLE_POST: 60 * 10, // 10 minutes
  BLOG_SITEMAP: 60 * 60, // 1 hour
  
  // Projects caching
  PROJECTS_LIST: 60 * 5, // 5 minutes
  SINGLE_PROJECT: 60 * 10, // 10 minutes
  FEATURED_PROJECTS: 60 * 15, // 15 minutes
} as const

// =============================================================================
// CORE CACHE UTILITIES
// =============================================================================

export function getCacheKey(namespace: string, type: string, identifier?: string): string {
  const baseKey = `${namespace}:${type}`
  return identifier ? `${baseKey}:${identifier}` : baseKey
}

export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  cache.set(key, {
    key,
    data,
    timestamp: Date.now(),
    ttl: ttlSeconds * 1000,
  })
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  
  if (!entry) {
    return null
  }
  
  const now = Date.now()
  const isExpired = now - entry.timestamp > entry.ttl
  
  if (isExpired) {
    cache.delete(key)
    return null
  }
  
  return entry.data
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear()
    return
  }
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
  fallback?: T
): Promise<T> {
  const cached = getCache<T>(key)
  
  if (cached) {
    return cached
  }
  
  try {
    const data = await fetcher()
    setCache(key, data, ttlSeconds)
    return data
  } catch (error) {
    if (fallback !== undefined) {
      return fallback
    }
    throw error
  }
}

export function invalidateCache(keys: string[]): void {
  for (const key of keys) {
    cache.delete(key)
  }
}

export function getCacheStats(namespace?: string) {
  const relevantKeys = namespace 
    ? Array.from(cache.keys()).filter(key => key.startsWith(`${namespace}:`))
    : Array.from(cache.keys())
  
  const totalSize = relevantKeys.length
  let hitCount = 0
  let expiredCount = 0
  const now = Date.now()
  
  for (const key of relevantKeys) {
    const entry = cache.get(key)
    if (entry) {
      const isExpired = now - entry.timestamp > entry.ttl
      if (isExpired) {
        expiredCount++
      } else {
        hitCount++
      }
    }
  }
  
  return {
    namespace: namespace || 'global',
    totalEntries: totalSize,
    activeEntries: hitCount,
    expiredEntries: expiredCount,
    hitRate: totalSize > 0 ? (hitCount / totalSize) * 100 : 0
  }
}

// =============================================================================
// BLOG CACHE UTILITIES
// =============================================================================

const BLOG_NAMESPACE = "blog"

export function getBlogCacheKey(type: string, identifier?: string): string {
  return getCacheKey(BLOG_NAMESPACE, type, identifier)
}

export async function getCachedBlogPosts(
  fetcher: () => Promise<BlogPostPreview[]>
): Promise<BlogPostPreview[]> {
  const cacheKey = getBlogCacheKey("posts_list")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.BLOG_POSTS_LIST, [])
}

export async function getCachedBlogPost(
  slug: string,
  fetcher: (slug: string) => Promise<BlogPost | null>
): Promise<BlogPost | null> {
  const cacheKey = getBlogCacheKey("single_post", slug)
  return getCachedData(cacheKey, () => fetcher(slug), CACHE_DURATION.BLOG_SINGLE_POST, null)
}

export async function warmBlogCache(
  getAllPosts: () => Promise<BlogPostPreview[]>,
  getPost: (slug: string) => Promise<BlogPost | null>
): Promise<void> {
  try {
    // Warm posts list cache
    const posts = await getCachedBlogPosts(getAllPosts)
    
    // Warm recent posts cache
    const recentPosts = posts.slice(0, 3)
    for (const post of recentPosts) {
      await getCachedBlogPost(post.slug, getPost)
    }
  } catch (error) {
    // Silently fail warming
  }
}

export function getBlogRevalidateTime(): number {
  const envTime = process.env.BLOG_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

export function invalidateBlogCache(slug?: string): void {
  const keysToInvalidate = [getBlogCacheKey("posts_list")]
  
  if (slug) {
    keysToInvalidate.push(getBlogCacheKey("single_post", slug))
  }
  
  invalidateCache(keysToInvalidate)
}

export function getBlogCacheStats() {
  return getCacheStats(BLOG_NAMESPACE)
}

// =============================================================================
// PROJECTS CACHE UTILITIES
// =============================================================================

const PROJECTS_NAMESPACE = "projects"

export function getProjectsCacheKey(type: string, identifier?: string): string {
  return getCacheKey(PROJECTS_NAMESPACE, type, identifier)
}

export async function getCachedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getProjectsCacheKey("projects_list")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.PROJECTS_LIST, [])
}

export async function getCachedProject(
  identifier: string,
  fetcher: (identifier: string) => Promise<NotionProject | null>
): Promise<NotionProject | null> {
  const cacheKey = getProjectsCacheKey("single_project", identifier)
  return getCachedData(cacheKey, () => fetcher(identifier), CACHE_DURATION.SINGLE_PROJECT, null)
}

export async function getCachedFeaturedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getProjectsCacheKey("featured_projects")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.FEATURED_PROJECTS, [])
}

export async function warmProjectsCache(
  getAllProjects: () => Promise<NotionProjectPreview[]>,
  getProject: (id: string) => Promise<NotionProject | null>
): Promise<void> {
  try {
    // Warm projects list cache
    const projects = await getCachedProjects(getAllProjects)
    
    // Warm featured projects cache (first 4)
    const featuredProjects = projects.slice(0, 4)
    for (const project of featuredProjects) {
      await getCachedProject(project.id, getProject)
    }
  } catch (error) {
    // Silently fail warming
  }
}

export function getProjectsRevalidateTime(): number {
  const envTime = process.env.PROJECTS_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

export function invalidateProjectsCache(identifier?: string): void {
  const keysToInvalidate = [
    getProjectsCacheKey("projects_list"),
    getProjectsCacheKey("featured_projects")
  ]
  
  if (identifier) {
    keysToInvalidate.push(getProjectsCacheKey("single_project", identifier))
  }
  
  invalidateCache(keysToInvalidate)
}

export function getProjectsCacheStats() {
  return getCacheStats(PROJECTS_NAMESPACE)
}