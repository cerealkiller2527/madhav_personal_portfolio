"use client"
import { useMemo } from "react"
import type React from "react"

import Image from "next/image"
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame } from "framer-motion"
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/types"
import { cn } from "@/lib/utils"

interface ProjectMarqueeProps {
  projects: Project[]
  className?: string
  onProjectSelect: (projectId: string) => void
}

const getTrophyStyles = (awardRank?: string) => {
  if (!awardRank) return null
  
  const lowerRank = awardRank.toLowerCase()

  // Gold - 1st Place
  if (
    lowerRank.includes("1st") ||
    lowerRank === "1" ||
    lowerRank.includes("first") ||
    lowerRank.includes("winner") ||
    lowerRank.includes("gold")
  ) {
    return {
      containerClasses: "bg-amber-100/80 backdrop-blur-sm dark:bg-yellow-400/20",
      iconClasses: "text-amber-900 dark:text-yellow-400",
    }
  }

  // Silver - 2nd Place
  if (
    lowerRank.includes("2nd") ||
    lowerRank === "2" ||
    lowerRank.includes("second") ||
    lowerRank.includes("silver")
  ) {
    return {
      containerClasses: "bg-slate-200/80 backdrop-blur-sm dark:bg-gray-500/20",
      iconClasses: "text-slate-700 dark:text-gray-300",
    }
  }

  // Bronze - 3rd Place
  if (
    lowerRank.includes("3rd") ||
    lowerRank === "3" ||
    lowerRank.includes("third") ||
    lowerRank.includes("bronze")
  ) {
    return {
      containerClasses: "bg-orange-100/80 backdrop-blur-sm dark:bg-amber-500/20",
      iconClasses: "text-orange-900 dark:text-amber-400",
    }
  }

  // Other awards - No trophy styling
  return null
}

