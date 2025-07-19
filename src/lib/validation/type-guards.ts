import {
  Project,
  Experience,
  ProjectCategory,
  TechCategory,
  BlogPost,
  BlogPostPreview,
  NotionPage,
  APIResponse
} from "@/types"

// Portfolio type guards
export function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.subtitle === "string" &&
    typeof obj.description === "string" &&
    isProjectCategory(obj.category) &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === "string") &&
    typeof obj.heroImage === "string" &&
    Array.isArray(obj.gallery) &&
    typeof obj.detailedDescription === "string" &&
    Array.isArray(obj.keyFeatures) &&
    Array.isArray(obj.techStack)
  )
}

export function isExperience(value: unknown): value is Experience {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return (
    typeof obj.id === "string" &&
    typeof obj.company === "string" &&
    typeof obj.logo === "string" &&
    typeof obj.role === "string" &&
    typeof obj.description === "string" &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === "string")
  )
}

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return value === "Software" || value === "Hardware" || value === "Hybrid"
}

export function isTechCategory(value: unknown): value is TechCategory {
  const validCategories = [
    "Frontend", "Backend", "Database", "DevOps", "Mobile", 
    "Hardware", "Tools", "Language", "Framework", "Library"
  ]
  return typeof value === "string" && validCategories.includes(value)
}

// Blog type guards
export function isBlogPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return (
    typeof obj.id === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.title === "string" &&
    typeof obj.publishedAt === "string" &&
    typeof obj.updatedAt === "string" &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === "string") &&
    typeof obj.published === "boolean" &&
    obj.recordMap !== null &&
    typeof obj.recordMap === "object"
  )
}

export function isBlogPostPreview(value: unknown): value is BlogPostPreview {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return (
    typeof obj.id === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.title === "string" &&
    typeof obj.publishedAt === "string" &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === "string")
  )
}

// Notion type guards
export function isNotionPage(value: unknown): value is NotionPage {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return (
    obj.object === "page" &&
    typeof obj.id === "string" &&
    typeof obj.created_time === "string" &&
    typeof obj.last_edited_time === "string" &&
    typeof obj.archived === "boolean" &&
    obj.properties !== null &&
    typeof obj.properties === "object" &&
    typeof obj.url === "string"
  )
}

// API type guards
export function isAPIResponse<T>(value: unknown): value is APIResponse<T> {
  if (!value || typeof value !== "object") return false
  
  const obj = value as Record<string, unknown>
  
  return typeof obj.success === "boolean"
}

export function isSuccessfulAPIResponse<T>(value: unknown): value is APIResponse<T> & { success: true } {
  return isAPIResponse(value) && value.success === true
}

export function isFailedAPIResponse<T>(value: unknown): value is APIResponse<T> & { success: false } {
  return isAPIResponse(value) && value.success === false
}

// Utility type guards
export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

export function isArray<T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false
  
  if (itemGuard) {
    return value.every(itemGuard)
  }
  
  return true
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export function isValidEmail(value: unknown): value is string {
  if (!isString(value)) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isValidUrl(value: unknown): value is string {
  if (!isString(value)) return false
  
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isValidDate(value: unknown): value is string {
  if (!isString(value)) return false
  
  const date = new Date(value)
  return !isNaN(date.getTime())
}

// Array validation helpers
export function validateArray<T>(
  value: unknown,
  itemValidator: (item: unknown) => item is T,
  options: {
    minLength?: number
    maxLength?: number
    required?: boolean
  } = {}
): { isValid: boolean; errors: string[]; data?: T[] } {
  const errors: string[] = []
  
  if (value === undefined || value === null) {
    if (options.required) {
      errors.push("Array is required")
    }
    return { isValid: !options.required, errors }
  }
  
  if (!Array.isArray(value)) {
    errors.push("Value must be an array")
    return { isValid: false, errors }
  }
  
  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push(`Array must have at least ${options.minLength} items`)
  }
  
  if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors.push(`Array must have at most ${options.maxLength} items`)
  }
  
  const validItems: T[] = []
  value.forEach((item, index) => {
    if (itemValidator(item)) {
      validItems.push(item)
    } else {
      errors.push(`Invalid item at index ${index}`)
    }
  })
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validItems : undefined
  }
}

// Object validation helpers
export function validateObject<T>(
  value: unknown,
  validator: (obj: Record<string, unknown>) => obj is T,
  required = false
): { isValid: boolean; errors: string[]; data?: T } {
  const errors: string[] = []
  
  if (value === undefined || value === null) {
    if (required) {
      errors.push("Object is required")
    }
    return { isValid: !required, errors }
  }
  
  if (!isObject(value)) {
    errors.push("Value must be an object")
    return { isValid: false, errors }
  }
  
  const isValid = validator(value)
  return {
    isValid,
    errors: isValid ? [] : ["Object validation failed"],
    data: isValid ? value : undefined
  }
}