// Core utility functions for styling and scrolling

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines class names using clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Scroll Utilities ---

// Smoothly scrolls to a target Y position using easeInOutQuart easing
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

// Scrolls smoothly to an element by its ID with optional offset for headers
export function smoothScrollToElement(elementId: string, duration = 800, offset = 90) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    smoothScrollTo(offsetPosition, duration)
  }
}

// Find a Notion heading element by its text content
export function findHeadingByText(text: string): HTMLElement | null {
  const headings = document.querySelectorAll('.notion-h1, .notion-h2, .notion-h3, h1, h2, h3')
  for (const heading of headings) {
    if (heading.textContent?.trim() === text.trim()) {
      return heading as HTMLElement
    }
  }
  return null
}
