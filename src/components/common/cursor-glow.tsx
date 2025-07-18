"use client"
import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export const CursorGlow = ({ isVisible }: { isVisible: boolean }) => {
  // Spring physics for the trailing effect.
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  // Increased damping for a smoother, less "wobbly" trail
  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 50, mass: 1 })
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 50, mass: 1 })

  // Spring physics for the size animation.
  const baseSize = 300 // Doubled from 150
  const size = useMotionValue(baseSize)
  const smoothSize = useSpring(size, { stiffness: 200, damping: 30, mass: 0.5 })

  // Spring physics for opacity with slower fade out
  const opacity = useMotionValue(0)
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, mass: 0.8 })

  // Refs to manage speed calculation and the reset timer.
  const lastPos = useRef({ x: 0, y: 0, time: 0 })
  const sizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const opacityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle visibility changes with gradual fade
  useEffect(() => {
    if (isVisible) {
      // Clear any existing fade-out timeout
      if (opacityTimeoutRef.current) {
        clearTimeout(opacityTimeoutRef.current)
      }
      opacity.set(0.8) // Fade in immediately
    } else {
      // Start gradual fade out after a short delay
      opacityTimeoutRef.current = setTimeout(() => {
        opacity.set(0)
      }, 300) // 300ms delay before starting fade out
    }
  }, [isVisible, opacity])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isVisible) return

      const { clientX, clientY } = event
      const now = performance.now()

      // Update the raw cursor position. The spring will animate to this value.
      mouseX.set(clientX)
      mouseY.set(clientY)

      // Calculate cursor speed to drive the size of the glow.
      if (lastPos.current.time > 0) {
        const dt = now - lastPos.current.time
        if (dt > 0) {
          const dx = clientX - lastPos.current.x
          const dy = clientY - lastPos.current.y
          const speed = Math.sqrt(dx * dx + dy * dy) / dt

          // --- CORE LOGIC: Logarithmic scaling for a more controlled effect ---
          // Using natural logarithm for a gradual, smooth growth curve
          const speedFactor = Math.log(speed + 1) // +1 to avoid log(0)
          const sizeMultiplier = 160 // Doubled from 80 to compensate for log scaling
          const maxSize = 3000 // Doubled from 1500
          const newSize = Math.min(baseSize + speedFactor * sizeMultiplier, maxSize)
          size.set(newSize)
        }
      }

      lastPos.current = { x: clientX, y: clientY, time: now }

      // --- CORE LOGIC: Make the enlarged effect last longer ---
      // Clear any existing timer.
      if (sizeTimeoutRef.current) {
        clearTimeout(sizeTimeoutRef.current)
      }
      // Set a new timer to reset the glow size after the cursor stops moving.
      sizeTimeoutRef.current = setTimeout(() => {
        size.set(baseSize)
      }, 2500) // The glow will stay enlarged for 2.5 seconds.
    }

    const handleMouseLeave = () => {
      // When cursor leaves the window, start gradual fade out
      opacityTimeoutRef.current = setTimeout(() => {
        opacity.set(0)
      }, 500) // 500ms delay before starting fade out when leaving window
    }

    const handleMouseEnter = () => {
      // When cursor re-enters the window, cancel fade out if in visible section
      if (opacityTimeoutRef.current) {
        clearTimeout(opacityTimeoutRef.current)
      }
      if (isVisible) {
        opacity.set(0.8)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    // Cleanup function to remove the listener when the component unmounts.
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      if (sizeTimeoutRef.current) {
        clearTimeout(sizeTimeoutRef.current)
      }
      if (opacityTimeoutRef.current) {
        clearTimeout(opacityTimeoutRef.current)
      }
    }
  }, [isVisible, baseSize, opacity]) // Re-run effect if visibility changes.

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-30 rounded-full bg-primary/20 blur-3xl"
      style={{
        left: smoothX,
        top: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        width: smoothSize,
        height: smoothSize,
        opacity: smoothOpacity,
        willChange: "transform, width, height, opacity",
      }}
    />
  )
}
