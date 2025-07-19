import {
  EnvironmentVariables,
  EnvironmentConfig,
  EnvironmentValidationResult,
  EnvironmentError,
  EnvironmentErrorCode,
  isValidNodeEnv,
  isValidUrl,
  isValidNumber,
  isValidBoolean
} from "@/types/environment"

// Type-safe environment variable access
class EnvironmentManager {
  private static instance: EnvironmentManager
  private config: EnvironmentConfig | null = null
  private validationResult: EnvironmentValidationResult | null = null

  private constructor() {}

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager()
    }
    return EnvironmentManager.instance
  }

  // Get environment variable with type safety
  getVariable<K extends keyof EnvironmentVariables>(
    key: K,
    defaultValue?: EnvironmentVariables[K]
  ): EnvironmentVariables[K] | undefined {
    const value = process.env[key]
    
    if (value === undefined) {
      return defaultValue
    }

    // Type-specific validation
    switch (key) {
      case "NODE_ENV":
        return isValidNodeEnv(value) ? value as EnvironmentVariables[K] : defaultValue
      default:
        return value as EnvironmentVariables[K]
    }
  }

  // Get required environment variable
  getRequiredVariable<K extends keyof EnvironmentVariables>(
    key: K
  ): NonNullable<EnvironmentVariables[K]> {
    const value = this.getVariable(key)
    
    if (value === undefined || value === null || value === "") {
      throw new EnvironmentError(
        `Required environment variable ${key} is not set`,
        EnvironmentErrorCode.MISSING_REQUIRED_VARIABLE,
        key
      )
    }
    
    return value as NonNullable<EnvironmentVariables[K]>
  }

  // Validate all environment variables
  validateEnvironment(): EnvironmentValidationResult {
    if (this.validationResult) {
      return this.validationResult
    }

    const errors: Array<{
      variable: keyof EnvironmentVariables
      message: string
      severity: "error" | "warning"
    }> = []

    const warnings: Array<{
      variable: keyof EnvironmentVariables
      message: string
      impact: string
    }> = []

    // Validate NODE_ENV
    const nodeEnv = process.env.NODE_ENV
    if (!nodeEnv || !isValidNodeEnv(nodeEnv)) {
      errors.push({
        variable: "NODE_ENV",
        message: "NODE_ENV must be 'development', 'production', or 'test'",
        severity: "error"
      })
    }

    // Validate URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl && !isValidUrl(siteUrl)) {
      errors.push({
        variable: "NEXT_PUBLIC_SITE_URL",
        message: "NEXT_PUBLIC_SITE_URL must be a valid URL",
        severity: "error"
      })
    }

    // Validate blog configuration
    const notionToken = process.env.NOTION_TOKEN
    const notionDatabaseId = process.env.NOTION_DATABASE_ID
    const notionProjectsId = process.env.NOTION_PROJECTS_DATABASE_ID
    
    if (notionToken && !notionDatabaseId) {
      errors.push({
        variable: "NOTION_DATABASE_ID",
        message: "NOTION_DATABASE_ID is required when NOTION_TOKEN is provided",
        severity: "error"
      })
    }

    if (notionDatabaseId && !notionToken) {
      errors.push({
        variable: "NOTION_TOKEN",
        message: "NOTION_TOKEN is required when NOTION_DATABASE_ID is provided",
        severity: "error"
      })
    }

    // Validate projects configuration
    if (notionProjectsId && !notionToken) {
      errors.push({
        variable: "NOTION_TOKEN",
        message: "NOTION_TOKEN is required when NOTION_PROJECTS_DATABASE_ID is provided",
        severity: "error"
      })
    }

    // Validate numeric values
    const revalidateTime = process.env.BLOG_REVALIDATE_TIME
    if (revalidateTime && !isValidNumber(revalidateTime)) {
      errors.push({
        variable: "BLOG_REVALIDATE_TIME",
        message: "BLOG_REVALIDATE_TIME must be a valid number",
        severity: "error"
      })
    }

    const projectsRevalidateTime = process.env.PROJECTS_REVALIDATE_TIME
    if (projectsRevalidateTime && !isValidNumber(projectsRevalidateTime)) {
      errors.push({
        variable: "PROJECTS_REVALIDATE_TIME",
        message: "PROJECTS_REVALIDATE_TIME must be a valid number",
        severity: "error"
      })
    }

    const cacheMaxSize = process.env.CACHE_MAX_SIZE
    if (cacheMaxSize && !isValidNumber(cacheMaxSize)) {
      errors.push({
        variable: "CACHE_MAX_SIZE",
        message: "CACHE_MAX_SIZE must be a valid number",
        severity: "error"
      })
    }

    const projectsCacheMaxSize = process.env.PROJECTS_CACHE_MAX_SIZE
    if (projectsCacheMaxSize && !isValidNumber(projectsCacheMaxSize)) {
      errors.push({
        variable: "PROJECTS_CACHE_MAX_SIZE",
        message: "PROJECTS_CACHE_MAX_SIZE must be a valid number",
        severity: "error"
      })
    }

    // Validate boolean values
    const enableCache = process.env.ENABLE_BLOG_CACHE
    if (enableCache && !isValidBoolean(enableCache)) {
      errors.push({
        variable: "ENABLE_BLOG_CACHE",
        message: "ENABLE_BLOG_CACHE must be a boolean value",
        severity: "error"
      })
    }

    const enableProjectsCache = process.env.ENABLE_PROJECTS_CACHE
    if (enableProjectsCache && !isValidBoolean(enableProjectsCache)) {
      errors.push({
        variable: "ENABLE_PROJECTS_CACHE",
        message: "ENABLE_PROJECTS_CACHE must be a boolean value",
        severity: "error"
      })
    }

    // Add warnings for missing optional variables
    if (!siteUrl) {
      warnings.push({
        variable: "NEXT_PUBLIC_SITE_URL",
        message: "NEXT_PUBLIC_SITE_URL is not set",
        impact: "Absolute URLs may not work correctly"
      })
    }

    if (!notionToken || !notionDatabaseId) {
      warnings.push({
        variable: "NOTION_TOKEN",
        message: "Blog functionality is not configured",
        impact: "Blog features will be disabled"
      })
    }

    this.validationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    }

    return this.validationResult
  }

  // Get typed configuration object
  getConfig(): EnvironmentConfig {
    if (this.config) {
      return this.config
    }

    const validation = this.validateEnvironment()
    if (!validation.isValid) {
      throw new EnvironmentError(
        `Environment validation failed: ${validation.errors.map(e => e.message).join(", ")}`,
        EnvironmentErrorCode.CONFIGURATION_CONFLICT
      )
    }

    const nodeEnv = this.getRequiredVariable("NODE_ENV")
    const siteUrl = this.getVariable("NEXT_PUBLIC_SITE_URL") || 
                   this.getVariable("VERCEL_URL") || 
                   "http://localhost:3000"

    this.config = {
      isDevelopment: nodeEnv === "development",
      isProduction: nodeEnv === "production",
      isTest: nodeEnv === "test",
      siteUrl,
      blog: {
        notionToken: this.getVariable("NOTION_TOKEN"),
        notionDatabaseId: this.getVariable("NOTION_DATABASE_ID"),
        revalidateTime: Number(this.getVariable("BLOG_REVALIDATE_TIME", "60")),
        enableCache: this.parseBoolean(this.getVariable("ENABLE_BLOG_CACHE", "true")),
        cacheMaxSize: Number(this.getVariable("CACHE_MAX_SIZE", "100")),
        isConfigured: !!(this.getVariable("NOTION_TOKEN") && this.getVariable("NOTION_DATABASE_ID"))
      },
      projects: {
        notionToken: this.getVariable("NOTION_TOKEN"),
        projectsDatabaseId: this.getVariable("NOTION_PROJECTS_DATABASE_ID"),
        revalidateTime: Number(this.getVariable("PROJECTS_REVALIDATE_TIME", "60")),
        enableCache: this.parseBoolean(this.getVariable("ENABLE_PROJECTS_CACHE", "true")),
        cacheMaxSize: Number(this.getVariable("PROJECTS_CACHE_MAX_SIZE", "50")),
        isConfigured: !!(this.getVariable("NOTION_TOKEN") && this.getVariable("NOTION_PROJECTS_DATABASE_ID"))
      },
      analytics: {
        id: this.getVariable("ANALYTICS_ID"),
        enabled: !!this.getVariable("ANALYTICS_ID")
      }
    }

    return this.config
  }

  private parseBoolean(value: string): boolean {
    return ["true", "1", "yes"].includes(value.toLowerCase())
  }

  // Reset cached values (useful for testing)
  reset(): void {
    this.config = null
    this.validationResult = null
  }
}

// Export singleton instance
export const environmentManager = EnvironmentManager.getInstance()

// Convenience functions
export function getEnvironmentConfig(): EnvironmentConfig {
  return environmentManager.getConfig()
}

export function validateEnvironment(): EnvironmentValidationResult {
  return environmentManager.validateEnvironment()
}

export function getEnvironmentVariable<K extends keyof EnvironmentVariables>(
  key: K,
  defaultValue?: EnvironmentVariables[K]
): EnvironmentVariables[K] | undefined {
  return environmentManager.getVariable(key, defaultValue)
}

export function getRequiredEnvironmentVariable<K extends keyof EnvironmentVariables>(
  key: K
): NonNullable<EnvironmentVariables[K]> {
  return environmentManager.getRequiredVariable(key)
}