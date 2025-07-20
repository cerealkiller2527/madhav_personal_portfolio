/**
 * Unified Validation for Notion Content
 * Handles validation for both blog and project content with shared utilities
 */

import { 
  ValidationResult,
  BlogContent,
  BlogPreview,
  ProjectContent,
  ProjectPreview,
  ProjectCategory,
  NotionConfig
} from "@/types/notion-unified"

// =============================================================================
// SHARED VALIDATION UTILITIES
// =============================================================================

function validateRequiredString(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>
): string[] {
  const errors: string[] = []
  
  if (!record[fieldName] || typeof record[fieldName] !== "string") {
    errors.push(`Missing or invalid ${fieldName}`)
  } else {
    target[fieldName] = record[fieldName]
  }
  
  return errors
}

function validateOptionalString(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>
): string[] {
  const errors: string[] = []
  
  if (record[fieldName] !== undefined) {
    if (typeof record[fieldName] !== "string") {
      errors.push(`Invalid ${fieldName} type`)
    } else {
      target[fieldName] = record[fieldName]
    }
  }
  
  return errors
}

function validateDateString(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>,
  required = true
): string[] {
  const errors: string[] = []
  
  if (!record[fieldName]) {
    if (required) {
      errors.push(`Missing or invalid ${fieldName}`)
    }
    return errors
  }
  
  if (typeof record[fieldName] !== "string") {
    errors.push(`Invalid ${fieldName} type`)
    return errors
  }
  
  const date = new Date(record[fieldName] as string)
  if (isNaN(date.getTime())) {
    errors.push(`Invalid ${fieldName} date format`)
  } else {
    target[fieldName] = record[fieldName]
  }
  
  return errors
}

function validateStringArray(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>,
  defaultValue: string[] = []
): string[] {
  const errors: string[] = []
  
  if (record[fieldName] !== undefined) {
    if (!Array.isArray(record[fieldName])) {
      errors.push(`Invalid ${fieldName} type - must be array`)
    } else {
      const array = record[fieldName] as unknown[]
      const invalidItems = array.filter((item: unknown) => typeof item !== "string")
      if (invalidItems.length > 0) {
        errors.push(`All ${fieldName} items must be strings`)
      } else {
        target[fieldName] = array as string[]
      }
    }
  } else {
    target[fieldName] = defaultValue
  }
  
  return errors
}

function validateOptionalNumber(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>
): string[] {
  const errors: string[] = []
  
  if (record[fieldName] !== undefined) {
    if (typeof record[fieldName] !== "number") {
      errors.push(`Invalid ${fieldName} type`)
    } else {
      target[fieldName] = record[fieldName]
    }
  }
  
  return errors
}

function validateOptionalBoolean(
  record: Record<string, unknown>,
  fieldName: string,
  target: Record<string, unknown>,
  defaultValue = true
): string[] {
  const errors: string[] = []
  
  if (record[fieldName] !== undefined && typeof record[fieldName] !== "boolean") {
    errors.push(`Invalid ${fieldName} type - must be boolean`)
  } else {
    target[fieldName] = record[fieldName] ?? defaultValue
  }
  
  return errors
}

// =============================================================================
// CONTENT VALIDATION
// =============================================================================

export function validateSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 100
}

export function validateContent(content: string): ValidationResult<string> {
  if (typeof content !== "string") {
    return { 
      isValid: false, 
      errors: ["Content must be a string"] 
    }
  }
  
  const errors: string[] = []
  
  // Check for potentially malicious content
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:.*?base64/gi,
    /vbscript:/gi,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      errors.push("Content contains potentially unsafe elements")
      break
    }
  }
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? content : undefined
  }
}

// =============================================================================
// BLOG VALIDATION
// =============================================================================

export function validateBlogPreview(data: unknown): ValidationResult<BlogPreview> {
  const errors: string[] = []
  const validatedData: Partial<BlogPreview> = {}

  if (!data || typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  const record = data as Record<string, unknown>

  // Required fields
  errors.push(...validateRequiredString(record, "id", validatedData))
  errors.push(...validateRequiredString(record, "slug", validatedData))
  errors.push(...validateRequiredString(record, "title", validatedData))
  errors.push(...validateDateString(record, "publishedAt", validatedData, true))
  errors.push(...validateDateString(record, "updatedAt", validatedData, true))

  // Optional fields
  errors.push(...validateOptionalString(record, "description", validatedData))
  errors.push(...validateOptionalString(record, "category", validatedData))
  errors.push(...validateOptionalString(record, "coverImage", validatedData))
  errors.push(...validateStringArray(record, "tags", validatedData))
  errors.push(...validateOptionalNumber(record, "readingTime", validatedData))
  errors.push(...validateOptionalBoolean(record, "published", validatedData, true))

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as BlogPreview : undefined
  }
}

