/**
 * Centralized Zod Schema Exports
 * 
 * This is the single source of truth for all type definitions in the application.
 * All schemas are defined using Zod and types are inferred from them.
 */

// ============================================================================
// Common Schemas and Types
// ============================================================================
export {
  // Schemas
  uuidSchema,
  dateStringSchema,
  urlSchema,
  emailSchema,
  nonEmptyStringSchema,
  optionalStringSchema,
  paginationSchema,
  sortOrderSchema,
  dateRangeSchema,
  imageSchema,
  seoMetadataSchema,
  successResponseSchema,
  errorResponseSchema,
  apiResponseSchema,
  
  // Utility Functions
  optionalSchema,
  enumSchema,
  
  // Types
  type UUID,
  type DateString,
  type Pagination,
  type DateRange,
  type Image,
  type SEOMetadata,
  type SuccessResponse,
  type ErrorResponse,
  type APIResponse
} from './common.schemas'

// ============================================================================
// Project Schemas and Types
// ============================================================================
export {
  // Enums and Schemas
  projectCategorySchema,
  techCategorySchema,
  proficiencyLevelSchema,
  statisticSchema,
  galleryItemSchema,
  featureSchema,
  techStackItemSchema,
  projectSchema,
  projectCreateSchema,
  projectUpdateSchema,
  projectFilterSchema,
  projectUIStateSchema,
  
  // Validation Helpers
  validateProject,
  safeValidateProject,
  isValidProject,
  
  // Types
  type TechCategory,
  type ProficiencyLevel,
  type Statistic,
  type GalleryItem,
  type Feature,
  type TechStackItem,
  type Project,
  
  // Enum Values
  ProjectCategory,
  type ProjectCreate,
  type ProjectUpdate,
  type ProjectFilter,
  type ProjectUIState
} from './project.schemas'

// ============================================================================
// Experience Schemas and Types
// ============================================================================
export {
  // Schemas
  experienceSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  experienceFilterSchema,
  
  // Validation Helpers
  validateExperience,
  safeValidateExperience,
  isValidExperience,
  
  // Types
  type Experience,
  type ExperienceCreate,
  type ExperienceUpdate,
  type ExperienceFilter
} from './experience.schemas'

// ============================================================================
// Blog Schemas and Types
// ============================================================================
export {
  // Schemas
  blogContentSchema,
  blogPreviewSchema,
  
  // Types
  type BlogContent,
  type BlogPreview
} from './blog.schemas'

// ============================================================================
// Notion Schemas and Types
// ============================================================================
export {
  // Notion API Schemas
  notionPropertyValueSchema,
  notionPageSchema,
  baseContentSchema,
  
  // Project Content Schemas
  projectContentSchema,
  notionProjectPreviewSchema,
  
  // Validation & Error Schemas
  validationResultSchema,
  notionErrorCodeSchema,
  
  // Configuration Schemas
  notionConfigSchema,
  cacheEntrySchema,
  
  // Types
  type NotionPropertyValue,
  type NotionPage,
  type BaseContent,
  type ProjectContent,
  type NotionProjectPreview,
  type ValidationResult,
  type NotionConfig,
  type CacheEntry,
  
  // Error Class
  NotionError,
  
  // Enum Values (Note: NotionErrorCode as const is exported separately)
  NotionErrorCode
} from './notion.schemas'

// ============================================================================
// API Schemas and Types
// ============================================================================
export {
  // Schemas
  httpMethodSchema,
  httpStatusCodeSchema,
  requestConfigSchema,
  retryConfigSchema,
  apiClientConfigSchema,
  
  // Types
  type HTTPMethod,
  type HTTPStatusCode,
  type RequestConfig,
  type RetryConfig,
  type APIClientConfig,
  
  // Error Classes
  APIClientError,
  NetworkError,
  TimeoutError,
  ValidationError
} from './api.schemas'