const InteractiveMarqueeItem = ({
  project,
  mouseX,
  springX,
  index,
  itemWidth,
  onProjectSelect,
}: {
  project: Project
  mouseX: ReturnType<typeof useMotionValue>
  springX: ReturnType<typeof useSpring>
  index: number
  itemWidth: number
  onProjectSelect: (projectId: string) => void
}) => {
  const distance = useTransform([mouseX, springX], ([latestMouseX, latestSpringX]) => {
    const cardLogicalCenter = index * itemWidth + itemWidth / 2
    const cursorPositionInStrip = latestMouseX - latestSpringX
    return cursorPositionInStrip - cardLogicalCenter
  })

  const scale = useTransform(distance, [-350, 0, 350], [1, 1.1, 1])
  const y = useTransform(distance, [-350, 0, 350], [0, -25, 0])
  const zIndex = useTransform(scale, [1, 1.01], [1, 50])
  const translateZ = useTransform(distance, [-400, 0, 400], [0, -80, 0])

  const smoothScale = useSpring(scale, { mass: 0.6, stiffness: 300, damping: 40 })
  const smoothY = useSpring(y, { mass: 0.6, stiffness: 300, damping: 40 })
  const smoothTranslateZ = useSpring(translateZ, { mass: 0.6, stiffness: 300, damping: 40 })

  const trophyStyles = getTrophyStyles(project.awardRank)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onProjectSelect(project.id)
  }

  return (
    <motion.div
      className="relative flex-shrink-0 w-64 mx-3"
      style={{
        scale: smoothScale,
        y: smoothY,
        z: smoothTranslateZ,
        rotateX: 10,
        zIndex,
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      <a href={`/projects/${project.id}`} onClick={handleClick} className="block w-full h-full cursor-pointer">
        <div className="w-full h-full bg-secondary/50 dark:bg-secondary/80 border-2 border-border/50 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
          <div className="relative h-28 w-full rounded-md overflow-hidden mb-3 flex-shrink-0">
            <Image
              src={
                project.heroImage || `/placeholder.svg?height=112&width=256&text=${encodeURIComponent(project.title)}`
              }
              alt={project.title}
              fill
              sizes="256px"
              className="object-cover"
              style={{ imageRendering: "auto" }}
            />
            {project.awardRank && trophyStyles && (
              <div className={cn("absolute top-2 right-2 rounded-full p-1.5", trophyStyles.containerClasses)}>
                <Trophy className={cn("w-4 h-4", trophyStyles.iconClasses)} />
              </div>
            )}
          </div>
          <div className="text-left flex-grow min-h-0 flex flex-col overflow-hidden">
            <h3 className="font-bold text-foreground text-sm leading-tight mb-1 line-clamp-2">{project.title}</h3>
            <p className="text-muted-foreground text-xs line-clamp-2 flex-grow">{project.subtitle}</p>
          </div>
        </div>
      </a>
    </motion.div>
  )
}

const SpeedIndicators = ({ velocityFactor }: { velocityFactor: ReturnType<typeof useMotionValue> }) => {
  const velocity = useTransform(velocityFactor, [-1, 1], [-1, 1])

  // Always visible with base opacity, gets brighter towards edges
  const leftOpacity = useTransform(velocity, [-1, -0.2, 0, 0.2, 1], [1, 0.8, 0.3, 0.2, 0.15])
  const rightOpacity = useTransform(velocity, [-1, -0.2, 0, 0.2, 1], [0.15, 0.2, 0.3, 0.8, 1])

  // Scale gets bigger towards edges
  const leftScale = useTransform(velocity, [-1, 0, 1], [1.3, 0.8, 0.6])
  const rightScale = useTransform(velocity, [-1, 0, 1], [0.6, 0.8, 1.3])

  return (
    <>
      {/* Left Speed Indicator - positioned at far left edge */}
      <motion.div
        className="absolute left-8 -top-12 flex items-center gap-2 pointer-events-none z-40"
        style={{ opacity: leftOpacity, scale: leftScale }}
      >
        <div className="flex items-center">
          <ChevronLeft className="w-5 h-5 text-primary" />
          <ChevronLeft className="w-5 h-5 text-primary -ml-3" />
          <ChevronLeft className="w-5 h-5 text-primary -ml-3" />
        </div>
        <div className="text-xs text-primary font-bold tracking-wider uppercase">Faster</div>
      </motion.div>

      {/* Right Speed Indicator - positioned at far right edge */}
      <motion.div
        className="absolute right-8 -top-12 flex items-center gap-2 pointer-events-none z-40"
        style={{ opacity: rightOpacity, scale: rightScale }}
      >
        <div className="text-xs text-primary font-bold tracking-wider uppercase">Faster</div>
        <div className="flex items-center">
          <ChevronRight className="w-5 h-5 text-primary" />
          <ChevronRight className="w-5 h-5 text-primary -ml-3" />
          <ChevronRight className="w-5 h-5 text-primary -ml-3" />
        </div>
      </motion.div>
    </>
  )
}

export function ProjectMarquee({ projects, className, onProjectSelect }: ProjectMarqueeProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const itemWidth = 280 // w-64 (256px) + mx-3 (24px) = 280px

  // Triple the projects for seamless infinite scroll
  const extendedProjects = useMemo(
    () => (projects.length > 0 ? [...projects, ...projects, ...projects] : []),
    [projects],
  )
  const singleSetWidth = projects.length * itemWidth

  // Animation values
  const x = useMotionValue(0)
  const velocityFactor = useMotionValue(0)
  const baseVelocity = -120 // Base scrolling speed

  useAnimationFrame((time, delta) => {
    if (!singleSetWidth) return

    const deltaInSeconds = delta / 1000
    let moveBy = baseVelocity * deltaInSeconds
    moveBy += velocityFactor.get() * 200 * deltaInSeconds // Velocity from mouse position

    const currentX = x.get()
    const newX = currentX + moveBy

    // When we've scrolled one full set width, jump back seamlessly
    if (newX <= -singleSetWidth) {
      x.set(newX + singleSetWidth)
    } else {
      x.set(newX)
    }
  })

  return (
    <div className={cn("relative w-full py-4", className)}>
      <div
        onMouseMove={(e) => {
          mouseX.set(e.clientX)
          const { left, width } = e.currentTarget.getBoundingClientRect()
          const normalizedPosition = (e.clientX - (left + width / 2)) / (width / 2)
          const edgeEnhanced = Math.sign(normalizedPosition) * Math.pow(Math.abs(normalizedPosition), 0.7)
          velocityFactor.set(edgeEnhanced)
        }}
        onMouseLeave={() => {
          mouseX.set(Number.POSITIVE_INFINITY)
          velocityFactor.set(0)
        }}
        className="relative"
      >
        <SpeedIndicators velocityFactor={velocityFactor} />

        <div className="relative w-full overflow-hidden" style={{ perspective: "1200px" }}>
          <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-background to-transparent z-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-background to-transparent z-30 pointer-events-none" />

          <motion.div
            className="flex py-8"
            style={{ x, willChange: "transform", transformStyle: "preserve-3d" }}
          >
            {extendedProjects.map((project, index) => (
              <InteractiveMarqueeItem
                key={`${project.id}-${index}`}
                project={project}
                mouseX={mouseX}
                springX={x}
                index={index}
                itemWidth={itemWidth}
                onProjectSelect={onProjectSelect}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
