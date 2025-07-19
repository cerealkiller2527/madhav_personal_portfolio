import { BlogPost, BlogPostPreview, ValidationResult, BlogErrorCode } from "@/types/blog"

// Runtime validation for blog content
export function validateBlogPostPreview(data: unknown): ValidationResult<BlogPostPreview> {
  const errors: string[] = []
  let validatedData: Partial<BlogPostPreview> = {}

  if (!data || typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  const record = data as Record<string, unknown>

  // Required fields
  if (!record.id || typeof record.id !== "string") {
    errors.push("Missing or invalid id")
  } else {
    validatedData.id = record.id
  }

  if (!record.slug || typeof record.slug !== "string") {
    errors.push("Missing or invalid slug")
  } else {
    validatedData.slug = record.slug
  }

  if (!record.title || typeof record.title !== "string") {
    errors.push("Missing or invalid title")
  } else {
    validatedData.title = record.title
  }

  if (!record.publishedAt || typeof record.publishedAt !== "string") {
    errors.push("Missing or invalid publishedAt")
  } else {
    // Validate date format
    const date = new Date(record.publishedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid publishedAt date format")
    } else {
      validatedData.publishedAt = record.publishedAt
    }
  }

  // Optional fields validation
  if (record.description !== undefined) {
    if (typeof record.description !== "string") {
      errors.push("Invalid description type")
    } else {
      validatedData.description = record.description
    }
  }

  if (record.tags !== undefined) {
    if (!Array.isArray(record.tags)) {
      errors.push("Invalid tags type - must be array")
    } else {
      const invalidTags = record.tags.filter((tag: unknown) => typeof tag !== "string")
      if (invalidTags.length > 0) {
        errors.push("All tags must be strings")
      } else {
        validatedData.tags = record.tags as string[]
      }
    }
  } else {
    validatedData.tags = []
  }

  if (record.category !== undefined) {
    if (typeof record.category !== "string") {
      errors.push("Invalid category type")
    } else {
      validatedData.category = record.category
    }
  }

  if (record.coverImage !== undefined) {
    if (typeof record.coverImage !== "string") {
      errors.push("Invalid coverImage type")
    } else {
      validatedData.coverImage = record.coverImage
    }
  }

  if (record.readingTime !== undefined) {
    if (typeof record.readingTime !== "number") {
      errors.push("Invalid readingTime type")
    } else {
      validatedData.readingTime = record.readingTime
    }
  }

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

  if (!record.updatedAt || typeof record.updatedAt !== "string") {
    errors.push("Missing or invalid updatedAt")
  } else {
    const date = new Date(record.updatedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid updatedAt date format")
    } else {
      validatedData.updatedAt = record.updatedAt
    }
  }

  if (record.published !== undefined && typeof record.published !== "boolean") {
    errors.push("Invalid published type - must be boolean")
  } else {
    validatedData.published = record.published ?? true
  }

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
  const validation = validateBlogPostPreview(data)
  
  if (!validation.isValid || !validation.data) {
    console.warn("Invalid blog post preview data:", validation.errors)
    return null
  }

  return validation.data
}

export function sanitizeBlogPost(data: unknown): BlogPost | null {
  const validation = validateBlogPost(data)
  
  if (!validation.isValid || !validation.data) {
    console.warn("Invalid blog post data:", validation.errors)
    return null
  }

  return validation.data
}

// URL slug validation
export function validateSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 100
}

// Content safety validation
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

// Environment validation
export function validateBlogEnvironment(): ValidationResult<boolean> {
  const errors: string[] = []
  
  if (!process.env.NOTION_TOKEN && !process.env.NOTION_DATABASE_ID) {
    errors.push("Blog functionality requires NOTION_TOKEN and NOTION_DATABASE_ID environment variables")
  }
  
  if (process.env.NOTION_TOKEN && !process.env.NOTION_DATABASE_ID) {
    errors.push("NOTION_DATABASE_ID is required when NOTION_TOKEN is provided")
  }
  
  if (process.env.NOTION_DATABASE_ID && !process.env.NOTION_TOKEN) {
    errors.push("NOTION_TOKEN is required when NOTION_DATABASE_ID is provided")
  }
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? true : undefined
  }
}