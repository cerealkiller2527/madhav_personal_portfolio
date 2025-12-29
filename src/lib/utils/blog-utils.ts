/**
 * Blog Utility Functions
 * 
 * Date formatting and display utilities for blog content.
 */

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Formats a date string for blog display (e.g., "Dec 26, 2024").
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ============================================================================
// Tag Display
// ============================================================================

/**
 * Splits tags into visible and overflow for display.
 * 
 * @param tags - Array of tag strings
 * @param maxTags - Maximum number of tags to show (default: 2)
 * @returns Object with visible tags array and overflow count
 */
export function getDisplayTags(tags: string[] | undefined, maxTags = 2): { visible: string[]; overflow: number } {
  if (!tags || !Array.isArray(tags)) {
    return { visible: [], overflow: 0 }
  }
  
  const visible = tags.slice(0, maxTags)
  const overflow = Math.max(0, tags.length - maxTags)
  
  return { visible, overflow }
}
