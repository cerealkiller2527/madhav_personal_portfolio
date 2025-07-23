/**
 * Blog Utility Functions
 * Date formatting, display utilities, and constants
 */

// Date formatting utilities
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Tag display utilities
export function getDisplayTags(tags: string[] | undefined, maxTags = 2): { visible: string[]; overflow: number } {
  if (!tags || !Array.isArray(tags)) {
    return { visible: [], overflow: 0 }
  }
  
  const visible = tags.slice(0, maxTags)
  const overflow = Math.max(0, tags.length - maxTags)
  
  return { visible, overflow }
}

// Blog preview constants
export const BLOG_PREVIEW_LIMITS = {
  POSTS_TO_SHOW: 3,
  MAX_TAGS_VISIBLE: 2,
  DEFAULT_READING_TIME: 5
} as const