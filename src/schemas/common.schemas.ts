import { z } from 'zod'

// ============================================================================
// Base Types
// ============================================================================

/**
 * UUID schema - validates UUID v4 format
 */
export const uuidSchema = z.string().uuid()

/**
 * Date string schema - validates ISO date strings
 */
export const dateStringSchema = z.string().datetime()

/**
 * URL schema - validates URLs
 */
export const urlSchema = z.string().url()

/**
 * Email schema - validates email format
 */
export const emailSchema = z.string().email()

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1, 'This field is required')

/**
 * Optional string schema that transforms empty strings to undefined
 */
export const optionalStringSchema = z.string().optional().or(z.literal(''))
  .transform(val => val === '' ? undefined : val)

// ============================================================================
// Common Patterns
// ============================================================================

/**
 * Pagination schema for list responses
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
})

/**
 * Sort order schema
 */
export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc')

/**
 * Date range schema for filtering
 */
export const dateRangeSchema = z.object({
  start: dateStringSchema,
  end: dateStringSchema
}).refine(data => new Date(data.start) <= new Date(data.end), {
  message: 'Start date must be before or equal to end date'
})

/**
 * Image schema for validating image objects
 */
export const imageSchema = z.object({
  url: urlSchema,
  alt: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().optional()
})

/**
 * SEO metadata schema
 */
export const seoMetadataSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: urlSchema.optional()
})

// ============================================================================
// API Response Wrappers
// ============================================================================

/**
 * Generic success response wrapper
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    metadata: z.object({
      timestamp: dateStringSchema,
      requestId: z.string().optional(),
      version: z.string().optional(),
      executionTime: z.number().optional()
    }).optional()
  })

/**
 * Generic error response schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    stackTrace: z.string().optional()
  })
})

/**
 * API response union type
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([
    successResponseSchema(dataSchema),
    errorResponseSchema
  ])

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

/**
 * Create an enum schema from an object (for TypeScript enums)
 */
export function enumSchema<T extends Record<string, string>>(enumObject: T) {
  const values = Object.values(enumObject) as [string, ...string[]]
  return z.enum(values)
}

// ============================================================================
// Type Exports
// ============================================================================

export type UUID = z.infer<typeof uuidSchema>
export type DateString = z.infer<typeof dateStringSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type DateRange = z.infer<typeof dateRangeSchema>
export type Image = z.infer<typeof imageSchema>
export type SEOMetadata = z.infer<typeof seoMetadataSchema>
export type SuccessResponse<T> = z.infer<ReturnType<typeof successResponseSchema<z.ZodType<T>>>>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type APIResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<z.ZodType<T>>>>