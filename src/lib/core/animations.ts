/**
 * Animation Constants
 * 
 * Centralized animation configuration for Framer Motion.
 * Provides consistent timing and easing across the application.
 */

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Standard easing curve for smooth animations
 * Equivalent to CSS ease-out
 */
export const EASE_OUT = [0.4, 0.0, 0.2, 1.0] as const

/**
 * Easing for entrance animations
 */
export const EASE_IN_OUT = [0.4, 0.0, 0.2, 1.0] as const

// ============================================================================
// Duration Constants
// ============================================================================

export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.6,
  page: 0.8,
} as const

// ============================================================================
// Common Animation Variants
// ============================================================================

/**
 * Fade in from below - standard entrance animation
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT }
  }
}

/**
 * Fade in from left
 */
export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT }
  }
}

/**
 * Simple fade in
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT }
  }
}

/**
 * Container with staggered children
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

/**
 * List with staggered items
 */
export const staggerList = {
  visible: { transition: { staggerChildren: 0.07 } },
  hidden: {}
}

/**
 * Letter-by-letter text animation
 */
export const letterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT }
  }
}

// ============================================================================
// Spring Configurations
// ============================================================================

export const SPRING = {
  gentle: { type: "spring", stiffness: 300, damping: 20 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 },
  stiff: { type: "spring", stiffness: 400, damping: 25 },
} as const
