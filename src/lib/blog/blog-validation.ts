import { BlogPost, BlogPostPreview } from "@/lib/types/blog"

// Validation schemas using runtime validation
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateBlogPostPreview(data: any): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== "object") {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  // Required fields
  if (!data.id || typeof data.id !== "string") {
    errors.push("Missing or invalid id")
  }

  if (!data.slug || typeof data.slug !== "string") {
    errors.push("Missing or invalid slug")
  }

  if (!data.title || typeof data.title !== "string") {
    errors.push("Missing or invalid title")
  }

  if (!data.publishedAt || typeof data.publishedAt !== "string") {
    errors.push("Missing or invalid publishedAt")
  } else {
    // Validate date format
    const date = new Date(data.publishedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid publishedAt date format")
    }
  }

  // Optional fields validation
  if (data.description && typeof data.description !== "string") {
    errors.push("Invalid description type")
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("Invalid tags type - must be array")
  } else if (data.tags) {
    const invalidTags = data.tags.filter((tag: any) => typeof tag !== "string")
    if (invalidTags.length > 0) {
      errors.push("All tags must be strings")
    }
  }

  if (data.category && typeof data.category !== "string") {
    errors.push("Invalid category type")
  }

  if (data.coverImage && typeof data.coverImage !== "string") {
    errors.push("Invalid coverImage type")
  }

  if (data.readingTime && typeof data.readingTime !== "number") {
    errors.push("Invalid readingTime type")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateBlogPost(data: any): ValidationResult {
  const previewValidation = validateBlogPostPreview(data)
  
  if (!previewValidation.isValid) {
    return previewValidation
  }

  const errors: string[] = []

  if (!data.updatedAt || typeof data.updatedAt !== "string") {
    errors.push("Missing or invalid updatedAt")
  } else {
    const date = new Date(data.updatedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid updatedAt date format")
    }
  }

  if (data.published !== undefined && typeof data.published !== "boolean") {
    errors.push("Invalid published type - must be boolean")
  }

  if (!data.recordMap || typeof data.recordMap !== "object") {
    errors.push("Missing or invalid recordMap")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function sanitizeBlogPostPreview(data: any): BlogPostPreview | null {
  const validation = validateBlogPostPreview(data)
  
  if (!validation.isValid) {
    console.warn("Invalid blog post preview data:", validation.errors)
    return null
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    publishedAt: data.publishedAt,
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
    category: data.category?.trim() || undefined,
    coverImage: data.coverImage?.trim() || undefined,
    readingTime: typeof data.readingTime === "number" ? data.readingTime : undefined,
  }
}

export function sanitizeBlogPost(data: any): BlogPost | null {
  const validation = validateBlogPost(data)
  
  if (!validation.isValid) {
    console.warn("Invalid blog post data:", validation.errors)
    return null
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
    category: data.category?.trim() || undefined,
    coverImage: data.coverImage?.trim() || undefined,
    published: data.published ?? true,
    recordMap: data.recordMap,
  }
}

// URL slug validation
export function validateSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 100
}

// Content safety validation
export function validateContent(content: string): ValidationResult {
  const errors: string[] = []
  
  if (typeof content !== "string") {
    return { isValid: false, errors: ["Content must be a string"] }
  }
  
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
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Environment validation
export function validateBlogEnvironment(): ValidationResult {
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
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}