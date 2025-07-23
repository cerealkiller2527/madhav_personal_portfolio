import { z } from 'zod'
import { projectSchema } from './project.schemas'
import { experienceSchema } from './experience.schemas'
import { blogPreviewSchema, blogContentSchema } from './blog.schemas'

// ============================================================================
// Base Component Props
// ============================================================================

/**
 * Base component props schema
 */
export const baseComponentPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any().optional(), // React.ReactNode
  id: z.string().optional()
})
export type BaseComponentProps = z.infer<typeof baseComponentPropsSchema>

// ============================================================================
// Layout Component Props
// ============================================================================

/**
 * Header props schema
 */
export const headerPropsSchema = z.object({
  onResumeOpen: z.function().args().returns(z.void())
})
export type HeaderProps = z.infer<typeof headerPropsSchema>

/**
 * Footer props schema - extends base props
 */
export const footerPropsSchema = baseComponentPropsSchema
export type FooterProps = z.infer<typeof footerPropsSchema>

/**
 * Section props schema
 */
export const sectionPropsSchema = baseComponentPropsSchema.extend({
  title: z.string().optional(),
  hasBackground: z.boolean().optional()
})
export type SectionProps = z.infer<typeof sectionPropsSchema>

// ============================================================================
// Page Section Props
// ============================================================================

/**
 * Hero section props schema
 */
export const heroSectionPropsSchema = z.object({
  projects: z.array(projectSchema).readonly(),
  onHoverChange: z.function().args(z.boolean()).returns(z.void()),
  onProjectSelect: z.function().args(z.string()).returns(z.void())
})
export type HeroSectionProps = z.infer<typeof heroSectionPropsSchema>

/**
 * Experience section props schema
 */
export const experienceSectionPropsSchema = z.object({
  experiences: z.array(experienceSchema).readonly()
})
export type ExperienceSectionProps = z.infer<typeof experienceSectionPropsSchema>

/**
 * Projects section props schema
 */
export const projectsSectionPropsSchema = z.object({
  projects: z.array(projectSchema).readonly(),
  onProjectSelect: z.function().args(projectSchema).returns(z.void()),
  bounceProjectId: z.string().nullable(),
  onBounceComplete: z.function().args().returns(z.void())
})
export type ProjectsSectionProps = z.infer<typeof projectsSectionPropsSchema>

// ============================================================================
// Project Component Props
// ============================================================================

/**
 * Project grid card props schema
 */
export const projectGridCardPropsSchema = z.object({
  project: projectSchema,
  onSelect: z.function().args(projectSchema).returns(z.void()),
  shouldBounce: z.boolean().optional(),
  onBounceComplete: z.function().args().returns(z.void()).optional()
})
export type ProjectGridCardProps = z.infer<typeof projectGridCardPropsSchema>

/**
 * Project modal props schema
 */
export const projectModalPropsSchema = z.object({
  project: projectSchema.nullable(),
  onClose: z.function().args().returns(z.void())
})
export type ProjectModalProps = z.infer<typeof projectModalPropsSchema>

/**
 * Project marquee props schema
 */
export const projectMarqueePropsSchema = z.object({
  projects: z.array(projectSchema),
  onProjectSelect: z.function().args(z.string()).returns(z.void())
})
export type ProjectMarqueeProps = z.infer<typeof projectMarqueePropsSchema>

// ============================================================================
// Blog Component Props
// ============================================================================

/**
 * Blog card props schema
 */
export const blogCardPropsSchema = z.object({
  post: blogPreviewSchema
})
export type BlogCardProps = z.infer<typeof blogCardPropsSchema>

/**
 * Blog list props schema
 */
export const blogListPropsSchema = z.object({
  posts: z.array(blogPreviewSchema),
  loading: z.boolean().optional(),
  error: z.string().optional()
})
export type BlogListProps = z.infer<typeof blogListPropsSchema>

/**
 * Blog content page props schema
 */
export const blogContentPagePropsSchema = z.object({
  post: blogContentSchema
})
export type BlogContentPageProps = z.infer<typeof blogContentPagePropsSchema>

// ============================================================================
// UI Component Props
// ============================================================================

/**
 * Button variant schema
 */
export const buttonVariantSchema = z.enum(['default', 'outline', 'ghost', 'destructive'])
export type ButtonVariant = z.infer<typeof buttonVariantSchema>

/**
 * Size schema
 */
export const sizeSchema = z.enum(['sm', 'md', 'lg'])
export type Size = z.infer<typeof sizeSchema>

/**
 * Button props schema
 */
export const buttonPropsSchema = z.object({
  variant: buttonVariantSchema.optional(),
  size: sizeSchema.optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  children: z.any(), // React.ReactNode
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  className: z.string().optional(),
  asChild: z.boolean().optional()
})
export type ButtonProps = z.infer<typeof buttonPropsSchema>

/**
 * Badge variant schema
 */
export const badgeVariantSchema = z.enum(['default', 'secondary', 'outline', 'destructive'])
export type BadgeVariant = z.infer<typeof badgeVariantSchema>

/**
 * Badge props schema
 */
export const badgePropsSchema = z.object({
  variant: badgeVariantSchema.optional(),
  children: z.any(), // React.ReactNode
  className: z.string().optional()
})
export type BadgeProps = z.infer<typeof badgePropsSchema>

/**
 * Loading spinner props schema
 */
export const loadingSpinnerPropsSchema = z.object({
  size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
  className: z.string().optional(),
  showText: z.boolean().optional(),
  text: z.string().optional()
})
export type LoadingSpinnerProps = z.infer<typeof loadingSpinnerPropsSchema>

// ============================================================================
// Dialog Component Props
// ============================================================================

/**
 * Dialog props schema
 */
