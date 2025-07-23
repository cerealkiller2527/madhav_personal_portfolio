/**
 * Simplified Notion Content Validation
 */

import { 
  BlogContent,
  BlogPreview,
  ProjectContent,
  NotionProjectPreview
} from "@/schemas"

// Simple pass-through sanitizers - remove complex validation overhead
export function sanitizeBlogPreview(data: unknown): BlogPreview | null {
  if (!data || typeof data !== 'object') return null
  return data as BlogPreview
}

export function sanitizeBlogContent(data: unknown): BlogContent | null {
  if (!data || typeof data !== 'object') return null
  return data as BlogContent
}

export function sanitizeProjectPreview(data: unknown): NotionProjectPreview | null {
  if (!data || typeof data !== 'object') return null
  return data as NotionProjectPreview
}

export function sanitizeProjectContent(data: unknown): ProjectContent | null {
  if (!data || typeof data !== 'object') return null
  return data as ProjectContent
}