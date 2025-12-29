/**
 * Centralized Schema Exports
 * 
 * Single source of truth for all type definitions used across the application.
 * Schemas are defined using Zod for runtime validation and TypeScript type inference.
 */

// ============================================================================
// Project Schemas and Types
// ============================================================================

export {
  projectCategorySchema,
  ProjectCategory,
  statisticSchema,
  projectSchema,
  type ProjectCategory as ProjectCategoryType,
  type Statistic,
  type Project
} from './project.schemas'

// ============================================================================
// Experience Schemas and Types
// ============================================================================

export {
  experienceSchema,
  type Experience
} from './experience.schemas'

// ============================================================================
// Blog Schemas and Types
// ============================================================================

export {
  blogContentSchema,
  blogPreviewSchema,
  type BlogContent,
  type BlogPreview
} from './notion.schemas'

// ============================================================================
// Notion Integration Schemas and Types
// ============================================================================

export {
  notionPropertyValueSchema,
  notionPageSchema,
  notionProjectPreviewSchema,
  projectContentSchema,
  notionConfigSchema,
  type NotionPropertyValue,
  type NotionPage,
  type NotionProjectPreview,
  type ProjectContent,
  type NotionConfig
} from './notion.schemas'
