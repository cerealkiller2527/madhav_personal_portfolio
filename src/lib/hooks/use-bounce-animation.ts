import { useState, useEffect } from "react"
import { smoothScrollTo } from "@/lib/core/utils"
import { UI_CONSTANTS } from "@/lib/core/data"

// Animation timing constants (local to bounce animation)
const BOUNCE_SCROLL_DURATION_MS = 1000
const BOUNCE_DURATION_MS = 3000

interface UseBounceAnimationProps {
  bounceProjectId: string | null
  filteredProjects: readonly { id: string }[]
  showMore: boolean
  activeFilter: string
  setShowMore: (show: boolean) => void
  onBounceComplete: () => void
}

export function useBounceAnimation({
  bounceProjectId,
  filteredProjects,
  showMore,
  activeFilter,
  setShowMore,
  onBounceComplete
}: UseBounceAnimationProps) {
  const [activeBounceId, setActiveBounceId] = useState<string | null>(null)

  useEffect(() => {
    if (!bounceProjectId) return

    const projectIndex = filteredProjects.findIndex((p) => p.id === bounceProjectId)
    const isProjectVisible = projectIndex !== -1 && (projectIndex < UI_CONSTANTS.INITIAL_VISIBLE_PROJECTS || showMore || activeFilter !== "All")

    if (!isProjectVisible) {
      setShowMore(true)
      return
    }

    const element = document.querySelector(`[data-project-id="${bounceProjectId}"]`)
    if (!element) return

    const elementRect = element.getBoundingClientRect()
    const targetPosition = elementRect.top + window.pageYOffset - window.innerHeight / 2 + elementRect.height / 2
    smoothScrollTo(targetPosition, BOUNCE_SCROLL_DURATION_MS)

    setTimeout(() => {
      setActiveBounceId(bounceProjectId)
      setTimeout(() => {
        setActiveBounceId(null)
        onBounceComplete()
      }, BOUNCE_DURATION_MS)
    }, BOUNCE_SCROLL_DURATION_MS)
  }, [bounceProjectId, filteredProjects, showMore, activeFilter, onBounceComplete, setShowMore])

  const stopBouncing = (projectId?: string) => {
    if (!projectId || activeBounceId === projectId) {
      setActiveBounceId(null)
    }
  }

  return {
    activeBounceId,
    stopBouncing
  }
}