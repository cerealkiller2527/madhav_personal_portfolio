// Blog utility functions for date formatting and tag display

// Formats a date string for blog display (e.g., "Dec 26, 2024")
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Splits tags into visible and overflow for display
export function getDisplayTags(tags: string[] | undefined, maxTags = 2): { visible: string[]; overflow: number } {
  if (!tags || !Array.isArray(tags)) {
    return { visible: [], overflow: 0 }
  }
  
  const visible = tags.slice(0, maxTags)
  const overflow = Math.max(0, tags.length - maxTags)
  
  return { visible, overflow }
}
