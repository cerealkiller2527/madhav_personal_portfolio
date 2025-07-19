// Generic validation utilities shared between blog and projects

export interface ValidationResult<T> {
  isValid: boolean
  errors: string[]
  data?: T
}

export function validateRequiredString(
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

export function validateOptionalString(
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

export function validateDateString(
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

export function validateStringArray(
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

export function validateOptionalNumber(
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

export function validateOptionalBoolean(
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

// Environment validation helper
export function validateEnvironmentPair(
  tokenVar: string,
  idVar: string,
  systemName: string
): ValidationResult<boolean> {
  const errors: string[] = []
  const token = process.env[tokenVar]
  const id = process.env[idVar]
  
  if (!token && !id) {
    errors.push(`${systemName} functionality requires ${tokenVar} and ${idVar} environment variables`)
  }
  
  if (token && !id) {
    errors.push(`${idVar} is required when ${tokenVar} is provided`)
  }
  
  if (id && !token) {
    errors.push(`${tokenVar} is required when ${idVar} is provided`)
  }
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? true : undefined
  }
}

// Generic sanitizer function
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