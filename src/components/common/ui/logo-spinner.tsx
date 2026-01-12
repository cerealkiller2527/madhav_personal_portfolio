"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/core/utils"

interface LogoSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
  text?: string
}

// Size configuration with container classes and image sizes
const sizeConfig = {
  sm: { 
    container: "w-8 h-8", 
    text: "text-xs mt-2",
    imageSizes: "32px"
  },
  md: { 
    container: "w-12 h-12", 
    text: "text-sm mt-3",
    imageSizes: "48px"
  },
  lg: { 
    container: "w-16 h-16", 
    text: "text-base mt-4",
    imageSizes: "64px"
  },
  xl: { 
    container: "w-24 h-24", 
    text: "text-lg mt-4",
    imageSizes: "96px"
  }
} as const

export function LogoSpinner({ 
  size = "md", 
  className, 
  showText = false, 
  text = "Loading..." 
}: LogoSpinnerProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        className={cn(
          "relative flex-shrink-0 rounded-full overflow-hidden glass-subtle",
          config.container
        )}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent, rgba(var(--primary), 0.5), transparent)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        
        <div className="absolute inset-1 rounded-full overflow-hidden glass flex items-center justify-center">
          <motion.div
            className="relative w-full h-full p-1"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/portfolio/avatar-logo.png"
              alt="Loading"
              fill
              sizes={config.imageSizes}
              className="object-cover rounded-full"
              priority
            />
          </motion.div>
        </div>
      </motion.div>

      {showText && (
        <motion.p
          className={cn(
            "text-muted-foreground font-medium text-center",
            config.text
          )}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LogoSpinnerOverlay({ 
  text = "Loading...", 
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center glass-strong",
      className
    )}>
      <LogoSpinner size="xl" showText text={text} />
    </div>
  )
}

export function LogoSpinnerInline({ 
  size = "sm", 
  text,
  className 
}: { 
  size?: "sm" | "md"
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoSpinner size={size} />
      {text && (
        <span className="text-sm text-muted-foreground font-medium">
          {text}
        </span>
      )}
    </div>
  )
}
