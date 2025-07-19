import { NotionProject, NotionProjectPreview } from "@/types/projectTypes"
import { 
  getCacheKey as getSharedCacheKey,
  getCachedData,
  invalidateCache,
  getCacheStats
} from "@/lib/cache/shared-cache"

// Cache configuration
const CACHE_DURATION = {
  PROJECTS_LIST: 60 * 5, // 5 minutes
  SINGLE_PROJECT: 60 * 10, // 10 minutes
  FEATURED_PROJECTS: 60 * 15, // 15 minutes
} as const

const NAMESPACE = "projects"

export function getCacheKey(type: string, identifier?: string): string {
  return getSharedCacheKey(NAMESPACE, type, identifier)
}

// Cached wrapper functions
export async function getCachedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getCacheKey("projects_list")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.PROJECTS_LIST, [])
}

export async function getCachedProject(
  identifier: string,
  fetcher: (identifier: string) => Promise<NotionProject | null>
): Promise<NotionProject | null> {
  const cacheKey = getCacheKey("single_project", identifier)
  return getCachedData(cacheKey, () => fetcher(identifier), CACHE_DURATION.SINGLE_PROJECT, null)
}

export async function getCachedFeaturedProjects(
  fetcher: () => Promise<NotionProjectPreview[]>
): Promise<NotionProjectPreview[]> {
  const cacheKey = getCacheKey("featured_projects")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.FEATURED_PROJECTS, [])
}

// Cache warming utilities
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

// ISR helpers
export function getProjectsRevalidateTime(): number {
  const envTime = process.env.PROJECTS_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

// Cache invalidation on demand
export function invalidateProjectsCache(identifier?: string): void {
  const keysToInvalidate = [
    getCacheKey("projects_list"),
    getCacheKey("featured_projects")
  ]
  
  if (identifier) {
    keysToInvalidate.push(getCacheKey("single_project", identifier))
  }
  
  invalidateCache(keysToInvalidate)
}

// Cache statistics
export function getProjectsCacheStats() {
  return getCacheStats(NAMESPACE)
}