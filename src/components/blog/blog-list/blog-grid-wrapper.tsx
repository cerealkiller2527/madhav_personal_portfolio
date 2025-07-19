"use client"

import { BlogGrid } from "./blog-grid"
import { BlogErrorBoundary } from "../shared/blog-error-boundary"
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