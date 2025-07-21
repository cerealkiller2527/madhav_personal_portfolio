import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema, dateRangeSchema } from './common.schemas'
import { statisticSchema } from './project.schemas'

// ============================================================================
// Main Experience Schema
// ============================================================================

/**
 * Experience schema for work/education experiences
 */
export const experienceSchema = z.object({
  id: uuidSchema,
  company: nonEmptyStringSchema,
  logo: urlSchema,
  role: nonEmptyStringSchema,
  title: optionalSchema(z.string()),
  date: optionalSchema(z.string()),
  location: optionalSchema(z.string()),
  description: nonEmptyStringSchema,
  stats: z.array(statisticSchema).optional(),
  tags: z.array(nonEmptyStringSchema),
  liveLink: optionalSchema(urlSchema)
})
export type Experience = z.infer<typeof experienceSchema>

/**
 * Experience creation schema
 */
export const experienceCreateSchema = experienceSchema.omit({
  id: true
})
export type ExperienceCreate = z.infer<typeof experienceCreateSchema>

/**
 * Experience update schema
 */
export const experienceUpdateSchema = experienceSchema.partial().required({ id: true })
export type ExperienceUpdate = z.infer<typeof experienceUpdateSchema>

// ============================================================================
// Filter Schemas
// ============================================================================

/**
 * Experience filter schema for searching/filtering
 */
export const experienceFilterSchema = z.object({
  company: z.string().optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  dateRange: dateRangeSchema.optional()
})
export type ExperienceFilter = z.infer<typeof experienceFilterSchema>

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate experience data
 */
export function validateExperience(data: unknown): Experience {
  return experienceSchema.parse(data)
}

/**
 * Safely validate experience data
 */
export function safeValidateExperience(data: unknown) {
  return experienceSchema.safeParse(data)
}

/**
 * Check if data is a valid experience
 */
export function isValidExperience(data: unknown): data is Experience {
  return safeValidateExperience(data).success
}