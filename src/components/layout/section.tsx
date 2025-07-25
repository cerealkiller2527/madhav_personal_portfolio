"use client"
import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/core/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  title: string
  id: string
  hasBackground?: boolean
  description?: string
}

function GridBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full bg-grid-pattern -z-10 animate-fade-in"
    />
  )
}

export function Section({ children, className, title, id, hasBackground = false, description }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={cn("w-full py-20 md:py-28 relative", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {hasBackground && <GridBackground />}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          )}
        </div>
        {children}
      </div>
    </motion.section>
  )
}
