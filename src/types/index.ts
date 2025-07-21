// Core Types
export * from "./portfolioTypes"
export * from "./apiTypes"
export * from "./componentTypes"
export * from "./notion-unified"

// Re-export commonly used types for convenience
export type {
  Project,
  Experience,
  ProjectCategory,
  TechCategory,
  ProficiencyLevel
} from "./portfolioTypes"



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