// ============================================================================
// Portfolio Schemas and Types
// ============================================================================
export {
  // Resume Schemas
  resumeCategorySchema,
  resumeSchema,
  
  // Personal Info & Social Schemas
  socialPlatformSchema,
  personalInfoSchema,
  socialLinkSchema,
  
  // Theme & Configuration Schemas
  themeTypeSchema,
  themeConfigSchema,
  portfolioConfigSchema,
  
  // Portfolio Data Schemas
  portfolioDataSchema,
  notionPortfolioDataSchema,
  
  // UI State Schemas
  navigationStateSchema,
  animationConfigSchema,
  cursorGlowStateSchema,
  
  // Error Schemas
  portfolioErrorCodeSchema,
  
  // Types
  type ResumeCategory,
  type Resume,
  type SocialPlatform,
  type PersonalInfo,
  type SocialLink,
  type ThemeType,
  type ThemeConfig,
  type PortfolioConfig,
  type PortfolioData,
  type NotionPortfolioData,
  type NavigationState,
  type AnimationConfig,
  type CursorGlowState,
  type PortfolioErrorCode,
  
  // Error Class
  PortfolioError
} from './portfolio.schemas'

// ============================================================================
// Component Schemas and Types
// ============================================================================
export {
  // Base Props
  baseComponentPropsSchema,
  
  // Layout Props
  headerPropsSchema,
  footerPropsSchema,
  sectionPropsSchema,
  
  // Page Section Props
  heroSectionPropsSchema,
  experienceSectionPropsSchema,
  projectsSectionPropsSchema,
  
  // Project Component Props
  projectGridCardPropsSchema,
  projectModalPropsSchema,
  projectMarqueePropsSchema,
  
  // Blog Component Props
  blogCardPropsSchema,
  blogListPropsSchema,
  blogContentPagePropsSchema,
  
  // UI Component Props
  buttonVariantSchema,
  sizeSchema,
  buttonPropsSchema,
  badgeVariantSchema,
  badgePropsSchema,
  loadingSpinnerPropsSchema,
  
  // Dialog Props
  dialogPropsSchema,
  dialogContentPropsSchema,
  dialogHeaderPropsSchema,
  dialogTitlePropsSchema,
  dialogDescriptionPropsSchema,
  
  // Other Component Props
  themeTogglePropsSchema,
  themeProviderPropsSchema,
  resumeModalPropsSchema,
  resumeTypeCardPropsSchema,
  cursorGlowPropsSchema,
  
  // Navigation Props
  navigationItemPropsSchema,
  
  // Form Props
  formFieldPropsSchema,
  inputPropsSchema,
  textareaPropsSchema,
  
  // Animation Props
  animatedCounterPropsSchema,
  fadeInPropsSchema,
  
  // Error Boundary Props
  blogErrorFallbackPropsSchema,
  blogErrorBoundaryPropsSchema,
  
  // Context Schemas
  themeContextTypeSchema,
  errorBoundaryStateSchema,
  
  // Types
  type BaseComponentProps,
  type HeaderProps,
  type FooterProps,
  type SectionProps,
  type HeroSectionProps,
  type ExperienceSectionProps,
  type ProjectsSectionProps,
  type ProjectGridCardProps,
  type ProjectModalProps,
  type ProjectMarqueeProps,
  type BlogCardProps,
  type BlogListProps,
  type BlogContentPageProps,
  type ButtonVariant,
  type Size,
  type ButtonProps,
  type BadgeVariant,
  type BadgeProps,
  type LoadingSpinnerProps,
  type DialogProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type ThemeToggleProps,
  type ThemeProviderProps,
  type ResumeModalProps,
  type ResumeTypeCardProps,
  type CursorGlowProps,
  type NavigationItemProps,
  type FormFieldProps,
  type InputProps,
  type TextareaProps,
  type AnimatedCounterProps,
  type FadeInProps,
  type BlogErrorFallbackProps,
  type BlogErrorBoundaryProps,
  type ThemeContextType,
  type ErrorBoundaryState
} from './component.schemas'

// ============================================================================
// Re-export Type Guards (for backward compatibility)
// ============================================================================
// Note: Type guard functions removed due to compilation order issues
// These can be implemented in individual modules if needed

// Removed isNetworkError function to avoid compilation issues

// Removed additional type guard functions to avoid compilation issues