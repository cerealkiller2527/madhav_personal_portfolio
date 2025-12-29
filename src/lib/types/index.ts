/**
 * Application Types
 * 
 * Centralized type definitions used across the application.
 */

import type { ExtendedRecordMap } from 'notion-types'

// ============================================================================
// Common Types
// ============================================================================

export type ProjectCategory = 'Software' | 'Hardware' | 'Hybrid'

export interface Statistic {
  value: string
  label: string
}

// ============================================================================
// Experience Types
// ============================================================================

export interface Experience {
  id: string
  company: string
  role: string
  title?: string
  date?: string
  location?: string
  description: string
  stats?: Statistic[]
  tags: string[]
  liveLink?: string
}

// ============================================================================
// Project Types
// ============================================================================

export interface GalleryItem {
  url: string
  caption: string
}

export interface Feature {
  title: string
  description: string
}

export interface TechStackItem {
  name: string
}

export interface Project {
  id: string
  slug?: string
  title: string
  subtitle: string
  description: string
  category: ProjectCategory
  tags: string[]
  award?: string
  awardRank?: string
  stats?: Statistic[]
  liveLink?: string
  githubLink?: string
  heroImage: string
  sketchfabEmbedUrl?: string
  gallery: GalleryItem[]
  detailedDescription: string
  keyFeatures: Feature[]
  techStack: TechStackItem[]
  recordMap?: ExtendedRecordMap
}

// ============================================================================
// Blog Types
// ============================================================================

export interface BlogPreview {
  id: string
  slug: string
  title: string
  description?: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  category?: string
  coverImage?: string
  published: boolean
  readingTime?: number
}

export interface BlogContent extends BlogPreview {
  recordMap?: ExtendedRecordMap
}

// ============================================================================
// Notion API Types
// ============================================================================

export interface NotionPropertyValue {
  id: string
  type: 'title' | 'rich_text' | 'date' | 'checkbox' | 'select' | 'multi_select' | 'files' | 'url' | 'number'
  title?: Array<{ plain_text: string }>
  rich_text?: Array<{ plain_text: string }>
  date?: { start: string } | null
  checkbox?: boolean
  select?: { name: string } | null
  multi_select?: Array<{ name: string }>
  files?: Array<{
    file?: { url: string }
    external?: { url: string }
  }>
  url?: string | null
  number?: number | null
}

export interface NotionPage {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  cover?: {
    type: 'external' | 'file'
    external?: { url: string }
    file?: { url: string }
  } | null
  archived: boolean
  properties: Record<string, NotionPropertyValue>
  url: string
}

export interface NotionProjectPreview {
  id: string
  slug: string
  title: string
  subtitle: string
  description?: string
  publishedAt: string
  updatedAt: string
  category: ProjectCategory
  award?: string
  awardRank?: string
  tags: string[]
  liveLink?: string
  githubLink?: string
  heroImage?: string
  coverImage?: string
  sketchfabEmbedUrl?: string
  stats: Statistic[]
  published: boolean
}

export interface ProjectContent extends NotionProjectPreview {
  recordMap?: ExtendedRecordMap
  gallery: GalleryItem[]
  keyFeatures: Feature[]
  techStack: TechStackItem[]
}

export interface NotionConfig {
  token?: string
  blogDatabaseId?: string
  projectsDatabaseId?: string
}

