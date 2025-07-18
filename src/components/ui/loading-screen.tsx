"use client"
import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <motion.div
        className="relative w-16 h-16"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-[#D14A1F] transform -skew-y-12 translate-y-1 rounded-sm" />
        <div className="absolute inset-0 bg-[#B8391A] transform skew-x-12 translate-x-1 rounded-sm" />
        <div className="absolute inset-0 bg-[#E85A2B] rounded-sm flex items-center justify-center">
          <span className="text-white text-4xl font-bold">M</span>
        </div>
      </motion.div>
    </div>
  )
}
