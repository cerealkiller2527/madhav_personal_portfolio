/**
 * Project Schemas
 * 
 * Defines the canonical Project type used throughout the application.
 * This is the single source of truth for project data structures.
 */

import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema } from './common.schemas'
import type { ExtendedRecordMap } from 'notion-types'

// ============================================================================
// Enums
// ============================================================================

/**
 * Project category enum
 */
export const projectCategorySchema = z.enum(['Software', 'Hardware', 'Hybrid'])
export type ProjectCategory = z.infer<typeof projectCategorySchema>
export const ProjectCategory = projectCategorySchema.enum

// ============================================================================
// Sub-schemas
// ============================================================================

/**
 * Statistic schema for project/experience stats
 */
export const statisticSchema = z.object({
  value: nonEmptyStringSchema,
  label: nonEmptyStringSchema
})
export type Statistic = z.infer<typeof statisticSchema>

// ============================================================================
// Main Project Schema
// ============================================================================

/**
 * Complete project schema - the canonical Project type.
 * Used for both Notion-sourced and local projects.
 */
export const projectSchema = z.object({
  // Core identification
  id: uuidSchema,
  slug: z.string().optional(),
  title: nonEmptyStringSchema,
  subtitle: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  
  // Categorization
  category: projectCategorySchema,
  tags: z.array(nonEmptyStringSchema),
  
  // Awards
  award: optionalSchema(z.string()),
  awardRank: optionalSchema(z.string()),
  
  // Statistics
  stats: z.array(statisticSchema).optional(),
  
  // Links
  liveLink: optionalSchema(urlSchema),
  githubLink: optionalSchema(urlSchema),
  
  // Media
  heroImage: z.string(),
  sketchfabEmbedUrl: optionalSchema(urlSchema),
  gallery: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })),
  
  // Content
  detailedDescription: nonEmptyStringSchema,
  keyFeatures: z.array(z.object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema
  })),
  techStack: z.array(z.object({
    name: nonEmptyStringSchema
  })),
  
  // Notion integration - optional recordMap for Notion-sourced projects
  recordMap: z.custom<ExtendedRecordMap>().optional()
})

export type Project = z.infer<typeof projectSchema>
