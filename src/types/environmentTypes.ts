// Environment Variable Types
export interface EnvironmentVariables {
  readonly NODE_ENV: "development" | "production" | "test"
  readonly NEXT_PUBLIC_SITE_URL?: string
  readonly NOTION_TOKEN?: string
  readonly NOTION_DATABASE_ID?: string
  readonly NOTION_PROJECTS_DATABASE_ID?: string
  readonly BLOG_REVALIDATE_TIME?: string
  readonly PROJECTS_REVALIDATE_TIME?: string
  readonly ENABLE_BLOG_CACHE?: string
  readonly ENABLE_PROJECTS_CACHE?: string
  readonly CACHE_MAX_SIZE?: string
  readonly PROJECTS_CACHE_MAX_SIZE?: string
  readonly ANALYTICS_ID?: string
  readonly VERCEL_URL?: string
}

// Environment Configuration
export interface EnvironmentConfig {
  readonly isDevelopment: boolean
  readonly isProduction: boolean
  readonly isTest: boolean
  readonly siteUrl: string
  readonly blog: BlogEnvironmentConfig
  readonly projects: ProjectsEnvironmentConfig
  readonly analytics: AnalyticsConfig
}

export interface BlogEnvironmentConfig {
  readonly notionToken?: string
  readonly notionDatabaseId?: string
  readonly revalidateTime: number
  readonly enableCache: boolean
  readonly cacheMaxSize: number
  readonly isConfigured: boolean
}

export interface ProjectsEnvironmentConfig {
  readonly notionToken?: string
  readonly projectsDatabaseId?: string
  readonly revalidateTime: number
  readonly enableCache: boolean
  readonly cacheMaxSize: number
  readonly isConfigured: boolean
}

export interface AnalyticsConfig {
  readonly id?: string
  readonly enabled: boolean
}

// Environment Validation
export interface EnvironmentValidationResult {
  readonly isValid: boolean
  readonly errors: readonly EnvironmentValidationError[]
  readonly warnings: readonly EnvironmentValidationWarning[]
}

export interface EnvironmentValidationError {
  readonly variable: keyof EnvironmentVariables
  readonly message: string
  readonly severity: "error" | "warning"
}

export interface EnvironmentValidationWarning {
  readonly variable: keyof EnvironmentVariables
  readonly message: string
  readonly impact: string
}

// Environment Error Types
export class EnvironmentError extends Error {
  constructor(
    message: string,
    public readonly code: EnvironmentErrorCode,
    public readonly variable?: keyof EnvironmentVariables
  ) {
    super(message)
    this.name = "EnvironmentError"
  }
}

export enum EnvironmentErrorCode {
  MISSING_REQUIRED_VARIABLE = "MISSING_REQUIRED_VARIABLE",
  INVALID_VARIABLE_FORMAT = "INVALID_VARIABLE_FORMAT",
  CONFIGURATION_CONFLICT = "CONFIGURATION_CONFLICT"
}

// Type Guards
export function isValidNodeEnv(value: string): value is EnvironmentVariables["NODE_ENV"] {
  return ["development", "production", "test"].includes(value)
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isValidNumber(value: string): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

export function isValidBoolean(value: string): boolean {
  return ["true", "false", "1", "0", "yes", "no"].includes(value.toLowerCase())
}