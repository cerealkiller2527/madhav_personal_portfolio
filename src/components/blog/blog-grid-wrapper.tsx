"use client"

import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogErrorBoundary } from "@/components/blog/blog-error-boundary"
import { BlogPreview } from "@/types/notion-unified"

interface BlogGridWrapperProps {
  posts: readonly BlogPreview[]
}

export function BlogGridWrapper({ posts }: BlogGridWrapperProps) {
  return (
    <BlogErrorBoundary>
      <BlogGrid posts={posts} />
    </BlogErrorBoundary>
  )
}