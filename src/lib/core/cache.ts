/**
 * Data Fetching Utilities
 * 
 * For static export builds, data is fetched once at build time.
 * This module provides a simple wrapper with error handling and fallback support.
 */

// ============================================================================
// Cache Key Generators
// ============================================================================

/**
 * Generates a cache key for blog-related data.
 * Used for debugging and logging purposes.
 */
export const getBlogCacheKey = (type: string, id?: string): string => {
  return id ? `blog:${type}:${id}` : `blog:${type}`
}

/**
 * Generates a cache key for project-related data.
 * Used for debugging and logging purposes.
 */
export const getProjectsCacheKey = (type: string, id?: string): string => {
  return id ? `projects:${type}:${id}` : `projects:${type}`
}

// ============================================================================
// Data Fetching
// ============================================================================

/**
 * Fetches data with error handling and optional fallback.
 * In static export mode, this simply executes the fetcher directly.
 * 
 * @param _key - Cache key (unused in static export, kept for API compatibility)
 * @param fetcher - Async function that fetches the data
 * @param _ttlSeconds - TTL in seconds (unused in static export)
 * @param fallback - Optional fallback value if fetching fails
 * @returns The fetched data or fallback value
 */
export async function getCachedData<T>(
  _key: string,
  fetcher: () => Promise<T>,
  _ttlSeconds: number,
  fallback?: T
): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    console.error(`Data fetch failed for key: ${_key}`, error)
    if (fallback !== undefined) return fallback
    throw error
  }
}

/**
 * No-op function for cache clearing.
 * In static export mode, there's no runtime cache to clear.
 */
export function clearCache(): void {
  // No-op for static export
}
