/**
 * Experience Schemas
 * 
 * Defines the schema for work/education experiences displayed on the portfolio.
 */

import { z } from 'zod'
import { uuidSchema, urlSchema, nonEmptyStringSchema, optionalSchema } from './common.schemas'
import { statisticSchema } from './project.schemas'

// ============================================================================
// Main Experience Schema
// ============================================================================

/**
 * Experience schema for work/education experiences.
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
