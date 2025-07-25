import { useState, useEffect } from "react"
import { smoothScrollTo } from "@/lib/core/utils"

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
    const isProjectVisible = projectIndex !== -1 && (projectIndex < 4 || showMore || activeFilter !== "All")

    if (!isProjectVisible) {
      setShowMore(true)
      return
    }

    const element = document.querySelector(`[data-project-id="${bounceProjectId}"]`)
    if (!element) return

    const elementRect = element.getBoundingClientRect()
    const targetPosition = elementRect.top + window.pageYOffset - window.innerHeight / 2
    smoothScrollTo(targetPosition, 1000)

    setTimeout(() => {
      setActiveBounceId(bounceProjectId)
      setTimeout(() => {
        setActiveBounceId(null)
        onBounceComplete()
      }, 2000)
    }, 1000)
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