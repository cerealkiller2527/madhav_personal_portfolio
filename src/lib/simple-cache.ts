/**
 * Simple in-memory cache for Notion data
 * Minimal implementation to replace the complex cache system
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export function getCacheKey(namespace: string, type: string, identifier?: string): string {
  const baseKey = `${namespace}:${type}`
  return identifier ? `${baseKey}:${identifier}` : baseKey
}

export function getBlogCacheKey(type: string, identifier?: string): string {
  return getCacheKey("blog", type, identifier)
}

export function getProjectsCacheKey(type: string, identifier?: string): string {
  return getCacheKey("projects", type, identifier)
}

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
  fallback?: T
): Promise<T> {
  // Check if data exists and is not expired
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry) {
    const now = Date.now()
    const isExpired = now - entry.timestamp > entry.ttl
    if (!isExpired) {
      return entry.data
    }
    // Remove expired entry
    cache.delete(key)
  }

  try {
    // Fetch fresh data
    const data = await fetcher()
    
    // Cache the result
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
    
    return data
  } catch (error) {
    if (fallback !== undefined) {
      return fallback
    }
    throw error
  }
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