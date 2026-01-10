// Shared project display components for badges, media, modal header, links, and stats

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Trophy, Maximize, X, Github, ExternalLink } from "lucide-react"
import type { Project, Statistic } from "@/lib/types"
import { Badge, getCategoryBadgeVariant, getAwardBadgeVariant } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ContentImage } from "@/components/common/content/content-image"
import { cn } from "@/lib/core/utils"
import { formatProjectIndex } from "@/lib/utils/project-utils"

// --- Project Badges Component ---

interface ProjectBadgesProps {
  project: Project
}

// Displays category and award badges with rank-based styling
export function ProjectBadges({ project }: ProjectBadgesProps) {
  const categoryVariant = getCategoryBadgeVariant(project.category)
  const awardVariant = project.awardRank ? getAwardBadgeVariant(project.awardRank) : null

  return (
    <div className="flex items-center gap-2 mb-2 flex-wrap -ml-1">
      {/* Category badge with semantic variant */}
      <Badge variant={categoryVariant}>
        {project.category}
      </Badge>
      
      {/* Award badge with trophy icon and rank-based colors */}
      {project.award && awardVariant && (
        <Badge variant={awardVariant}>
          <Trophy className="mr-1.5 h-3.5 w-3.5" />
          {project.award}
        </Badge>
      )}
    </div>
  )
}

// --- Project Stats Component ---

interface ProjectStatsProps {
  stats?: Statistic[]
  variant?: "compact" | "default" | "section"
  className?: string
}

// Displays project statistics with glass morphism styling
// - compact: inline pills for cards (subtle, minimal space)
// - default: small grid for modals/detail views
// - section: larger grid with heading for dedicated sections
export function ProjectStats({ stats, variant = "default", className }: ProjectStatsProps) {
  const [visibleStats, setVisibleStats] = useState<Statistic[]>([])
  const [overflowCount, setOverflowCount] = useState(0)
  const statsContainerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement | null>(null)

  const isCompact = variant === "compact"
  const isSection = variant === "section"

  useEffect(() => {
    if (!isCompact || !stats?.length || !statsContainerRef.current) {
      setVisibleStats(stats || [])
      setOverflowCount(0)
      return
    }

    // Create measurement element once
    if (!measurementRef.current) {
      const tempDiv = document.createElement('div')
      tempDiv.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs'
      tempDiv.style.cssText = 'position: absolute; visibility: hidden; white-space: nowrap; pointer-events: none;'
      document.body.appendChild(tempDiv)
      measurementRef.current = tempDiv
    }

    const calculateVisibleStats = () => {
      const container = statsContainerRef.current
      if (!container || !measurementRef.current) return

      const containerWidth = container.offsetWidth
      const gap = 8 // gap-2 = 8px
      const overflowBadgeWidth = 40 // Approximate width for "+X" badge
      let totalWidth = 0
      let visibleCount = 0

      // Calculate how many stats fit in one line
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]
        // Measure the full stat pill: value + label
        measurementRef.current.innerHTML = `<span style="font-weight: 600; color: hsl(var(--primary));">${stat.value}</span> <span style="color: hsl(var(--muted-foreground));">${stat.label}</span>`
        const statWidth = measurementRef.current.offsetWidth
        
        const needsOverflowBadge = i < stats.length - 1
        const requiredWidth = totalWidth + statWidth + gap + (needsOverflowBadge ? overflowBadgeWidth : 0)
        
        if (requiredWidth <= containerWidth) {
          totalWidth += statWidth + gap
          visibleCount++
        } else {
          break
        }
      }

      setVisibleStats(stats.slice(0, visibleCount))
      setOverflowCount(Math.max(0, stats.length - visibleCount))
    }

    // Initial calculation
    const rafId = requestAnimationFrame(calculateVisibleStats)
    
    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(calculateVisibleStats)
    resizeObserver.observe(statsContainerRef.current)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (measurementRef.current) {
        document.body.removeChild(measurementRef.current)
        measurementRef.current = null
      }
    }
  }, [stats, isCompact])

  if (!stats || stats.length === 0) return null

  if (isCompact) {
    // Compact inline display for cards - subtle pills, single line only
    return (
      <div ref={statsContainerRef} className={cn("flex flex-nowrap items-center gap-2 overflow-hidden", className)}>
        {visibleStats.map((stat) => (
          <div
            key={stat.label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-primary/10 dark:bg-primary/15 border border-primary/20 dark:border-primary/25 flex-shrink-0"
          >
            <span className="font-semibold text-primary">{stat.value}</span>
            <span className="text-muted-foreground whitespace-nowrap">{stat.label}</span>
          </div>
        ))}
        {overflowCount > 0 && (
          <span className="text-xs text-muted-foreground flex-shrink-0">+{overflowCount}</span>
        )}
      </div>
    )
  }

  // Grid display for default and section variants - always 4 columns
  const gridCols = "grid-cols-2 sm:grid-cols-4"

  return (
    <div className={cn("grid gap-3", gridCols, className)}>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          variant="glass"
          className={cn(
            "text-center transition-colors hover:bg-black/10 dark:hover:bg-white/10",
            isSection ? "p-4" : "p-3"
          )}
        >
          <p className={cn(
            "font-bold text-primary",
            isSection ? "text-2xl" : "text-lg"
          )}>
            {stat.value}
          </p>
          <p className={cn(
            "uppercase tracking-wider text-muted-foreground",
            isSection ? "text-xs mt-1" : "text-[10px]"
          )}>
            {stat.label}
          </p>
        </Card>
      ))}
    </div>
  )
}