export function validateBlogContent(data: unknown): ValidationResult<BlogContent> {
  const previewValidation = validateBlogPreview(data)
  
  if (!previewValidation.isValid || !previewValidation.data) {
    return {
      isValid: false,
      errors: previewValidation.errors
    }
  }

  const record = data as Record<string, unknown>
  const errors: string[] = []
  const validatedData: Partial<BlogContent> = {
    ...previewValidation.data
  }

  if (record.recordMap && typeof record.recordMap === "object") {
    validatedData.recordMap = record.recordMap as unknown // ExtendedRecordMap type is complex
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as BlogContent : undefined
  }
}

// =============================================================================
// PROJECT VALIDATION
// =============================================================================

export function validateProjectPreview(data: unknown): ValidationResult<ProjectPreview> {
  const errors: string[] = []
  const validatedData: Partial<ProjectPreview> = {}

  if (!data || typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  const record = data as Record<string, unknown>

  // Required fields
  errors.push(...validateRequiredString(record, "id", validatedData))
  errors.push(...validateRequiredString(record, "slug", validatedData))
  errors.push(...validateRequiredString(record, "title", validatedData))
  errors.push(...validateRequiredString(record, "subtitle", validatedData))
  errors.push(...validateRequiredString(record, "description", validatedData))
  errors.push(...validateDateString(record, "publishedAt", validatedData, true))
  errors.push(...validateDateString(record, "updatedAt", validatedData, true))

  // Validate category
  if (!record.category || typeof record.category !== "string") {
    errors.push("Missing or invalid category")
  } else {
    const category = record.category as string
    if (!Object.values(ProjectCategory).includes(category as ProjectCategory)) {
      errors.push("Invalid category - must be Software, Hardware, or Hybrid")
    } else {
      validatedData.category = category as ProjectCategory
    }
  }

  // Optional fields
  errors.push(...validateOptionalString(record, "award", validatedData))
  errors.push(...validateOptionalString(record, "awardRank", validatedData))
  errors.push(...validateOptionalString(record, "liveLink", validatedData))
  errors.push(...validateOptionalString(record, "githubLink", validatedData))
  errors.push(...validateOptionalString(record, "heroImage", validatedData))
  errors.push(...validateOptionalString(record, "vectaryEmbedUrl", validatedData))
  errors.push(...validateOptionalString(record, "coverImage", validatedData))
  errors.push(...validateStringArray(record, "tags", validatedData))
  errors.push(...validateOptionalBoolean(record, "published", validatedData, true))

  // Handle stats array (simplified for now)
  validatedData.stats = []

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as ProjectPreview : undefined
  }
}

export function validateProjectContent(data: unknown): ValidationResult<ProjectContent> {
  const previewValidation = validateProjectPreview(data)
  
  if (!previewValidation.isValid || !previewValidation.data) {
    return {
      isValid: false,
      errors: previewValidation.errors
    }
  }

  const record = data as Record<string, unknown>
  const errors: string[] = []
  const validatedData: Partial<ProjectContent> = {
    ...previewValidation.data
  }

  if (record.recordMap && typeof record.recordMap === "object") {
    validatedData.recordMap = record.recordMap as unknown // ExtendedRecordMap type is complex
  }

  // Set default empty arrays for complex fields
  validatedData.gallery = []
  validatedData.keyFeatures = []
  validatedData.techStack = []

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as ProjectContent : undefined
  }
}

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

export function validateEnvironmentConfig(): ValidationResult<NotionConfig> {
  const errors: string[] = []
  const config: Partial<NotionConfig> = {}

  config.token = process.env.NOTION_TOKEN
  config.blogDatabaseId = process.env.NOTION_DATABASE_ID
  config.projectsDatabaseId = process.env.NOTION_PROJECTS_DATABASE_ID

  // Parse numeric configs with defaults
  config.revalidateTime = process.env.BLOG_REVALIDATE_TIME 
    ? parseInt(process.env.BLOG_REVALIDATE_TIME, 10) || 60 
    : 60

  config.enableCache = process.env.ENABLE_BLOG_CACHE !== "false"
  
  config.cacheMaxSize = process.env.CACHE_MAX_SIZE 
    ? parseInt(process.env.CACHE_MAX_SIZE, 10) || 100 
    : 100

  // Check for blog configuration
  if (config.token && !config.blogDatabaseId) {
    errors.push("NOTION_DATABASE_ID is required when NOTION_TOKEN is provided for blog functionality")
  }

  // Check for projects configuration
  if (config.token && !config.projectsDatabaseId) {
    errors.push("NOTION_PROJECTS_DATABASE_ID is required when NOTION_TOKEN is provided for projects functionality")
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? config as NotionConfig : undefined
  }
}

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

export function sanitizeData<T>(
  data: unknown,
  validator: (data: unknown) => ValidationResult<T>
): T | null {
  const validation = validator(data)
  
  if (!validation.isValid || !validation.data) {
    return null
  }

  return validation.data
}

export const sanitizeBlogPreview = (data: unknown) => sanitizeData(data, validateBlogPreview)
export const sanitizeBlogContent = (data: unknown) => sanitizeData(data, validateBlogContent)
export const sanitizeProjectPreview = (data: unknown) => sanitizeData(data, validateProjectPreview)
export const sanitizeProjectContent = (data: unknown) => sanitizeData(data, validateProjectContent)