import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema, dateStringSchema } from './common.schemas'
import { projectCategorySchema, statisticSchema, galleryItemSchema, featureSchema, techStackItemSchema } from './project.schemas'
import type { ExtendedRecordMap } from 'notion-types'

// ============================================================================
// Notion API Types
// ============================================================================

/**
 * Extended record map schema - properly typed wrapper for notion-types
 */
export const extendedRecordMapSchema = z.custom<ExtendedRecordMap>(
  (val) => val !== null && typeof val === 'object',
  { message: 'Invalid ExtendedRecordMap' }
)

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
  recordMap: extendedRecordMapSchema.optional()
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
  recordMap: extendedRecordMapSchema.optional()
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
export const validationResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  data: dataSchema.optional()
})
export type ValidationResult<T> = {
  isValid: boolean
  errors: string[]
  data?: T
}


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
export const cacheEntrySchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  data: dataSchema,
  timestamp: z.number(),
  ttl: z.number(),
  key: z.string()
})
export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
  key: string
}