// --- Sketchfab Iframe Component ---

interface SketchfabIframeProps {
  src: string
  title: string
  className?: string
}

// Renders Sketchfab 3D model iframe with consistent styling
function SketchfabIframe({ src, title, className = "w-full h-full bg-transparent" }: SketchfabIframeProps) {
  return (
    <iframe
      src={src}
      title={title}
      frameBorder="0"
      allowFullScreen
      className={className}
      style={{ colorScheme: 'light' }}
      allow="autoplay; fullscreen; xr-spatial-tracking"
    />
  )
}

// --- Project Media Component ---

interface ProjectMediaProps {
  project: Project
  index: number
}

// Displays project media - Sketchfab 3D embed or hero image with index badge
export function ProjectMedia({ project, index }: ProjectMediaProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl">
      <AspectRatio ratio={16 / 9} className={project.sketchfabEmbedUrl ? '' : 'bg-secondary/10'}>
        {project.sketchfabEmbedUrl ? (
          <SketchfabIframe
            src={project.sketchfabEmbedUrl}
            title={`${project.title} 3D Model`}
          />
        ) : (
          <ContentImage
            src={project.heroImage || ""}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
            fallbackType="project"
          />
        )}
      </AspectRatio>
      {/* Project index badge */}
      <div className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-white dark:text-primary">
          {formatProjectIndex(index)}
        </span>
      </div>
    </div>
  )
}

// --- Project Hero Media Component ---

interface ProjectHeroMediaProps {
  project: Project
  priority?: boolean
  sizes?: string
  className?: string
}

// Displays hero media following the hierarchy: 3D model (if available) > hero image
// Used for modal and full-page views without index badge
export function ProjectHeroMedia({ 
  project, 
  priority = false, 
  sizes = "(max-width: 1200px) 100vw, 800px",
  className = "object-cover"
}: ProjectHeroMediaProps) {
  return (
    <>
      {project.sketchfabEmbedUrl ? (
        <SketchfabIframe
          src={project.sketchfabEmbedUrl}
          title={`${project.title} 3D Model`}
        />
      ) : (
        <ContentImage
          src={project.heroImage || ""}
          alt={`${project.title} hero image`}
          fill
          sizes={sizes}
          className={className}
          fallbackType="project"
          priority={priority}
        />
      )}
    </>
  )
}

// --- Project Links Component ---

interface ProjectLinksProps {
  project: Project
  variant?: "compact" | "default" | "header"
  showLabels?: boolean
  className?: string
}

// Displays GitHub and Live link icons with glass morphism styling
export function ProjectLinks({ project, variant = "default", showLabels = false, className }: ProjectLinksProps) {
  const hasLinks = project.githubLink || project.liveLink
  
  if (!hasLinks) return null

  const isCompact = variant === "compact"
  const isHeader = variant === "header"
  
  const containerClasses = cn("flex items-center gap-2", className)
  
  // Base hover classes - primary color works in both light and dark modes
  const baseHoverClasses = "hover:bg-primary hover:border-primary hover:text-white"
  
  const linkClasses = cn(
    "flex items-center justify-center rounded-lg border",
    baseHoverClasses,
    isCompact 
      ? "w-8 h-8 bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-105 dark:hover:bg-orange-500 dark:hover:border-orange-500"
      : isHeader
        ? "w-10 h-10 bg-transparent border-transparent transition-colors duration-200 dark:hover:bg-orange-500 dark:hover:border-orange-500"
        : "w-11 h-11 bg-black/15 dark:bg-white/10 border-black/10 dark:border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
  )
  
  const iconClasses = cn(
    isHeader ? "" : "transition-transform duration-200",
    isCompact ? "h-4 w-4" : "h-5 w-5"
  )

  // Labeled link classes for detail page
  const labeledLinkClasses = cn(
    "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200",
    "bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10 backdrop-blur-md",
    baseHoverClasses,
    "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 text-sm font-medium"
  )

  // Render link content
  const renderLinkContent = (
    href: string,
    icon: React.ReactNode,
    label: string,
    ariaLabel: string
  ) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={showLabels ? labeledLinkClasses : linkClasses}
      onClick={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
    >
      {icon}
      {showLabels && <span>{label}</span>}
    </a>
  )

  return (
    <div className={containerClasses}>
      {project.githubLink && renderLinkContent(
        project.githubLink,
        <Github className={iconClasses} />,
        "View on GitHub",
        "View source code on GitHub"
      )}
      {project.liveLink && renderLinkContent(
        project.liveLink,
        <ExternalLink className={iconClasses} />,
        "View Live",
        "View live project"
      )}
    </div>
  )
}

// --- Project Modal Header ---

interface ProjectModalHeaderProps {
  project: Project
  onClose: () => void
}

// Header for project modal with title, links, expand button, and close button
export function ProjectModalHeader({ project, onClose }: ProjectModalHeaderProps) {
  return (
    <DialogHeader className="px-6 py-4 border-b flex flex-row items-start justify-between">
      <div>
        <DialogTitle className="text-xl">{project.title}</DialogTitle>
        <DialogDescription>{project.subtitle}</DialogDescription>
      </div>
      <div className="flex items-center gap-2 -mt-1 -mr-1">
        <ProjectLinks project={project} variant="header" />
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="flex-shrink-0 hover:bg-primary hover:text-white"
        >
          <Link
            href={`/projects/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View project in a new page"
          >
            <Maximize className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 hover:bg-primary hover:text-white"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  )
}
