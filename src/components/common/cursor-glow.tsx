"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

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
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed z-30 rounded-full bg-primary/20 blur-3xl"
          style={{
            left: smoothX,
            top: smoothY,
            width: 300,
            height: 300,
            x: "-50%",
            y: "-50%",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            opacity: { duration: 0.6, ease: "easeInOut" },
            scale: { duration: 0.5, ease: "easeInOut" }
          }}
        />
      )}
    </AnimatePresence>
  )
}

