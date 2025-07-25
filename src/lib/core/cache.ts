// Build-time only cache for static export

export const getBlogCacheKey = (type: string, id?: string): string => {
  return id ? `blog:${type}:${id}` : `blog:${type}`
}

export const getProjectsCacheKey = (type: string, id?: string): string => {
  return id ? `projects:${type}:${id}` : `projects:${type}`
}

// Data is fetched once at build time in static export
export async function getCachedData<T>(
  _key: string,
  fetcher: () => Promise<T>,
  _ttlSeconds: number,
  fallback?: T
): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    if (fallback !== undefined) return fallback
    throw error
  }
}

export function clearCache(): void {
}