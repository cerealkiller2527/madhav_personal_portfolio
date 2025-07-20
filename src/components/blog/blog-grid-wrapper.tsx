"use client"

import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogErrorBoundary } from "@/components/blog/blog-error-boundary"
import { BlogPostPreview } from "@/types/blogTypes"

interface BlogGridWrapperProps {
  posts: readonly BlogPostPreview[]
}

export function BlogGridWrapper({ posts }: BlogGridWrapperProps) {
  return (
    <BlogErrorBoundary>
      <BlogGrid posts={posts} />
    </BlogErrorBoundary>
  )
}