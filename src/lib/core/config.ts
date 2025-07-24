// Environment Configuration
// Centralizes all environment variable access with type safety

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    email: process.env.AUTHOR_EMAIL || '',
  }
}

export const notionConfig = {
  token: process.env.NOTION_TOKEN || '',
  blogDatabaseId: process.env.NOTION_DATABASE_ID || '',
  projectsDatabaseId: process.env.NOTION_PROJECTS_DATABASE_ID || '',
}

export const commentsConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  mapping: "pathname" as const,
  strict: "0" as const,
  reactionsEnabled: "1" as const,
  emitMetadata: "0" as const,
  inputPosition: "bottom" as const,
  loading: "lazy" as const,
}

// Helper to check if comments are properly configured
export const isCommentsEnabled = () => {
  return !!(commentsConfig.repo && commentsConfig.repoId && commentsConfig.categoryId)
}