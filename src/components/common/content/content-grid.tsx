/**
 * Universal Content Grid System
 * Meta Engineering Standards: Reusable, responsive, type-safe
 * Handles both Blog and Project card layouts with consistent spacing
 */

import { ReactNode } from "react"
import { cn } from "@/lib/core/utils"

export interface GridConfig {
  /** Grid columns for different breakpoints */
  columns: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  /** Gap between grid items */
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  /** Custom CSS classes */
  className?: string
}

interface ContentGridProps {
  children: ReactNode
  config: GridConfig
  'data-testid'?: string
}

const GAP_CLASSES = {
  sm: 'gap-3',
  md: 'gap-6', 
  lg: 'gap-8',
  xl: 'gap-12'
} as const

/**
 * Generates responsive grid column classes based on config
 */
function generateGridClasses(columns: GridConfig['columns']): string {
  const classes: string[] = []
  
  // Default columns
  if (columns.default) {
    classes.push(`grid-cols-${columns.default}`)
  }
  
  // Responsive columns
  if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`)
  if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
  if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)
  if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`)
  
  return classes.join(' ')
}

export function ContentGrid({ children, config, 'data-testid': testId }: ContentGridProps) {
  const gridClasses = generateGridClasses(config.columns)
  const gapClass = GAP_CLASSES[config.gap || 'md']
  
  return (
    <div 
      className={cn(
        "grid",
        gridClasses,
        gapClass,
        config.className
      )}
      data-testid={testId}
    >
      {children}
    </div>
  )
}

// Predefined grid configurations for common use cases
export const GRID_CONFIGS = {
  // Blog post grid - 3 columns on large screens
  blog: {
    columns: { default: 1, md: 2, lg: 3 },
    gap: 'md' as const
  },
} as const

export type GridConfigName = keyof typeof GRID_CONFIGS