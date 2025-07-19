import { ExtendedRecordMap } from "notion-types"

export interface BlogPost {
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
  recordMap: ExtendedRecordMap
}

export interface BlogPostPreview {
  id: string
  slug: string
  title: string
  description?: string
  publishedAt: string
  tags: string[]
  category?: string
  coverImage?: string
  readingTime?: number
}

export interface BlogConfig {
  revalidateTime: number
  postsPerPage: number
  enableComments: boolean
}

export interface BlogMetadata {
  title: string
  description: string
  author: string
  siteUrl: string
  ogImage?: string
}