export const dialogPropsSchema = z.object({
  open: z.boolean(),
  onOpenChange: z.function().args(z.boolean()).returns(z.void()),
  children: z.any() // React.ReactNode
})
export type DialogProps = z.infer<typeof dialogPropsSchema>

/**
 * Dialog content props schema
 */
export const dialogContentPropsSchema = baseComponentPropsSchema.extend({
  onEscapeKeyDown: z.function().args(z.any()).returns(z.void()).optional(),
  onPointerDownOutside: z.function().args(z.any()).returns(z.void()).optional()
})
export type DialogContentProps = z.infer<typeof dialogContentPropsSchema>

/**
 * Dialog header props schema - extends base props
 */
export const dialogHeaderPropsSchema = baseComponentPropsSchema
export type DialogHeaderProps = z.infer<typeof dialogHeaderPropsSchema>

/**
 * Dialog title props schema - extends base props
 */
export const dialogTitlePropsSchema = baseComponentPropsSchema
export type DialogTitleProps = z.infer<typeof dialogTitlePropsSchema>

/**
 * Dialog description props schema - extends base props
 */
export const dialogDescriptionPropsSchema = baseComponentPropsSchema
export type DialogDescriptionProps = z.infer<typeof dialogDescriptionPropsSchema>

// ============================================================================
// Other Component Props
// ============================================================================

/**
 * Theme toggle props schema
 */
export const themeTogglePropsSchema = z.object({
  className: z.string().optional()
})
export type ThemeToggleProps = z.infer<typeof themeTogglePropsSchema>

/**
 * Theme provider props schema
 */
export const themeProviderPropsSchema = z.object({
  children: z.any(), // React.ReactNode
  defaultTheme: z.enum(['light', 'dark', 'system']).optional(),
  storageKey: z.string().optional(),
  attribute: z.string().optional(),
  enableSystem: z.boolean().optional(),
  disableTransitionOnChange: z.boolean().optional()
})
export type ThemeProviderProps = z.infer<typeof themeProviderPropsSchema>

/**
 * Resume modal props schema
 */
export const resumeModalPropsSchema = z.object({
  isOpen: z.boolean(),
  onClose: z.function().args().returns(z.void())
})
export type ResumeModalProps = z.infer<typeof resumeModalPropsSchema>

/**
 * Resume type card props schema
 */
export const resumeTypeCardPropsSchema = z.object({
  resume: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.any() // React.ReactNode
  }),
  isActive: z.boolean(),
  onSelect: z.function().args(z.string()).returns(z.void())
})
export type ResumeTypeCardProps = z.infer<typeof resumeTypeCardPropsSchema>

/**
 * Cursor glow props schema
 */
export const cursorGlowPropsSchema = z.object({
  isVisible: z.boolean()
})
export type CursorGlowProps = z.infer<typeof cursorGlowPropsSchema>

// ============================================================================
// Navigation Props
// ============================================================================

/**
 * Navigation item props schema
 */
export const navigationItemPropsSchema = z.object({
  href: z.string(),
  children: z.any(), // React.ReactNode
  isActive: z.boolean().optional(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
  className: z.string().optional()
})
export type NavigationItemProps = z.infer<typeof navigationItemPropsSchema>

// ============================================================================
// Form Component Props
// ============================================================================

/**
 * Form field props schema
 */
export const formFieldPropsSchema = z.object({
  name: z.string(),
  label: z.string(),
  error: z.string().optional(),
  required: z.boolean().optional(),
  className: z.string().optional()
})
export type FormFieldProps = z.infer<typeof formFieldPropsSchema>

/**
 * Input props schema
 */
export const inputPropsSchema = formFieldPropsSchema.extend({
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).optional(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  onChange: z.function().args(z.any()).returns(z.void()).optional(),
  disabled: z.boolean().optional()
})
export type InputProps = z.infer<typeof inputPropsSchema>

/**
 * Textarea props schema
 */
export const textareaPropsSchema = formFieldPropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
  onChange: z.function().args(z.any()).returns(z.void()).optional(),
  rows: z.number().optional(),
  disabled: z.boolean().optional()
})
export type TextareaProps = z.infer<typeof textareaPropsSchema>

// ============================================================================
// Animation Component Props
// ============================================================================

/**
 * Animated counter props schema
 */
export const animatedCounterPropsSchema = z.object({
  value: z.number(),
  duration: z.number().optional(),
  className: z.string().optional()
})
export type AnimatedCounterProps = z.infer<typeof animatedCounterPropsSchema>

/**
 * Fade in props schema
 */
export const fadeInPropsSchema = baseComponentPropsSchema.extend({
  delay: z.number().optional(),
  duration: z.number().optional(),
  direction: z.enum(['up', 'down', 'left', 'right']).optional()
})
export type FadeInProps = z.infer<typeof fadeInPropsSchema>

// ============================================================================
// Error Boundary Props
// ============================================================================

/**
 * Blog error boundary props schema
 */
export const blogErrorBoundaryPropsSchema = z.object({
  children: z.any() // React.ReactNode
})
export type BlogErrorBoundaryProps = z.infer<typeof blogErrorBoundaryPropsSchema>

// ============================================================================
// Context Types
// ============================================================================

/**
 * Theme context type schema
 */
export const themeContextTypeSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  setTheme: z.function().args(z.enum(['light', 'dark', 'system'])).returns(z.void()),
  resolvedTheme: z.enum(['light', 'dark'])
})
export type ThemeContextType = z.infer<typeof themeContextTypeSchema>

/**
 * Error boundary state schema
 */
export const errorBoundaryStateSchema = z.object({
  hasError: z.boolean(),
  error: z.instanceof(Error).optional()
})
export type ErrorBoundaryState = z.infer<typeof errorBoundaryStateSchema>