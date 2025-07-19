// Core Types
export * from "./portfolioTypes"
export * from "./blogTypes"
export * from "./notionTypes"
export * from "./environmentTypes"
export * from "./apiTypes"
export * from "./componentTypes"
export * from "./projectTypes"

// Re-export commonly used types for convenience
export type {
  Project,
  Experience,
  ProjectCategory,
  TechCategory,
  ProficiencyLevel
} from "./portfolioTypes"

export type {
  BlogPost,
  BlogPostPreview,
  BlogConfig,
  BlogMetadata,
  ValidationResult
} from "./blogTypes"

export type {
  NotionPage,
  NotionPropertyValue,
  NotionClientInterface
} from "./notionTypes"

export type {
  EnvironmentConfig,
  EnvironmentVariables,
  EnvironmentValidationResult
} from "./environmentTypes"

export type {
  APIResponse,
  APIError,
  HTTPMethod,
  HTTPStatusCode
} from "./apiTypes"

export type {
  BaseComponentProps,
  HeaderProps,
  HeroSectionProps,
  ProjectsSectionProps,
  BlogCardProps,
  ButtonProps,
  CursorGlowProps
} from "./componentTypes"

// Project types for convenience
export type {
  NotionProject,
  NotionProjectPreview,
  ProjectValidationResult,
  ProjectCacheEntry,
  ProjectTechStackItem,
  ProjectStatistic,
  ProjectGalleryItem,
  ProjectFeature
} from "./projectTypes"