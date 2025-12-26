/**
 * Component Prop Schemas
 * 
 * Only includes schemas for props that are shared across multiple components.
 * Simple component props should use inline TypeScript interfaces.
 */

import { z } from 'zod'
import { projectSchema } from './project.schemas'
import { experienceSchema } from './experience.schemas'

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
