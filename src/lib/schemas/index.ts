/**
 * Centralized Schema Exports
 * 
 * Single source of truth for all type definitions used across the application.
 * Schemas are defined using Zod for runtime validation and TypeScript type inference.
 */

// ============================================================================
// Common Schemas and Types
// ============================================================================

export {
  uuidSchema,
  dateStringSchema,
  urlSchema,
  nonEmptyStringSchema,
  optionalSchema,
  type UUID,
  type DateString
} from './common.schemas'

// ============================================================================
// Project Schemas and Types
// ============================================================================

export {
  // Enums
  projectCategorySchema,
  techCategorySchema,
  proficiencyLevelSchema,
  ProjectCategory,
  
  // Sub-schemas
  statisticSchema,
  galleryItemSchema,
  featureSchema,
  techStackItemSchema,
  
  // Main project schema
  projectSchema,
  
  // Types
  type ProjectCategory as ProjectCategoryType,
  type TechCategory,
  type ProficiencyLevel,
  type Statistic,
  type GalleryItem,
  type Feature,
  type TechStackItem,
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
} from './blog.schemas'

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
