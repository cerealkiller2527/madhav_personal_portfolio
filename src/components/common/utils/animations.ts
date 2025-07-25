// Centralized animation configs for consistent motion design

import type { Variants } from "framer-motion"

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  fadeIn: 1.0
} as const

export const ANIMATION_EASINGS = {
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  bounce: [0.6, 0.05, 0.01, 0.9],
  spring: { type: "spring", stiffness: 100, damping: 15 }
} as const

export const TRANSITIONS = {
  fadeIn: {
    duration: ANIMATION_DURATIONS.fadeIn,
    ease: ANIMATION_EASINGS.easeOut
  },
  slideUp: {
    duration: ANIMATION_DURATIONS.slow,
    ease: ANIMATION_EASINGS.easeOut
  },
  bounce: {
    duration: ANIMATION_DURATIONS.normal,
    ease: ANIMATION_EASINGS.bounce
  },
  spring: ANIMATION_EASINGS.spring
} as const

export const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: TRANSITIONS.fadeIn
  }
}

export const SLIDE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: TRANSITIONS.slideUp
  }
}

export const SLIDE_DOWN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: TRANSITIONS.slideUp
  }
}

export const SCALE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: TRANSITIONS.spring
  }
}

export const STAGGER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.2
} as const

export const MOTION_PROPS = {
  fadeIn: {
    initial: "hidden",
    whileInView: "visible",
    viewport: VIEWPORT_CONFIG,
    variants: FADE_IN_VARIANTS
  },
  slideUp: {
    initial: "hidden",
    whileInView: "visible", 
    viewport: VIEWPORT_CONFIG,
    variants: SLIDE_UP_VARIANTS
  },
  slideDown: {
    initial: "hidden",
    whileInView: "visible",
    viewport: VIEWPORT_CONFIG,
    variants: SLIDE_DOWN_VARIANTS
  },
  scale: {
    initial: "hidden",
    whileInView: "visible",
    viewport: VIEWPORT_CONFIG,
    variants: SCALE_VARIANTS
  },
  stagger: {
    initial: "hidden",
    whileInView: "visible",
    viewport: VIEWPORT_CONFIG,
    variants: STAGGER_VARIANTS
  }
} as const

export const HOVER_ANIMATIONS = {
  lift: {
    whileHover: { y: -4, transition: TRANSITIONS.bounce },
    whileTap: { scale: 0.98 }
  },
  scale: {
    whileHover: { scale: 1.05, transition: TRANSITIONS.spring },
    whileTap: { scale: 0.95 }
  },
  glow: {
    whileHover: { 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
      transition: TRANSITIONS.fadeIn
    }
  }
} as const

export const LOADING_ANIMATIONS = {
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
  fadeIn: "animate-fade-in"
} as const

export const ANIMATION_CLASSES = {
  ...LOADING_ANIMATIONS,
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  zoomIn: "animate-zoom-in",
  zoomOut: "animate-zoom-out"
} as const