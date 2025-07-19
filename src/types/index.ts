// Core Types
export * from "./portfolio"
export * from "./blog"
export * from "./notion"
export * from "./environment"
export * from "./api"
export * from "./components"

// Re-export commonly used types for convenience
export type {
  Project,
  Experience,
  ProjectCategory,
  TechCategory,
  ProficiencyLevel
} from "./portfolio"

export type {
  BlogPost,
  BlogPostPreview,
  BlogConfig,
  BlogMetadata,
  ValidationResult
} from "./blog"

export type {
  NotionPage,
  NotionPropertyValue,
  NotionClientInterface
} from "./notion"

export type {
  EnvironmentConfig,
  EnvironmentVariables,
  EnvironmentValidationResult
} from "./environment"

export type {
  APIResponse,
  APIError,
  HTTPMethod,
  HTTPStatusCode
} from "./api"

export type {
  BaseComponentProps,
  HeaderProps,
  HeroSectionProps,
  ProjectsSectionProps,
  BlogCardProps,
  ButtonProps,
  CursorGlowProps
} from "./components"