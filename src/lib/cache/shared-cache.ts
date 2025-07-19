import { CacheEntry } from "@/types/blogTypes"

// Generic cache implementation for both blog and projects
const cache = new Map<string, CacheEntry<unknown>>()

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