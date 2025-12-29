// Universal Content Grid System for blog and project card layouts

import { ReactNode } from "react"
import { cn } from "@/lib/core/utils"

export interface GridConfig {
  columns: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
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

// Static Tailwind class mappings for grid columns (avoids JIT purging)
const COLUMN_CLASSES = {
  default: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  },
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
  },
} as const

// Generates responsive grid column classes with static strings
function generateGridClasses(columns: GridConfig['columns']): string {
  const classes: string[] = []
  
  if (columns.default && COLUMN_CLASSES.default[columns.default as keyof typeof COLUMN_CLASSES.default]) {
    classes.push(COLUMN_CLASSES.default[columns.default as keyof typeof COLUMN_CLASSES.default])
  }
  
  if (columns.sm && COLUMN_CLASSES.sm[columns.sm as keyof typeof COLUMN_CLASSES.sm]) {
    classes.push(COLUMN_CLASSES.sm[columns.sm as keyof typeof COLUMN_CLASSES.sm])
  }
  
  if (columns.md && COLUMN_CLASSES.md[columns.md as keyof typeof COLUMN_CLASSES.md]) {
    classes.push(COLUMN_CLASSES.md[columns.md as keyof typeof COLUMN_CLASSES.md])
  }
  
  if (columns.lg && COLUMN_CLASSES.lg[columns.lg as keyof typeof COLUMN_CLASSES.lg]) {
    classes.push(COLUMN_CLASSES.lg[columns.lg as keyof typeof COLUMN_CLASSES.lg])
  }
  
  if (columns.xl && COLUMN_CLASSES.xl[columns.xl as keyof typeof COLUMN_CLASSES.xl]) {
    classes.push(COLUMN_CLASSES.xl[columns.xl as keyof typeof COLUMN_CLASSES.xl])
  }
  
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

// Predefined grid configuration for blog posts
export const GRID_CONFIGS = {
  blog: {
    columns: { default: 1, md: 2, lg: 3 },
    gap: 'md' as const
  },
} as const

export type GridConfigName = keyof typeof GRID_CONFIGS