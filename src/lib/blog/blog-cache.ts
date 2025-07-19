import { BlogPost, BlogPostPreview } from "@/lib/types/blog"

// Cache configuration
const CACHE_DURATION = {
  POSTS_LIST: 60 * 5, // 5 minutes
  SINGLE_POST: 60 * 10, // 10 minutes
  SITEMAP: 60 * 60, // 1 hour
} as const

// In-memory cache (for serverless environments)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function getCacheKey(type: string, identifier?: string): string {
  return identifier ? `${type}:${identifier}` : type
}

export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlSeconds * 1000,
  })
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  
  if (!entry) {
    return null
  }
  
  const now = Date.now()
  const isExpired = now - entry.timestamp > entry.ttl
  
  if (isExpired) {
    cache.delete(key)
    return null
  }
  
  return entry.data as T
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
export async function getCachedBlogPosts(
  fetcher: () => Promise<BlogPostPreview[]>
): Promise<BlogPostPreview[]> {
  const cacheKey = getCacheKey("posts_list")
  const cached = getCache<BlogPostPreview[]>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const posts = await fetcher()
    setCache(cacheKey, posts, CACHE_DURATION.POSTS_LIST)
    return posts
  } catch (error) {
    console.error("Error fetching cached blog posts:", error)
    return []
  }
}

export async function getCachedBlogPost(
  slug: string,
  fetcher: (slug: string) => Promise<BlogPost | null>
): Promise<BlogPost | null> {
  const cacheKey = getCacheKey("single_post", slug)
  const cached = getCache<BlogPost>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const post = await fetcher(slug)
    if (post) {
      setCache(cacheKey, post, CACHE_DURATION.SINGLE_POST)
    }
    return post
  } catch (error) {
    console.error(`Error fetching cached blog post ${slug}:`, error)
    return null
  }
}

// Cache warming utilities
export async function warmCache(
  getAllPosts: () => Promise<BlogPostPreview[]>,
  getPost: (slug: string) => Promise<BlogPost | null>
): Promise<void> {
  try {
    console.log("Warming blog cache...")
    
    // Warm posts list cache
    const posts = await getAllPosts()
    const cacheKey = getCacheKey("posts_list")
    setCache(cacheKey, posts, CACHE_DURATION.POSTS_LIST)
    
    // Warm recent posts cache
    const recentPosts = posts.slice(0, 3)
    for (const post of recentPosts) {
      const fullPost = await getPost(post.slug)
      if (fullPost) {
        const postCacheKey = getCacheKey("single_post", post.slug)
        setCache(postCacheKey, fullPost, CACHE_DURATION.SINGLE_POST)
      }
    }
    
    console.log(`Blog cache warmed with ${posts.length} posts`)
  } catch (error) {
    console.error("Error warming cache:", error)
  }
}

// ISR helpers
export function getRevalidateTime(): number {
  const envTime = process.env.BLOG_REVALIDATE_TIME
  return envTime ? parseInt(envTime, 10) : 60
}

// Cache invalidation on demand
export function invalidateBlogCache(slug?: string): void {
  if (slug) {
    // Invalidate specific post
    const postKey = getCacheKey("single_post", slug)
    cache.delete(postKey)
  }
  
  // Always invalidate posts list when any post changes
  const listKey = getCacheKey("posts_list")
  cache.delete(listKey)
  
  console.log(`Cache invalidated for ${slug || "all posts"}`)
}