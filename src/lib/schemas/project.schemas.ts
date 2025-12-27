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

/**
 * Technology category enum
 */
export const techCategorySchema = z.enum([
  'Software',
  'Mobile',
  'Database',
  'AI/ML',
  'Design', 
  'Fabrication',
  'Hardware'
])
export type TechCategory = z.infer<typeof techCategorySchema>

/**
 * Proficiency level enum
 */
export const proficiencyLevelSchema = z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
export type ProficiencyLevel = z.infer<typeof proficiencyLevelSchema>

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

/**
 * Gallery item schema for project images
 */
export const galleryItemSchema = z.object({
  url: urlSchema,
  caption: nonEmptyStringSchema,
  alt: optionalSchema(z.string()),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
})
export type GalleryItem = z.infer<typeof galleryItemSchema>

/**
 * Feature schema for project key features
 */
export const featureSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  icon: optionalSchema(z.string())
})
export type Feature = z.infer<typeof featureSchema>

/**
 * Tech stack item schema
 */
export const techStackItemSchema = z.object({
  name: nonEmptyStringSchema,
  category: techCategorySchema,
  icon: optionalSchema(z.string()),
  proficiency: proficiencyLevelSchema.optional()
})
export type TechStackItem = z.infer<typeof techStackItemSchema>

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
  heroImage: z.string(), // URL or path to hero image
  sketchfabEmbedUrl: optionalSchema(urlSchema),
  gallery: z.array(galleryItemSchema),
  
  // Content
  detailedDescription: nonEmptyStringSchema,
  keyFeatures: z.array(featureSchema),
  techStack: z.array(techStackItemSchema),
  
  // Notion integration - optional recordMap for Notion-sourced projects
  recordMap: z.custom<ExtendedRecordMap>().optional()
})

export type Project = z.infer<typeof projectSchema>
