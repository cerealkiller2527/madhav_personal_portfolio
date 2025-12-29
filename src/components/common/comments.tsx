"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Giscus from "@giscus/react"

const commentsConfig = {
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

function isCommentsEnabled() {
  return !!(commentsConfig.repo && commentsConfig.repoId && commentsConfig.categoryId)
}

interface CommentsProps {
  className?: string
}

export function Comments({ className = "" }: CommentsProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`min-h-[200px] animate-pulse bg-muted/30 rounded-lg ${className}`} />
    )
  }

  // Don't render if required config is missing
  if (!isCommentsEnabled()) {
    return null
  }

  // Determine the actual theme to use
  const resolvedTheme = theme === "system" ? systemTheme : theme
  const giscusTheme = resolvedTheme === "dark" ? "transparent_dark" : "light"

  return (
    <div className={`w-full ${className}`}>
      <div className="mt-16 pt-12 border-t border-white/10">
        <Giscus
          repo={commentsConfig.repo}
          repoId={commentsConfig.repoId}
          category={commentsConfig.category}
          categoryId={commentsConfig.categoryId}
          mapping={commentsConfig.mapping}
          strict={commentsConfig.strict}
          reactionsEnabled={commentsConfig.reactionsEnabled}
          emitMetadata={commentsConfig.emitMetadata}
          inputPosition={commentsConfig.inputPosition}
          theme={giscusTheme}
          loading={commentsConfig.loading}
          lang="en"
        />
      </div>
    </div>
  )
}

