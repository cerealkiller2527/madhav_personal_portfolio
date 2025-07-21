import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema, dateStringSchema } from './common.schemas'
import { projectCategorySchema, statisticSchema, galleryItemSchema, featureSchema, techStackItemSchema } from './project.schemas'

// ============================================================================
// Notion API Types
// ============================================================================

/**
 * Notion property value schema
 */
export const notionPropertyValueSchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'rich_text', 'date', 'checkbox', 'select', 'multi_select', 'files', 'url']),
  title: z.array(z.object({ plain_text: z.string() })).optional(),
  rich_text: z.array(z.object({ plain_text: z.string() })).optional(),
  date: z.object({ start: z.string() }).nullable().optional(),
  checkbox: z.boolean().optional(),
  select: z.object({ name: z.string() }).nullable().optional(),
  multi_select: z.array(z.object({ name: z.string() })).optional(),
  files: z.array(z.object({
    file: z.object({ url: urlSchema }).optional(),
    external: z.object({ url: urlSchema }).optional()
  })).optional(),
  url: z.string().nullable().optional()
})
export type NotionPropertyValue = z.infer<typeof notionPropertyValueSchema>

/**
 * Notion page schema
 */
export const notionPageSchema = z.object({
  object: z.literal('page'),
  id: z.string(),
  created_time: dateStringSchema,
  last_edited_time: dateStringSchema,
  cover: z.object({
    type: z.enum(['external', 'file']),
    external: z.object({ url: urlSchema }).optional(),
    file: z.object({ url: urlSchema }).optional()
  }).nullable().optional(),
  archived: z.boolean(),
  properties: z.record(notionPropertyValueSchema),
  url: urlSchema
})
export type NotionPage = z.infer<typeof notionPageSchema>

// ============================================================================
// Base Content Schema
// ============================================================================

/**
 * Base content schema for both blog and project content
 */
export const baseContentSchema = z.object({
  id: uuidSchema,
  slug: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  description: optionalSchema(z.string()),
  publishedAt: dateStringSchema,
  updatedAt: dateStringSchema,
  tags: z.array(nonEmptyStringSchema),
  coverImage: optionalSchema(urlSchema),
  published: z.boolean()
})
export type BaseContent = z.infer<typeof baseContentSchema>

// ============================================================================
// Blog Schemas
// ============================================================================

/**
 * Blog content schema (full content with Notion data)
 */
export const blogContentSchema = baseContentSchema.extend({
  category: optionalSchema(z.string()),
  readingTime: z.number().int().positive().optional(),
  recordMap: z.any().optional() // ExtendedRecordMap from notion-types
})
export type BlogContent = z.infer<typeof blogContentSchema>

/**
 * Blog preview schema (for listings, without full content)
 */
export const blogPreviewSchema = blogContentSchema.omit({ recordMap: true })
export type BlogPreview = z.infer<typeof blogPreviewSchema>

// ============================================================================
// Project Schemas (Notion-based)
// ============================================================================

/**
 * Project content schema (full content with Notion data)
 */
export const projectContentSchema = baseContentSchema.extend({
  subtitle: nonEmptyStringSchema,
  category: projectCategorySchema,
  award: optionalSchema(z.string()),
  awardRank: optionalSchema(z.string()),
  stats: z.array(statisticSchema),
  liveLink: optionalSchema(urlSchema),
  githubLink: optionalSchema(urlSchema),
  heroImage: optionalSchema(urlSchema),
  vectaryEmbedUrl: optionalSchema(urlSchema),
  gallery: z.array(galleryItemSchema),
  keyFeatures: z.array(featureSchema),
  techStack: z.array(techStackItemSchema),
  recordMap: z.any().optional() // ExtendedRecordMap from notion-types
})
export type ProjectContent = z.infer<typeof projectContentSchema>

/**
 * Notion project preview schema (for listings, without full content)
 */
export const notionProjectPreviewSchema = projectContentSchema.omit({
  recordMap: true,
  gallery: true,
  keyFeatures: true,
  techStack: true
})
export type NotionProjectPreview = z.infer<typeof notionProjectPreviewSchema>

// ============================================================================
// Validation & Error Schemas
// ============================================================================

/**
 * Validation result schema
 */
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  data: z.unknown().optional()
})
export type ValidationResult<T = unknown> = z.infer<typeof validationResultSchema> & { data?: T }

/**
 * Notion error codes
 */
export const notionErrorCodeSchema = z.enum([
  'CONFIGURATION_ERROR',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'NETWORK_ERROR',
  'CACHE_ERROR',
  'TRANSFORM_ERROR',
  'UNKNOWN_ERROR'
])
export type NotionErrorCode = z.infer<typeof notionErrorCodeSchema>

// ============================================================================
// Configuration Schemas
// ============================================================================

/**
 * Notion configuration schema
 */
export const notionConfigSchema = z.object({
  token: z.string().optional(),
  blogDatabaseId: z.string().optional(),
  projectsDatabaseId: z.string().optional(),
  revalidateTime: z.number().int().nonnegative(),
  enableCache: z.boolean(),
  cacheMaxSize: z.number().int().positive()
})
export type NotionConfig = z.infer<typeof notionConfigSchema>

/**
 * Cache entry schema
 */
export const cacheEntrySchema = z.object({
  data: z.unknown(),
  timestamp: z.number(),
  ttl: z.number(),
  key: z.string()
})
export type CacheEntry<T> = Omit<z.infer<typeof cacheEntrySchema>, 'data'> & { data: T }

// ============================================================================
// Error Class (kept as class for compatibility)
// ============================================================================

export class NotionError extends Error {
  constructor(
    message: string,
    public readonly code: NotionErrorCode,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'NotionError'
  }
}