/**
 * Data Fetching Utilities
 * 
 * For static export builds, data is fetched once at build time.
 * This module provides error handling and fallback support.
 */

// ============================================================================
// Data Fetching
// ============================================================================

/**
 * Fetches data with error handling and optional fallback.
 * In static export mode, this simply executes the fetcher directly.
 * 
 * @param fetcher - Async function that fetches the data
 * @param fallback - Optional fallback value if fetching fails
 * @returns The fetched data or fallback value
 */
export async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    console.error('Data fetch failed:', error)
    if (fallback !== undefined) return fallback
    throw error
  }
}
