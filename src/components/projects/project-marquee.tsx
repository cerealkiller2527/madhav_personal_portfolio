"use client"
import { useMemo } from "react"
import type React from "react"

import Image from "next/image"
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame, MotionValue } from "framer-motion"
import { Trophy, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/core/utils"
import { getTrophyStyles } from "@/lib/utils/badge-utils"

interface ProjectMarqueeProps {
  projects: readonly Project[]
  className?: string
  onProjectSelect: (projectId: string) => void
}


const InteractiveMarqueeItem = ({
  project,
  mouseX,
  springX,
  index,
  itemWidth,
  onProjectSelect,
  totalItems,
  singleSetWidth,
}: {
  project: Project
  mouseX: MotionValue<number>
  springX: MotionValue<number>
  index: number
  itemWidth: number
  onProjectSelect: (projectId: string) => void
  totalItems: number
  singleSetWidth: number
}) => {
  const distance = useTransform(
    [mouseX, springX],
    (values: number[]) => {
      const [latestMouseX, latestSpringX] = values
      
      // Get the current scroll position and normalize it
      const scrollPos = -latestSpringX
      
      // Calculate which "virtual" position the mouse is at in the infinite scroll
      const virtualMousePos = latestMouseX + scrollPos
      
      // Find the closest instance of this card to the mouse
      const cardSetIndex = Math.floor(index / totalItems)
      const cardIndexInSet = index % totalItems
      
      // Calculate all possible positions of this card in the infinite scroll
      const baseCardPos = cardIndexInSet * itemWidth + itemWidth / 2
      
      // Find the closest virtual position of this card to the mouse
      let minDistance = Number.MAX_VALUE
      for (let i = -2; i <= 2; i++) {
        const virtualCardPos = baseCardPos + (cardSetIndex + i) * singleSetWidth
        const dist = virtualMousePos - virtualCardPos
        if (Math.abs(dist) < Math.abs(minDistance)) {
          minDistance = dist
        }
      }
      
      return minDistance
    }
  )

  const scale = useTransform(distance, [-350, 0, 350], [1, 1.1, 1])
  const y = useTransform(distance, [-350, 0, 350], [0, -25, 0])
  const zIndex = useTransform(scale, [1, 1.01], [1, 50])
  const translateZ = useTransform(distance, [-400, 0, 400], [0, -80, 0])

  const smoothScale = useSpring(scale, { mass: 0.6, stiffness: 300, damping: 40 })
  const smoothY = useSpring(y, { mass: 0.6, stiffness: 300, damping: 40 })
  const smoothTranslateZ = useSpring(translateZ, { mass: 0.6, stiffness: 300, damping: 40 })

  const trophyStyles = project.awardRank ? getTrophyStyles(project.awardRank) : null

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
        <div className="w-full h-full bg-secondary/80 dark:bg-secondary/90 border-2 border-border/50 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
          <div className="relative h-28 w-full rounded-md overflow-hidden mb-3 flex-shrink-0">
            {project.heroImage ? (
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                sizes="256px"
                className="object-cover"
                style={{ imageRendering: "auto" }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
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

const SpeedIndicators = ({ velocityFactor }: { velocityFactor: MotionValue<number> }) => {
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

  // Create enough copies for seamless scrolling
  const extendedProjects = useMemo(
    () => {
      if (projects.length === 0) return []
      // Create enough copies to ensure seamless scrolling
      const copies = []
      const minCopies = 5 // Ensure we have enough for smooth transitions
      for (let i = 0; i < minCopies; i++) {
        copies.push(...projects)
      }
      return copies
    },
    [projects],
  )
  const singleSetWidth = projects.length * itemWidth

  // Animation values
  const x = useMotionValue(0)
  const velocityFactor = useMotionValue(0)
  const baseVelocity = -130 // Base scrolling speed

  useAnimationFrame((_time, delta) => {
    if (!singleSetWidth) return

    const deltaInSeconds = delta / 1000
    const vf = velocityFactor.get()
    
    // Calculate movement - positive vf moves right (reverse), negative moves left (faster forward)
    const baseMove = baseVelocity * deltaInSeconds
    // When moving right (positive vf), we need to compensate for the base leftward movement
    // So we double the influence to overcome the base velocity and still move right at the same apparent speed
    const mouseInfluence = vf > 0 
      ? vf * 520 * deltaInSeconds // Moving right - compensate for base leftward movement
      : vf * 400 * deltaInSeconds // Moving left - add to base movement
    const totalMove = baseMove + mouseInfluence
    
    const currentX = x.get()
    let newX = currentX + totalMove

    // Seamless wrapping - wrap when we've moved one full set width in either direction
    if (newX <= -singleSetWidth) {
      newX = newX + singleSetWidth
    } else if (newX >= 0) {
      newX = newX - singleSetWidth
    }
    
    x.set(newX)
  })

  return (
    <div className={cn("relative w-full py-4", className)}>
      <div
        onMouseMove={(e) => {
          mouseX.set(e.clientX)
          const { left, width } = e.currentTarget.getBoundingClientRect()
          const normalizedPosition = (e.clientX - (left + width / 2)) / (width / 2)
          // Linear scaling for consistent speed, positive on right (reverse), negative on left (faster forward)
          velocityFactor.set(normalizedPosition)
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
                totalItems={projects.length}
                singleSetWidth={singleSetWidth}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
