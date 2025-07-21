/**
 * Type Re-exports from Zod Schemas
 * 
 * This file maintains backward compatibility by re-exporting types
 * from the new centralized Zod schema system.
 * 
 * @deprecated Import directly from '@/schemas' instead
 */

// Re-export all types from schemas for backward compatibility
export * from '@/schemas'

// Legacy exports that match the old structure
export type {
  // Portfolio types
  Project,
  Experience,
  ProjectCategory,
  TechCategory,
  ProficiencyLevel,
  Statistic,
  GalleryItem,
  Feature,
  TechStackItem,
  ProjectFilter,
  ExperienceFilter,
  DateRange,
  ProjectUIState,
  NavigationState,
  AnimationConfig,
  CursorGlowState,
  Resume,
  ResumeCategory,
  PortfolioConfig,
  PersonalInfo,
  SocialLink,
  SocialPlatform,
  ThemeConfig,
  PortfolioData,
  NotionPortfolioData,
  PortfolioError,
  PortfolioErrorCode,
  
  // API types
  APIResponse,
  APIError,
  HTTPMethod,
  HTTPStatusCode,
  RequestConfig,
  RetryConfig,
  APIClientConfig,
  APIClientError,
  NetworkError,
  TimeoutError,
  ValidationError as APIValidationError,
  ResponseMetadata,
  
  // Component types
  BaseComponentProps,
  HeaderProps,
  HeroSectionProps,
  ProjectsSectionProps,
  BlogCardProps,
  ButtonProps,
  CursorGlowProps,
  
  // Additional component types
  FooterProps,
  SectionProps,
  ExperienceSectionProps,
  ProjectGridCardProps,
  ProjectModalProps,
  ProjectMarqueeProps,
  BlogListProps,
  BlogContentPageProps,
  BlogErrorBoundaryProps,
  BlogErrorFallbackProps,
  BadgeProps,
  LoadingSpinnerProps,
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  ThemeToggleProps,
  ThemeProviderProps,
  ResumeModalProps,
  ResumeTypeCardProps,
  NavigationItemProps,
  FormFieldProps,
  InputProps,
  TextareaProps,
  AnimatedCounterProps,
  FadeInProps,
  ThemeContextType,
  ErrorBoundaryState,
  
  // Blog types
  BlogContent,
  BlogPreview,
  
  // Notion types
  NotionPropertyValue,
  NotionPage,
  BaseContent,
  ProjectContent,
  ProjectContent as NotionProject, // Alias for backward compatibility
  NotionProjectPreview,
  NotionProjectPreview as ProjectPreview, // Alias for backward compatibility
  ValidationResult,
  NotionErrorCode,
  NotionConfig,
  CacheEntry,
  NotionError
} from '@/schemas'

// Re-export type guards
export {
  isSuccessResponse,
  isErrorResponse,
  isHTTPError,
  isNetworkError,
  isTimeoutError,
  isValidationError,
  isValidProject,
  isValidExperience
} from '@/schemas'

// Map old APIError type to the new error response structure
export type APIError = {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
  readonly stackTrace?: string
}

// Map old ResponseMetadata type
export type ResponseMetadata = {
  readonly timestamp: string
  readonly requestId?: string
  readonly version?: string
  readonly executionTime?: number
}

// Type aliases for backward compatibility
export type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void
export type KeyboardEventHandler<T = Element> = (event: React.KeyboardEvent<T>) => void
export type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void
export type FocusEventHandler<T = Element> = (event: React.FocusEvent<T>) => void

export type RefCallback<T> = (instance: T | null) => void
export type MutableRefObject<T> = React.MutableRefObject<T>
export type RefObject<T> = React.RefObject<T>

export type ReactChildren = React.ReactNode
export type ReactChild = React.ReactElement | string | number
export type ReactFragment = React.ReactFragment
export type ReactPortal = React.ReactPortal

export type FunctionComponent<P = object> = React.FunctionComponent<P>
export type ComponentType<P = object> = React.ComponentType<P>
export type ComponentClass<P = object> = React.ComponentClass<P>

export type HOC<TOwnProps = object, TInjectedProps = object> = (
  component: ComponentType<TOwnProps & TInjectedProps>
) => ComponentType<TOwnProps>

export type RenderProp<T> = (props: T) => React.ReactNode
export type ChildrenRenderProp<T> = (props: T) => React.ReactNode

export interface ErrorInfo {
  readonly componentStack: string
}

