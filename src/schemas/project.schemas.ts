import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema } from './common.schemas'

// ============================================================================
// Enums
// ============================================================================

/**
 * Project category enum
 */
export const projectCategorySchema = z.enum(['Software', 'Hardware', 'Hybrid'])
export type ProjectCategory = z.infer<typeof projectCategorySchema>

// Export enum values for runtime use
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
 * Complete project schema
 */
export const projectSchema = z.object({
  id: uuidSchema,
  title: nonEmptyStringSchema,
  subtitle: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  category: projectCategorySchema,
  award: optionalSchema(z.string()),
  awardRank: optionalSchema(z.string()),
  stats: z.array(statisticSchema).optional(),
  tags: z.array(nonEmptyStringSchema),
  liveLink: optionalSchema(urlSchema),
  githubLink: optionalSchema(urlSchema),
  heroImage: urlSchema,
  gallery: z.array(galleryItemSchema),
  detailedDescription: nonEmptyStringSchema,
  vectaryEmbedUrl: optionalSchema(urlSchema),
  keyFeatures: z.array(featureSchema),
  techStack: z.array(techStackItemSchema),
  // Optional Notion support - using z.any() for ExtendedRecordMap as it's from external lib
  recordMap: z.any().optional()
})
export type Project = z.infer<typeof projectSchema>

/**
 * Project creation schema (for forms/API input)
 */
export const projectCreateSchema = projectSchema.omit({
  id: true
})
export type ProjectCreate = z.infer<typeof projectCreateSchema>

/**
 * Project update schema (all fields optional except id)
 */
export const projectUpdateSchema = projectSchema.partial().required({ id: true })
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>

// ============================================================================
// Filter Schemas
// ============================================================================

/**
 * Project filter schema for searching/filtering
 */
export const projectFilterSchema = z.object({
  category: projectCategorySchema.optional(),
  tags: z.array(z.string()).optional(),
  hasLiveLink: z.boolean().optional(),
  hasGithubLink: z.boolean().optional()
})
export type ProjectFilter = z.infer<typeof projectFilterSchema>

// ============================================================================
// UI State Schemas
// ============================================================================

/**
 * Project UI state schema
 */
export const projectUIStateSchema = z.object({
  selectedProject: projectSchema.nullable(),
  showMore: z.boolean(),
  activeFilter: z.union([projectCategorySchema, z.literal('All')]),
  bounceProjectId: z.string().nullable()
})
export type ProjectUIState = z.infer<typeof projectUIStateSchema>

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate project data
 */
export function validateProject(data: unknown): Project {
  return projectSchema.parse(data)
}

/**
 * Safely validate project data
 */
export function safeValidateProject(data: unknown) {
  return projectSchema.safeParse(data)
}

/**
 * Check if data is a valid project
 */
export function isValidProject(data: unknown): data is Project {
  return safeValidateProject(data).success
}