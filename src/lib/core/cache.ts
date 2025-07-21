/**
 * Simple in-memory cache
 * Basic get/set/clear operations with TTL support
 */

interface CacheEntry<T> {
  data: T
  expires: number
}

const cache = new Map<string, CacheEntry<unknown>>()

// Simple cache key generator
function cacheKey(namespace: string, type: string, id?: string): string {
  return id ? `${namespace}:${type}:${id}` : `${namespace}:${type}`
}

// Cache key helpers for different namespaces
export const getBlogCacheKey = (type: string, id?: string) => cacheKey("blog", type, id)
export const getProjectsCacheKey = (type: string, id?: string) => cacheKey("projects", type, id)

// Get cached data or fetch fresh data
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
  fallback?: T
): Promise<T> {
  // Check cache
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry && Date.now() < entry.expires) {
    return entry.data
  }

  try {
    // Fetch and cache
    const data = await fetcher()
    cache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 })
    return data
  } catch (error) {
    if (fallback !== undefined) return fallback
    throw error
  }
}

// Clear cache by pattern or all
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