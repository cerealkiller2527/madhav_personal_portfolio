/**
 * Core Utility Functions
 * 
 * Common utilities used across the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge.
 * Handles conditional classes and resolves Tailwind conflicts.
 * 
 * @example
 * cn("px-4", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// Scroll Utilities
// ============================================================================

/**
 * Smoothly scrolls to a target Y position using easeInOutQuart easing.
 * 
 * @param targetY - The target scroll position in pixels
 * @param duration - Animation duration in milliseconds (default: 800)
 */
export function smoothScrollTo(targetY: number, duration = 800) {
  const startY = window.pageYOffset
  const distance = targetY - startY
  let startTime: number | null = null

  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  }

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easedProgress = easeInOutQuart(progress)

    window.scrollTo(0, startY + distance * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Scrolls smoothly to an element by its ID.
 * 
 * @param elementId - The ID of the target element
 * @param duration - Animation duration in milliseconds (default: 800)
 * @param offset - Offset from top in pixels for header spacing (default: 90)
 */
export function smoothScrollToElement(elementId: string, duration = 800, offset = 90) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    smoothScrollTo(offsetPosition, duration)
  }
}
