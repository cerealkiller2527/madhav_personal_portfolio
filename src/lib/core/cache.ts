/**
 * Build-time only cache for static export
 * In static export, caching happens at build time only
 */

// Cache key helpers for different namespaces
export const getBlogCacheKey = (type: string, id?: string): string => {
  return id ? `blog:${type}:${id}` : `blog:${type}`
}

export const getProjectsCacheKey = (type: string, id?: string): string => {
  return id ? `projects:${type}:${id}` : `projects:${type}`
}

// In static export, we don't need runtime caching
// Data is fetched once at build time
export async function getCachedData<T>(
  _key: string,
  fetcher: () => Promise<T>,
  _ttlSeconds: number,
  fallback?: T
): Promise<T> {
  try {
    // Always fetch fresh data at build time
    return await fetcher()
  } catch (error) {
    if (fallback !== undefined) return fallback
    throw error
  }
}

// No-op in static export
export function clearCache(_pattern?: string): void {
  // No caching in static export
}