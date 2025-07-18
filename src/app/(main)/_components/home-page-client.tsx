"use client"

import { useState, useEffect, useCallback } from "react"
import { HeroSection } from "@/components/sections/hero/hero-section"
import { ExperienceSection } from "@/components/sections/experience/experience-section"
import { ProjectsSection } from "@/components/sections/projects/projects-section"
import { ProjectModal } from "@/components/sections/projects/project-modal"
import type { Project, Experience } from "@/lib/types"
import { CursorGlow } from "@/components/common/cursor-glow"
import { smoothScrollToElement } from "@/lib/utils"

interface HomePageClientProps {
  projects: Project[]
  experiences: Experience[]
}

/**
 * This is the client-side wrapper for the main page. It's co-located
 * with the page route using the `_components` convention to indicate
 * it's a private component, not meant for reuse elsewhere.
 * It handles all client-side state and interactivity for the homepage.
 */
export default function HomePageClient({ projects, experiences }: HomePageClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isGlowVisible, setIsGlowVisible] = useState(false)
  const [bounceTarget, setBounceTarget] = useState<string | null>(null)

  // Effect to handle scrolling from sessionStorage (e.g., after navigating back)
  useEffect(() => {
    const scrollToId = sessionStorage.getItem("scrollTo")
    if (scrollToId) {
      // Use a longer timeout to ensure the page is fully rendered
      setTimeout(() => {
        smoothScrollToElement(scrollToId, 800)
        sessionStorage.removeItem("scrollTo")
      }, 150)
    }
  }, [])

  const handleProjectSelectFromMarquee = (projectId: string) => {
    // Simply set the target project ID. The ProjectsSection component will
    // now handle the entire scroll and bounce animation sequence.
    setBounceTarget(projectId)
  }

  // Memoize the callback to prevent unnecessary re-renders of ProjectsSection
  const onBounceComplete = useCallback(() => {
    setBounceTarget(null)
  }, [])

  return (
    <>
      <CursorGlow isVisible={isGlowVisible} />
      <HeroSection
        projects={projects}
        onHoverChange={setIsGlowVisible}
        onProjectSelect={handleProjectSelectFromMarquee}
      />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection
        projects={projects}
        onProjectSelect={setSelectedProject}
        bounceProjectId={bounceTarget}
        onBounceComplete={onBounceComplete}
      />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
