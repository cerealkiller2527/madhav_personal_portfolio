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
  // Base validation schemas
  uuidSchema,
  dateStringSchema,
  urlSchema,
  emailSchema,
  nonEmptyStringSchema,
  optionalStringSchema,
  
  // Utility schemas
  paginationSchema,
  sortOrderSchema,
  dateRangeSchema,
  imageSchema,
  seoMetadataSchema,
  
  // API response schemas
  successResponseSchema,
  errorResponseSchema,
  apiResponseSchema,
  
  // Schema factory functions
  optionalSchema,
  enumSchema,
  
  // Types
  type UUID,
  type DateString,
  type Pagination,
  type DateRange,
  type Image,
  type SEOMetadata,
  type SuccessResponse,
  type ErrorResponse,
  type APIResponse
} from './common.schemas'

// ============================================================================
// Project Schemas and Types
// ============================================================================

export {
  // Category and sub-schemas
  projectCategorySchema,
  techCategorySchema,
  proficiencyLevelSchema,
  statisticSchema,
  galleryItemSchema,
  featureSchema,
  techStackItemSchema,
  
  // Main project schema
  projectSchema,
  
  // Enum values for runtime use
  ProjectCategory,
  
  // Types
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
  // Notion API schemas
  notionPropertyValueSchema,
  notionPageSchema,
  baseContentSchema,
  
  // Notion project schemas
  projectContentSchema,
  notionProjectPreviewSchema,
  
  // Configuration schemas
  notionConfigSchema,
  
  // Types
  type NotionPropertyValue,
  type NotionPage,
  type BaseContent,
  type ProjectContent,
  type NotionProjectPreview,
  type NotionConfig
} from './notion.schemas'

// ============================================================================
// Component Props Types
// ============================================================================

export {
  // Layout component props
  headerPropsSchema,
  type HeaderProps,
  
  // Page section props
  heroSectionPropsSchema,
  experienceSectionPropsSchema,
  projectsSectionPropsSchema,
  type HeroSectionProps,
  type ExperienceSectionProps,
  type ProjectsSectionProps
} from './component.schemas'
