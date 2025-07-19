import { ExtendedRecordMap } from "notion-types"

// Core Blog Types
export interface BlogPost {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description?: string
  readonly publishedAt: string
  readonly updatedAt: string
  readonly tags: readonly string[]
  readonly category?: string
  readonly coverImage?: string
  readonly published: boolean
  readonly recordMap: ExtendedRecordMap
  readonly readingTime?: number
}

export interface BlogPostPreview {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description?: string
  readonly publishedAt: string
  readonly tags: readonly string[]
  readonly category?: string
  readonly coverImage?: string
  readonly readingTime?: number
}

// Configuration Types
export interface BlogConfig {
  readonly revalidateTime: number
  readonly postsPerPage: number
  readonly enableComments: boolean
  readonly cacheConfiguration: CacheConfig
}

export interface CacheConfig {
  readonly postsListTTL: number
  readonly singlePostTTL: number
  readonly sitemapTTL: number
  readonly maxCacheSize: number
}

export interface BlogMetadata {
  readonly title: string
  readonly description: string
  readonly author: string
  readonly siteUrl: string
  readonly ogImage?: string
  readonly favicon?: string
  readonly locale: string
  readonly keywords: readonly string[]
}

// Validation Types
export interface ValidationResult<T = unknown> {
  readonly isValid: boolean
  readonly errors: readonly string[]
  readonly data?: T
}

export interface BlogPostValidationResult extends ValidationResult<BlogPost> {}
export interface BlogPostPreviewValidationResult extends ValidationResult<BlogPostPreview> {}

// Cache Types
export interface CacheEntry<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
  readonly key: string
}

export interface CacheStats {
  readonly size: number
  readonly hitRate: number
  readonly missRate: number
  readonly evictionCount: number
}

// API Response Types
export interface BlogAPIResponse<T = unknown> {
  readonly success: boolean
  readonly data?: T
  readonly error?: BlogAPIError
  readonly timestamp: string
}

export interface BlogPostsResponse extends BlogAPIResponse<readonly BlogPostPreview[]> {
  readonly pagination?: PaginationInfo
}

export interface BlogPostResponse extends BlogAPIResponse<BlogPost> {}

export interface PaginationInfo {
  readonly page: number
  readonly pageSize: number
  readonly totalPages: number
  readonly totalItems: number
  readonly hasNext: boolean
  readonly hasPrevious: boolean
}

// Error Types
export class BlogError extends Error {
  constructor(
    message: string,
    public readonly code: BlogErrorCode,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = "BlogError"
  }
}

export enum BlogErrorCode {
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  NETWORK_ERROR = "NETWORK_ERROR",
  CACHE_ERROR = "CACHE_ERROR",
  TRANSFORM_ERROR = "TRANSFORM_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface BlogAPIError {
  readonly code: BlogErrorCode
  readonly message: string
  readonly details?: Record<string, unknown>
  readonly timestamp: string
}

// Filter and Search Types
export interface BlogFilter {
  readonly tags?: readonly string[]
  readonly category?: string
  readonly published?: boolean
  readonly dateRange?: {
    readonly start: string
    readonly end: string
  }
}

export interface BlogSearchOptions {
  readonly query?: string
  readonly filter?: BlogFilter
  readonly sortBy?: BlogSortField
  readonly sortOrder?: SortOrder
  readonly pagination?: PaginationRequest
}

export enum BlogSortField {
  PUBLISHED_AT = "publishedAt",
  UPDATED_AT = "updatedAt",
  TITLE = "title",
  READING_TIME = "readingTime"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

export interface PaginationRequest {
  readonly page: number
  readonly pageSize: number
}

// Transform Types
export interface BlogPostTransformOptions {
  readonly includeContent?: boolean
  readonly includeMetadata?: boolean
  readonly sanitizeContent?: boolean
  readonly generateReadingTime?: boolean
}

// Environment Types
export interface BlogEnvironmentConfig {
  readonly notionToken?: string
  readonly notionDatabaseId?: string
  readonly revalidateTime?: string
  readonly enableCache?: string
  readonly cacheMaxSize?: string
  readonly isDevelopment: boolean
  readonly isProduction: boolean
}