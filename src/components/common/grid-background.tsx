"use client"

import { motion } from "framer-motion"

export function GridBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full bg-grid-pattern -z-10 animate-fade-in"
    />
  )
}
