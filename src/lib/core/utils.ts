import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Enhanced smooth scroll with better easing and performance
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

// Smooth scroll to element with consistent behavior
export function smoothScrollToElement(elementId: string, duration = 800, offset = 90) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    smoothScrollTo(offsetPosition, duration)
  }
}
