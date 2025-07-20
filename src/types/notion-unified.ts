import { ExtendedRecordMap } from "notion-types"

// =============================================================================
// UNIFIED NOTION TYPES
// =============================================================================

export interface NotionPropertyValue {
  id: string
  type: "title" | "rich_text" | "date" | "checkbox" | "select" | "multi_select" | "files" | "url"
  title?: Array<{ plain_text: string }>
  rich_text?: Array<{ plain_text: string }>
  date?: { start: string } | null
  checkbox?: boolean
  select?: { name: string } | null
  multi_select?: Array<{ name: string }>
  files?: Array<{
    file?: { url: string }
    external?: { url: string }
  }>
  url?: string | null
}

export interface NotionPage {
  object: "page"
  id: string
  created_time: string
  last_edited_time: string
  cover?: {
    type: "external" | "file"
    external?: { url: string }
    file?: { url: string }
  } | null
  archived: boolean
  properties: Record<string, NotionPropertyValue>
  url: string
}

// =============================================================================
// UNIFIED CONTENT TYPES
// =============================================================================

export interface BaseContent {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description?: string
  readonly publishedAt: string
  readonly updatedAt: string
  readonly tags: readonly string[]
  readonly coverImage?: string
  readonly published: boolean
}

export interface BlogContent extends BaseContent {
  readonly category?: string
  readonly readingTime?: number
  readonly recordMap?: ExtendedRecordMap
}

export interface ProjectContent extends BaseContent {
  readonly subtitle: string
  readonly category: ProjectCategory
  readonly award?: string
  readonly awardRank?: string
  readonly stats: readonly ProjectStatistic[]
  readonly liveLink?: string
  readonly githubLink?: string
  readonly heroImage?: string
  readonly vectaryEmbedUrl?: string
  readonly gallery: readonly ProjectGalleryItem[]
  readonly keyFeatures: readonly ProjectFeature[]
  readonly techStack: readonly ProjectTechStackItem[]
  readonly recordMap?: ExtendedRecordMap
}

// =============================================================================
// PROJECT-SPECIFIC TYPES
// =============================================================================

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
}

// =============================================================================
// PREVIEW TYPES (for listings)
// =============================================================================

export type BlogPreview = Omit<BlogContent, "recordMap">
export type ProjectPreview = Omit<ProjectContent, "recordMap" | "gallery" | "keyFeatures" | "techStack">

// =============================================================================
// VALIDATION & ERROR TYPES
// =============================================================================

export interface ValidationResult<T = unknown> {
  readonly isValid: boolean
  readonly errors: readonly string[]
  readonly data?: T
}

export enum NotionErrorCode {
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  NETWORK_ERROR = "NETWORK_ERROR",
  CACHE_ERROR = "CACHE_ERROR",
  TRANSFORM_ERROR = "TRANSFORM_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export class NotionError extends Error {
  constructor(
    message: string,
    public readonly code: NotionErrorCode,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = "NotionError"
  }
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface NotionConfig {
  readonly token?: string
  readonly blogDatabaseId?: string
  readonly projectsDatabaseId?: string
  readonly revalidateTime: number
  readonly enableCache: boolean
  readonly cacheMaxSize: number
}

export interface CacheEntry<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
  readonly key: string
}