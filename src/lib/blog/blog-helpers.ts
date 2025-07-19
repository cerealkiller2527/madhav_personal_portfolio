// Date formatting utilities for blog
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Blog post display utilities
export function getDisplayTags(tags: string[], maxTags = 2): { visible: string[]; overflow: number } {
  const visible = tags.slice(0, maxTags)
  const overflow = Math.max(0, tags.length - maxTags)
  
  return { visible, overflow }
}

// Reading time estimation
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Blog preview constants
export const BLOG_PREVIEW_LIMITS = {
  POSTS_TO_SHOW: 3,
  MAX_TAGS_VISIBLE: 2,
  DEFAULT_READING_TIME: 5
} as const