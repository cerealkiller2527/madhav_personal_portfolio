import { BlogPost, BlogPostPreview, ValidationResult } from "@/types/blog"
import { 
  validateRequiredString,
  validateOptionalString,
  validateDateString,
  validateStringArray,
  validateOptionalNumber,
  validateOptionalBoolean,
  sanitizeData,
  validateSlug,
  validateContent,
  validateEnvironmentPair,
  ValidationResult as SharedValidationResult
} from "@/lib/validation/shared-validation"

// Runtime validation for blog content
export function validateBlogPostPreview(data: unknown): ValidationResult<BlogPostPreview> {
  const errors: string[] = []
  let validatedData: Partial<BlogPostPreview> = {}

  if (!data || typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  const record = data as Record<string, unknown>

  // Required fields
  errors.push(...validateRequiredString(record, "id", validatedData))
  errors.push(...validateRequiredString(record, "slug", validatedData))
  errors.push(...validateRequiredString(record, "title", validatedData))
  errors.push(...validateDateString(record, "publishedAt", validatedData, true))

  // Optional fields
  errors.push(...validateOptionalString(record, "description", validatedData))
  errors.push(...validateOptionalString(record, "category", validatedData))
  errors.push(...validateOptionalString(record, "coverImage", validatedData))
  errors.push(...validateStringArray(record, "tags", validatedData))
  errors.push(...validateOptionalNumber(record, "readingTime", validatedData))

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as BlogPostPreview : undefined
  }
}

export function validateBlogPost(data: unknown): ValidationResult<BlogPost> {
  const previewValidation = validateBlogPostPreview(data)
  
  if (!previewValidation.isValid || !previewValidation.data) {
    return {
      isValid: false,
      errors: previewValidation.errors
    }
  }

  const record = data as Record<string, unknown>
  const errors: string[] = []
  let validatedData: Partial<BlogPost> = {
    ...previewValidation.data
  }

  errors.push(...validateDateString(record, "updatedAt", validatedData, true))
  errors.push(...validateOptionalBoolean(record, "published", validatedData, true))

  if (!record.recordMap || typeof record.recordMap !== "object") {
    errors.push("Missing or invalid recordMap")
  } else {
    validatedData.recordMap = record.recordMap as any // ExtendedRecordMap type is complex
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as BlogPost : undefined
  }
}

export function sanitizeBlogPostPreview(data: unknown): BlogPostPreview | null {
  return sanitizeData(data, validateBlogPostPreview)
}

export function sanitizeBlogPost(data: unknown): BlogPost | null {
  return sanitizeData(data, validateBlogPost)
}

// Environment validation
export function validateBlogEnvironment(): ValidationResult<boolean> {
  return validateEnvironmentPair("NOTION_TOKEN", "NOTION_DATABASE_ID", "Blog")
}

// Re-export shared utilities
export { validateSlug, validateContent }