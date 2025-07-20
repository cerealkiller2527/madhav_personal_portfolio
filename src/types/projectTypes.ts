import { ExtendedRecordMap } from "notion-types"

// Core Project Types (Notion-enhanced)
export interface NotionProject {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly category: ProjectCategory
  readonly award?: string
  readonly awardRank?: string
  readonly stats: readonly ProjectStatistic[]
  readonly tags: readonly string[]
  readonly liveLink?: string
  readonly githubLink?: string
  readonly heroImage?: string
  readonly vectaryEmbedUrl?: string
  readonly gallery: readonly ProjectGalleryItem[]
  readonly keyFeatures: readonly ProjectFeature[]
  readonly techStack: readonly ProjectTechStackItem[]
  readonly published: boolean
  readonly publishedAt: string
  readonly updatedAt: string
  readonly recordMap: ExtendedRecordMap
}

export interface NotionProjectPreview {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly category: ProjectCategory
  readonly award?: string
  readonly awardRank?: string
  readonly stats: readonly ProjectStatistic[]
  readonly tags: readonly string[]
  readonly liveLink?: string
  readonly githubLink?: string
  readonly heroImage?: string
  readonly vectaryEmbedUrl?: string
  readonly published: boolean
  readonly publishedAt: string
}

export interface ProjectStatistic {
  readonly value: string
  readonly label: string
}

export interface ProjectGalleryItem {
  readonly url: string
  readonly caption: string
  readonly alt?: string
  readonly width?: number
  readonly height?: number
}

export interface ProjectFeature {
  readonly title: string
  readonly description: string
  readonly icon?: string
}

export interface ProjectTechStackItem {
  readonly name: string
  readonly category: TechCategory
  readonly icon?: string
  readonly proficiency?: ProficiencyLevel
}

// Enums
export enum ProjectCategory {
  SOFTWARE = "Software",
  HARDWARE = "Hardware", 
  HYBRID = "Hybrid"
}

export enum TechCategory {
  SOFTWARE = "Software",
  MOBILE = "Mobile",
  DATABASE = "Database",
  AI_ML = "AI/ML",
  DESIGN = "Design",
  FABRICATION = "Fabrication",
  HARDWARE = "Hardware"
}

export enum ProficiencyLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate", 
  ADVANCED = "Advanced",
  EXPERT = "Expert"
}

// Configuration Types
export interface ProjectConfig {
  readonly revalidateTime: number
  readonly enableComments: boolean
  readonly cacheConfiguration: ProjectCacheConfig
}

export interface ProjectCacheConfig {
  readonly projectsListTTL: number
  readonly singleProjectTTL: number
  readonly maxCacheSize: number
}

// Validation Types
export interface ProjectValidationResult<T = unknown> {
  readonly isValid: boolean
  readonly errors: readonly string[]
  readonly data?: T
}

export interface NotionProjectValidationResult extends ProjectValidationResult<NotionProject> {}
export interface NotionProjectPreviewValidationResult extends ProjectValidationResult<NotionProjectPreview> {}

// Cache Types
export interface ProjectCacheEntry<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
  readonly key: string
}

export interface ProjectCacheStats {
  readonly size: number
  readonly hitRate: number
  readonly missRate: number
  readonly evictionCount: number
}

// API Response Types
export interface ProjectAPIResponse<T = unknown> {
  readonly success: boolean
  readonly data?: T
  readonly error?: ProjectAPIError
  readonly timestamp: string
}

export interface ProjectsResponse extends ProjectAPIResponse<readonly NotionProjectPreview[]> {}
export interface SingleProjectResponse extends ProjectAPIResponse<NotionProject> {}

// Error Types
export class ProjectError extends Error {
  constructor(
    message: string,
    public readonly code: ProjectErrorCode,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = "ProjectError"
  }
}

export enum ProjectErrorCode {
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR", 
  NOT_FOUND = "NOT_FOUND",
  NETWORK_ERROR = "NETWORK_ERROR",
  CACHE_ERROR = "CACHE_ERROR",
  TRANSFORM_ERROR = "TRANSFORM_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface ProjectAPIError {
  readonly code: ProjectErrorCode
  readonly message: string
  readonly details?: Record<string, unknown>
  readonly timestamp: string
}

// Filter and Search Types
export interface ProjectFilter {
  readonly category?: ProjectCategory
  readonly tags?: readonly string[]
  readonly published?: boolean
  readonly hasLiveLink?: boolean
  readonly hasGithubLink?: boolean
}

export interface ProjectSearchOptions {
  readonly query?: string
  readonly filter?: ProjectFilter
  readonly sortBy?: ProjectSortField
  readonly sortOrder?: SortOrder
}

export enum ProjectSortField {
  PUBLISHED_AT = "publishedAt",
  UPDATED_AT = "updatedAt", 
  TITLE = "title",
  CATEGORY = "category"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

// Transform Types
export interface ProjectTransformOptions {
  readonly includeContent?: boolean
  readonly includeMetadata?: boolean
  readonly sanitizeContent?: boolean
  readonly generateSlug?: boolean
}

// Environment Types
export interface ProjectEnvironmentConfig {
  readonly notionToken?: string
  readonly projectsDatabaseId?: string
  readonly revalidateTime?: string
  readonly enableCache?: string
  readonly cacheMaxSize?: string
  readonly isDevelopment: boolean
  readonly isProduction: boolean
}

// Data Loading Types
export interface ProjectsData {
  readonly projects: readonly NotionProjectPreview[]
  readonly totalCount: number
  readonly lastUpdated: string
}

// Legacy compatibility for existing components
export interface LegacyProject {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly category: ProjectCategory
  readonly award?: string
  readonly stats?: readonly ProjectStatistic[]
  readonly tags: readonly string[]
  readonly liveLink?: string
  readonly githubLink?: string
  readonly heroImage: string
  readonly vectaryEmbedUrl?: string
  readonly gallery: readonly ProjectGalleryItem[]
  readonly detailedDescription: string
  readonly keyFeatures: readonly ProjectFeature[]
  readonly techStack: readonly ProjectTechStackItem[]
}

// Type conversion utilities
export type ProjectForUI = NotionProjectPreview & {
  readonly detailedDescription?: string
}

export type ProjectWithContent = NotionProject & {
  readonly detailedDescription?: string
}