"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface CursorGlowProps {
  readonly isVisible: boolean
}

export const CursorGlow: React.FC<CursorGlowProps> = ({ isVisible }) => {
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 50 })
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 50 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isVisible) return
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isVisible, mouseX, mouseY])

  if (!isVisible) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-30 rounded-full bg-primary/20 blur-3xl"
      style={{
        left: smoothX,
        top: smoothY,
        width: 300,
        height: 300,
        transform: "translate(-50%, -50%)",
        opacity: 0.8
      }}
    />
  )
}