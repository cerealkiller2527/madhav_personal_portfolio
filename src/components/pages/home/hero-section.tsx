"use client"
import { motion } from "framer-motion"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { ProjectMarquee } from "@/components/projects/project-marquee"
import type { Project } from "@/lib/schemas"
import { smoothScrollToElement } from "@/lib/core/utils"
import { siteInfo, buttonLabels } from "@/lib/core/data"

interface HeroSectionProps {
  projects: readonly Project[]
  onHoverChange: (isHovering: boolean) => void
  onProjectSelect: (projectId: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0.0, 0.2, 1.0] as const 
    } 
  },
}

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1.2,
      staggerChildren: 0.08,
    },
  },
}

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1.0] as const,
    },
  },
}

export function HeroSection({ projects, onHoverChange, onProjectSelect }: HeroSectionProps) {

  const handleViewWorkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollToElement("projects", 800)
  }

  return (
    <section
      id="home"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="relative flex min-h-screen flex-col items-center justify-center pt-20 pb-10 bg-dot-pattern"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 flex-grow flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            className="text-center lg:text-left lg:pl-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <span className="text-sm uppercase tracking-widest font-medium text-muted-foreground">
                {siteInfo.tagline}
              </span>
            </motion.div>

            <motion.h1
              variants={sentence}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
            >
              {siteInfo.heroTitle.split("").map((char, index) => (
                <motion.span key={`${char}-${index}`} variants={letter}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-12 text-balance text-muted-foreground">
              {siteInfo.bio}
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button onClick={handleViewWorkClick} size="lg">
                {buttonLabels.viewMyWork}
                <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-center"
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden bg-slate-900/20 dark:bg-white/10 backdrop-blur-xl border border-slate-900/5 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/30 dark:via-white/10 rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 via-transparent to-white/10 dark:to-white/20 rounded-3xl" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 dark:from-white/20 to-transparent rounded-t-3xl" />

              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={siteInfo.avatarTransparent}
                  alt={siteInfo.avatarAlt}
                  width={280}
                  height={280}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="w-full mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1.0] as const, delay: 0.3 }}
      >
        <ProjectMarquee projects={projects} onProjectSelect={onProjectSelect} />
      </motion.div>
    </section>
  )
}
