"use client"
import { useEffect, useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface CursorGlowProps {
  readonly isVisible: boolean
}

interface CursorPosition {
  readonly x: number
  readonly y: number
  readonly time: number
}


// Constants
const SPRING_CONFIGS = {
  position: { stiffness: 200, damping: 50, mass: 1 } as const,
  size: { stiffness: 200, damping: 30, mass: 0.5 } as const,
  opacity: { stiffness: 100, damping: 30, mass: 0.8 } as const
} as const

const ANIMATION_CONFIG = {
  baseSize: 300,
  sizeMultiplier: 160,
  maxSize: 3000,
  resetDelay: 2500,
  fadeDelay: 300,
  visibleOpacity: 0.8
} as const

export const CursorGlow: React.FC<CursorGlowProps> = ({ isVisible }) => {
  // Motion values for position
  const mouseX = useMotionValue<number>(-1000)
  const mouseY = useMotionValue<number>(-1000)
  const smoothX = useSpring(mouseX.get(), SPRING_CONFIGS.position)
  const smoothY = useSpring(mouseY.get(), SPRING_CONFIGS.position)

  // Motion values for size
  const size = useMotionValue<number>(ANIMATION_CONFIG.baseSize)
  const smoothSize = useSpring(ANIMATION_CONFIG.baseSize, SPRING_CONFIGS.size)

  // Motion values for opacity
  const opacity = useMotionValue<number>(0)
  const smoothOpacity = useSpring(0, SPRING_CONFIGS.opacity)

  // Refs for tracking and cleanup
  const lastPosRef = useRef<CursorPosition>({ x: 0, y: 0, time: 0 })
  const sizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const opacityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function for timeouts
  const cleanup = useCallback(() => {
    if (sizeTimeoutRef.current) {
      clearTimeout(sizeTimeoutRef.current)
      sizeTimeoutRef.current = null
    }
    if (opacityTimeoutRef.current) {
      clearTimeout(opacityTimeoutRef.current)
      opacityTimeoutRef.current = null
    }
  }, [])

  // Calculate cursor speed and update size
  const updateCursorEffect = useCallback((clientX: number, clientY: number) => {
    const now = performance.now()
    const lastPos = lastPosRef.current

    // Update position
    mouseX.set(clientX)
    mouseY.set(clientY)
    smoothX.set(clientX)
    smoothY.set(clientY)

    // Calculate speed-based size
    if (lastPos.time > 0) {
      const dt = now - lastPos.time
      if (dt > 0) {
        const dx = clientX - lastPos.x
        const dy = clientY - lastPos.y
        const speed = Math.sqrt(dx * dx + dy * dy) / dt

        // Logarithmic scaling for controlled growth
        const speedFactor = Math.log(speed + 1)
        const newSize = Math.min(
          ANIMATION_CONFIG.baseSize + speedFactor * ANIMATION_CONFIG.sizeMultiplier,
          ANIMATION_CONFIG.maxSize
        )
        size.set(newSize)
        smoothSize.set(newSize)
      }
    }

    // Update last position
    lastPosRef.current = { x: clientX, y: clientY, time: now }

    // Reset size after delay
    if (sizeTimeoutRef.current) {
      clearTimeout(sizeTimeoutRef.current)
    }
    sizeTimeoutRef.current = setTimeout(() => {
      size.set(ANIMATION_CONFIG.baseSize)
      smoothSize.set(ANIMATION_CONFIG.baseSize)
    }, ANIMATION_CONFIG.resetDelay)
  }, [mouseX, mouseY, size, smoothX, smoothY, smoothSize])

  // Mouse event handlers
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) return
    updateCursorEffect(event.clientX, event.clientY)
  }, [isVisible, updateCursorEffect])

  const handleMouseLeave = useCallback(() => {
    opacityTimeoutRef.current = setTimeout(() => {
      opacity.set(0)
      smoothOpacity.set(0)
    }, 500)
  }, [opacity, smoothOpacity])

  const handleMouseEnter = useCallback(() => {
    if (opacityTimeoutRef.current) {
      clearTimeout(opacityTimeoutRef.current)
      opacityTimeoutRef.current = null
    }
    if (isVisible) {
      opacity.set(ANIMATION_CONFIG.visibleOpacity)
      smoothOpacity.set(ANIMATION_CONFIG.visibleOpacity)
    }
  }, [isVisible, opacity, smoothOpacity])

  // Handle visibility changes
  useEffect(() => {
    cleanup()

    if (isVisible) {
      opacity.set(ANIMATION_CONFIG.visibleOpacity)
      smoothOpacity.set(ANIMATION_CONFIG.visibleOpacity)
    } else {
      opacityTimeoutRef.current = setTimeout(() => {
        opacity.set(0)
        smoothOpacity.set(0)
      }, ANIMATION_CONFIG.fadeDelay)
    }

    return cleanup
  }, [isVisible, opacity, smoothOpacity, cleanup])

  // Mouse event listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      cleanup()
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, cleanup])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-30 rounded-full bg-primary/20 blur-3xl"
      style={{
        left: smoothX,
        top: smoothY,
        width: smoothSize,
        height: smoothSize,
        opacity: smoothOpacity,
        transform: "translate(-50%, -50%)"
      }}
    />
  )
}