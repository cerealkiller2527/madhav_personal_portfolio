/**
 * Application Constants
 * 
 * Centralized constants used across the application.
 */

// ============================================================================
// Project Section Identifiers
// ============================================================================

/**
 * Section IDs for project content.
 * Used in TOC generation and section rendering.
 */
export const PROJECT_SECTIONS = {
  overview: 'overview',
  features: 'features',
  techStack: 'tech-stack',
  gallery: 'gallery',
  statistics: 'statistics',
} as const

export type ProjectSectionId = (typeof PROJECT_SECTIONS)[keyof typeof PROJECT_SECTIONS]

// ============================================================================
// Image Heights
// ============================================================================

/**
 * Consistent image heights for project displays.
 */
export const PROJECT_IMAGE_HEIGHTS = {
  modal: {
    hero: 'h-64 md:h-80',
    gallery: 'h-48',
  },
  fullPage: {
    hero: 'h-64 md:h-96',
    gallery: 'h-56',
  },
  card: {
    hero: 'aspect-video',
  },
} as const

// ============================================================================
// Grid Layouts
// ============================================================================

/**
 * Number of items to show before "Show More"
 */
export const PAGINATION = {
  projectsInitial: 4,
  blogPostsPreview: 3,
} as const
