import { z } from 'zod'
import { projectSchema } from './project.schemas'
import { experienceSchema } from './experience.schemas'
import { emailSchema, urlSchema } from './common.schemas'
import { notionProjectPreviewSchema } from './notion.schemas'

// ============================================================================
// Resume Types
// ============================================================================

/**
 * Resume category enum
 */
export const resumeCategorySchema = z.enum(['software', 'robotics', 'mechanical', 'electrical'])
export type ResumeCategory = z.infer<typeof resumeCategorySchema>

/**
 * Resume schema
 */
export const resumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.any(), // React.ReactNode
  filePath: z.string(),
  downloadName: z.string(),
  category: resumeCategorySchema
})
export type Resume = z.infer<typeof resumeSchema>

// ============================================================================
// Personal Info & Social Links
// ============================================================================

/**
 * Social platform enum
 */
export const socialPlatformSchema = z.enum(['linkedin', 'github', 'twitter', 'email', 'website'])
export type SocialPlatform = z.infer<typeof socialPlatformSchema>

/**
 * Personal info schema
 */
export const personalInfoSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  email: emailSchema,
  location: z.string(),
  avatar: z.string(),
  tagline: z.string()
})
export type PersonalInfo = z.infer<typeof personalInfoSchema>

/**
 * Social link schema
 */
export const socialLinkSchema = z.object({
  platform: socialPlatformSchema,
  url: urlSchema,
  username: z.string().optional(),
  icon: z.any() // React.ReactNode
})
export type SocialLink = z.infer<typeof socialLinkSchema>

// ============================================================================
// Theme & Configuration
// ============================================================================

/**
 * Theme type schema
 */
export const themeTypeSchema = z.enum(['light', 'dark', 'system'])
export type ThemeType = z.infer<typeof themeTypeSchema>

/**
 * Theme configuration schema
 */
export const themeConfigSchema = z.object({
  defaultTheme: themeTypeSchema,
  colors: z.record(z.string()),
  fonts: z.record(z.string())
})
export type ThemeConfig = z.infer<typeof themeConfigSchema>

/**
 * Portfolio configuration schema
 */
export const portfolioConfigSchema = z.object({
  personalInfo: personalInfoSchema,
  socialLinks: z.array(socialLinkSchema),
  resumeTypes: z.array(resumeSchema),
  theme: themeConfigSchema
})
export type PortfolioConfig = z.infer<typeof portfolioConfigSchema>

// ============================================================================
// Portfolio Data
// ============================================================================

/**
 * Portfolio data schema (standard projects)
 */
export const portfolioDataSchema = z.object({
  projects: z.array(projectSchema),
  experiences: z.array(experienceSchema),
  personalInfo: personalInfoSchema,
  socialLinks: z.array(socialLinkSchema)
})
export type PortfolioData = z.infer<typeof portfolioDataSchema>

/**
 * Notion portfolio data schema (Notion-based projects)
 */
export const notionPortfolioDataSchema = z.object({
  projects: z.array(notionProjectPreviewSchema),
  experiences: z.array(experienceSchema),
  personalInfo: personalInfoSchema,
  socialLinks: z.array(socialLinkSchema)
})
export type NotionPortfolioData = z.infer<typeof notionPortfolioDataSchema>

// ============================================================================
// UI State Schemas
// ============================================================================

/**
 * Navigation state schema
 */
export const navigationStateSchema = z.object({
  activeSection: z.string(),
  isMenuOpen: z.boolean(),
  isScrolled: z.boolean()
})
export type NavigationState = z.infer<typeof navigationStateSchema>

/**
 * Animation configuration schema
 */
export const animationConfigSchema = z.object({
  duration: z.number(),
  delay: z.number().optional(),
  easing: z.string().optional(),
  stagger: z.number().optional()
})
export type AnimationConfig = z.infer<typeof animationConfigSchema>

/**
 * Cursor glow state schema
 */
export const cursorGlowStateSchema = z.object({
  isVisible: z.boolean(),
  mouseX: z.number(),
  mouseY: z.number(),
  size: z.number(),
  opacity: z.number()
})
export type CursorGlowState = z.infer<typeof cursorGlowStateSchema>

// ============================================================================
// Error Types
// ============================================================================

/**
 * Portfolio error codes
 */
export const portfolioErrorCodeSchema = z.enum([
  'DATA_LOADING_ERROR',
  'VALIDATION_ERROR',
  'CONFIGURATION_ERROR'
])
export type PortfolioErrorCode = z.infer<typeof portfolioErrorCodeSchema>

/**
 * Portfolio error class (kept for compatibility)
 */
export class PortfolioError extends Error {
  constructor(
    message: string,
    public readonly code: PortfolioErrorCode,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'PortfolioError'
  }
}