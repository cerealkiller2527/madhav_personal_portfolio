/**
 * Unified Notion Integration
 * Clean export layer for the new consolidated Notion service
 */

// Re-export the main service methods for backward compatibility
export {
  getAllBlogPosts,
  getBlogPostBySlug,
  getAllProjects,
  getProjectById,
  getFeaturedProjects,
  isBlogConfigured,
  isProjectsConfigured,
  clearAllCache,
  clearBlogCache,
  clearProjectsCache,
  notionClient
} from "@/lib/notion-service"

// Re-export utility functions
export {
  calculateReadingTime,
  normalizeImageUrl,
  createSlugFromTitle
} from "@/lib/notion-transforms"

// Re-export types for backward compatibility
export type {
  BlogContent as BlogPost,
  BlogPreview as BlogPostPreview,
  ProjectContent as NotionProject,
  ProjectPreview as NotionProjectPreview
} from "@/types/notion-unified"