"use client"

import { useState, useEffect } from "react"

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections: { id: string; ratio: number; top: number }[] = []

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.push({
              id: entry.target.id,
              ratio: entry.intersectionRatio,
              top: entry.boundingClientRect.top,
            })
          }
        })

        if (visibleSections.length > 0) {
          // Sort by highest intersection ratio first, then by top position
          visibleSections.sort((a, b) => {
            if (Math.abs(a.ratio - b.ratio) < 0.1) {
              // If ratios are similar, prefer the one closer to top
              return a.top - b.top
            }
            return b.ratio - a.ratio
          })

          setActiveSection(visibleSections[0].id)
        }
      },
      {
        // Multiple thresholds for better tracking
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
        // Adjust root margin to be more responsive
        rootMargin: "-10% 0px -50% 0px",
      }
    )

    // Observe all elements with IDs (sections, footer, etc.)
    const elementsWithIds = document.querySelectorAll("[id]")
    const relevantIds = ["home", "experience", "projects", "contact"]
    
    elementsWithIds.forEach((element) => {
      if (relevantIds.includes(element.id)) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return activeSection
}