"use client"

import { useState, useEffect, useCallback } from "react"
import { HeroSection } from "@/components/pages/home/hero-section"
import { ExperienceSection } from "@/components/pages/home/experience-section"
import { ProjectsSection } from "@/components/pages/home/projects-section"
import { ProjectModal } from "@/components/projects/project-modal"
import type { Project, Experience } from "@/lib/schemas"
import { CursorGlow } from "@/components/common/cursor-glow"
import { smoothScrollToElement } from "@/lib/core/utils"

interface HomePageProps {
  projects: readonly Project[]
  experiences: readonly Experience[]
}

/**
 * The main homepage component that handles all client-side state and interactivity.
 * Orchestrates the hero, experience, and projects sections with shared state management.
 */
export default function HomePage({ projects, experiences }: HomePageProps) {
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
