import { BlogPost, BlogPostPreview } from "@/types/blogTypes"
import { 
  getCacheKey as getSharedCacheKey,
  getCachedData,
  invalidateCache,
  getCacheStats
} from "@/lib/cache/shared-cache"

// Cache configuration
const CACHE_DURATION = {
  POSTS_LIST: 60 * 5, // 5 minutes
  SINGLE_POST: 60 * 10, // 10 minutes
  SITEMAP: 60 * 60, // 1 hour
} as const

const NAMESPACE = "blog"

export function getCacheKey(type: string, identifier?: string): string {
  return getSharedCacheKey(NAMESPACE, type, identifier)
}

// Cached wrapper functions
export async function getCachedBlogPosts(
  fetcher: () => Promise<BlogPostPreview[]>
): Promise<BlogPostPreview[]> {
  const cacheKey = getCacheKey("posts_list")
  return getCachedData(cacheKey, fetcher, CACHE_DURATION.POSTS_LIST, [])
}

export async function getCachedBlogPost(
  slug: string,
  fetcher: (slug: string) => Promise<BlogPost | null>
): Promise<BlogPost | null> {
  const cacheKey = getCacheKey("single_post", slug)
  return getCachedData(cacheKey, () => fetcher(slug), CACHE_DURATION.SINGLE_POST, null)
}

// Cache warming utilities
export async function warmCache(
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

// ISR helpers
export function getRevalidateTime(): number {
  const envTime = process.env.BLOG_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

// Cache invalidation on demand
export function invalidateBlogCache(slug?: string): void {
  const keysToInvalidate = [getCacheKey("posts_list")]
  
  if (slug) {
    keysToInvalidate.push(getCacheKey("single_post", slug))
  }
  
  invalidateCache(keysToInvalidate)
}

// Cache statistics
export function getBlogCacheStats() {
  return getCacheStats(NAMESPACE)
}