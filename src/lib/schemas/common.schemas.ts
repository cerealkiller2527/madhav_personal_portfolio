/**
 * Common Schemas
 * 
 * Base validation schemas used across the application.
 * Only includes schemas that are actually used.
 */

import { z } from 'zod'

// ============================================================================
// Base Types
// ============================================================================

/**
 * UUID schema - validates UUID v4 format
 */
export const uuidSchema = z.string().uuid()
export type UUID = z.infer<typeof uuidSchema>

/**
 * Date string schema - validates ISO date strings
 */
export const dateStringSchema = z.string().datetime()
export type DateString = z.infer<typeof dateStringSchema>

/**
 * URL schema - validates URLs
 */
export const urlSchema = z.string().url()

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1, 'This field is required')

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create an optional schema that handles empty strings
 */
export function optionalSchema<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
}
