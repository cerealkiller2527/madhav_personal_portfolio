import { NotionProject, NotionProjectPreview, ProjectCacheEntry } from "@/types/projects"

// Cache configuration
const CACHE_DURATION = {
  PROJECTS_LIST: 60 * 5, // 5 minutes
  SINGLE_PROJECT: 60 * 10, // 10 minutes
  FEATURED_PROJECTS: 60 * 15, // 15 minutes
} as const

// In-memory cache (for serverless environments)
const cache = new Map<string, ProjectCacheEntry<unknown>>()

export function getCacheKey(type: string, identifier?: string): string {
  return identifier ? `projects:${type}:${identifier}` : `projects:${type}`
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
  const entry = cache.get(key) as ProjectCacheEntry<T> | undefined
  
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

// Cached wrapper functions
export async function getCachedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getCacheKey("projects_list")
  const cached = getCache<NotionProjectPreview[]>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const projects = await fetcher()
    setCache(cacheKey, projects, CACHE_DURATION.PROJECTS_LIST)
    return projects
  } catch (error) {
    console.error("Error fetching cached projects:", error)
    return []
  }
}

export async function getCachedProject(
  identifier: string,
  fetcher: (identifier: string) => Promise<NotionProject | null>
): Promise<NotionProject | null> {
  const cacheKey = getCacheKey("single_project", identifier)
  const cached = getCache<NotionProject>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const project = await fetcher(identifier)
    if (project) {
      setCache(cacheKey, project, CACHE_DURATION.SINGLE_PROJECT)
    }
    return project
  } catch (error) {
    console.error(`Error fetching cached project ${identifier}:`, error)
    return null
  }
}

export async function getCachedFeaturedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getCacheKey("featured_projects")
  const cached = getCache<NotionProjectPreview[]>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const projects = await fetcher()
    setCache(cacheKey, projects, CACHE_DURATION.FEATURED_PROJECTS)
    return projects
  } catch (error) {
    console.error("Error fetching cached featured projects:", error)
    return []
  }
}

// Cache warming utilities
export async function warmProjectsCache(
  getAllProjects: () => Promise<NotionProjectPreview[]>,
  getProject: (id: string) => Promise<NotionProject | null>
): Promise<void> {
  try {
    console.log("Warming projects cache...")
    
    // Warm projects list cache
    const projects = await getAllProjects()
    const cacheKey = getCacheKey("projects_list")
    setCache(cacheKey, projects, CACHE_DURATION.PROJECTS_LIST)
    
    // Warm featured projects cache (first 4)
    const featuredProjects = projects.slice(0, 4)
    for (const project of featuredProjects) {
      const fullProject = await getProject(project.id)
      if (fullProject) {
        const projectCacheKey = getCacheKey("single_project", project.id)
        setCache(projectCacheKey, fullProject, CACHE_DURATION.SINGLE_PROJECT)
      }
    }
    
    console.log(`Projects cache warmed with ${projects.length} projects`)
  } catch (error) {
    console.error("Error warming projects cache:", error)
  }
}

// ISR helpers
export function getProjectsRevalidateTime(): number {
  const envTime = process.env.PROJECTS_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

// Cache invalidation on demand
export function invalidateProjectsCache(identifier?: string): void {
  if (identifier) {
    // Invalidate specific project (by id or slug)
    const projectKey = getCacheKey("single_project", identifier)
    cache.delete(projectKey)
  }
  
  // Always invalidate projects list when any project changes
  const listKey = getCacheKey("projects_list")
  cache.delete(listKey)
  
  // Also invalidate featured projects
  const featuredKey = getCacheKey("featured_projects")
  cache.delete(featuredKey)
  
  console.log(`Projects cache invalidated for ${identifier || "all projects"}`)
}

// Cache statistics
export function getProjectsCacheStats() {
  const projectKeys = Array.from(cache.keys()).filter(key => key.startsWith('projects:'))
  const totalSize = projectKeys.length
  
  let hitCount = 0
  let expiredCount = 0
  const now = Date.now()
  
  for (const key of projectKeys) {
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
    totalEntries: totalSize,
    activeEntries: hitCount,
    expiredEntries: expiredCount,
    hitRate: totalSize > 0 ? (hitCount / totalSize) * 100 : 0
  }
}