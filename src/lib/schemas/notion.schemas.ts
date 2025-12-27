/**
 * Notion Integration Schemas
 * 
 * Schemas for Notion API data structures and content transformation.
 */

import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema, dateStringSchema } from './common.schemas'
import { projectCategorySchema, statisticSchema } from './project.schemas'
import type { ExtendedRecordMap } from 'notion-types'

// ============================================================================
// Notion API Types
// ============================================================================

/**
 * Notion property value schema - represents a single property from Notion API
 */
export const notionPropertyValueSchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'rich_text', 'date', 'checkbox', 'select', 'multi_select', 'files', 'url', 'number']),
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
  url: z.string().nullable().optional(),
  number: z.number().nullable().optional()
})
export type NotionPropertyValue = z.infer<typeof notionPropertyValueSchema>

/**
 * Notion page schema - represents a page from the Notion API
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
// Blog Content Schemas
// ============================================================================

/**
 * Blog preview schema (for listings, without full content)
 */
export const blogPreviewSchema = z.object({
  id: uuidSchema,
  slug: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  description: optionalSchema(z.string()),
  publishedAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(nonEmptyStringSchema),
  category: optionalSchema(z.string()),
  coverImage: optionalSchema(urlSchema),
  published: z.boolean(),
  readingTime: z.number().int().positive().optional()
})
export type BlogPreview = z.infer<typeof blogPreviewSchema>

/**
 * Blog content schema (full content with Notion recordMap)
 */
export const blogContentSchema = blogPreviewSchema.extend({
  recordMap: z.custom<ExtendedRecordMap>().optional()
})
export type BlogContent = z.infer<typeof blogContentSchema>

// ============================================================================
// Notion Project Preview Schema
// ============================================================================

/**
 * Notion project preview - intermediate type for Notion API responses
 * before transformation to the canonical Project type.
 */
export const notionProjectPreviewSchema = z.object({
  id: uuidSchema,
  slug: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  subtitle: nonEmptyStringSchema,
  description: optionalSchema(z.string()),
  publishedAt: z.string(),
  updatedAt: z.string(),
  category: projectCategorySchema,
  award: optionalSchema(z.string()),
  awardRank: optionalSchema(z.string()),
  tags: z.array(nonEmptyStringSchema),
  liveLink: optionalSchema(urlSchema),
  githubLink: optionalSchema(urlSchema),
  heroImage: optionalSchema(urlSchema),
  coverImage: optionalSchema(urlSchema),
  sketchfabEmbedUrl: optionalSchema(urlSchema),
  stats: z.array(statisticSchema),
  published: z.boolean()
})
export type NotionProjectPreview = z.infer<typeof notionProjectPreviewSchema>

/**
 * Notion project content - full project data with recordMap
 */
export const projectContentSchema = notionProjectPreviewSchema.extend({
  recordMap: z.custom<ExtendedRecordMap>().optional(),
  gallery: z.array(z.object({
    url: urlSchema,
    caption: nonEmptyStringSchema
  })),
  keyFeatures: z.array(z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema
  })),
  techStack: z.array(z.object({
    name: nonEmptyStringSchema
  }))
})
export type ProjectContent = z.infer<typeof projectContentSchema>

// ============================================================================
// Configuration Schema
// ============================================================================

/**
 * Notion configuration schema for client initialization.
 * Note: revalidateTime, enableCache, and cacheMaxSize are kept for
 * compatibility with UnifiedNotionClient but are not actively used
 * in the current static export build.
 */
export const notionConfigSchema = z.object({
  token: z.string().optional(),
  blogDatabaseId: z.string().optional(),
  projectsDatabaseId: z.string().optional(),
  revalidateTime: z.number().int().nonnegative().optional(),
  enableCache: z.boolean().optional(),
  cacheMaxSize: z.number().int().positive().optional()
})
export type NotionConfig = z.infer<typeof notionConfigSchema>
