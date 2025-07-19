"use client"

import React, { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface TocSection {
  id: string
  label: string
  level?: number
}

interface EnhancedTocProps {
  sections: TocSection[]
  containerRef?: React.RefObject<HTMLElement>
  className?: string
}

interface ObservableSection extends TocSection {
  ref: any
  inView: boolean
}

/**
 * Enhanced Table of Contents component with automatic active section highlighting
 * Uses react-intersection-observer for better performance and accuracy
 */
export function EnhancedTableOfContents({ sections, containerRef, className }: EnhancedTocProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  
  // Create intersection observer refs for each section
  const observableSections: ObservableSection[] = sections.map(section => {
    const { ref, inView } = useInView({
      threshold: 0.3,
      rootMargin: '-20% 0px -35% 0px', // Trigger when section is in middle third of viewport
    })
    
    return {
      ...section,
      ref,
      inView,
    }
  })

  // Update active section based on which sections are in view
  useEffect(() => {
    const visibleSections = observableSections.filter(section => section.inView)
    
    if (visibleSections.length > 0) {
      // If multiple sections are visible, choose the first one
      setActiveSection(visibleSections[0].id)
    }
  }, [observableSections.map(s => s.inView).join(',')])

  // Attach intersection observers to actual DOM elements
  useEffect(() => {
    observableSections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element && section.ref) {
        // Create a wrapper div to attach the ref if needed
        const observer = section.ref
        if (typeof observer === 'function') {
          observer(element)
        }
      }
    })
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (!targetElement) return

    if (containerRef?.current) {
      // Scroll within a container (e.g., a modal)
      const headerOffset = 24 // Small offset for padding
      const top = targetElement.offsetTop - headerOffset
      containerRef.current.scrollTo({
        top: top,
        behavior: "smooth",
      })
    } else {
      // Scroll the whole page
      const headerOffset = 100 // Fixed header height
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }

    // Manually set active section for immediate feedback
    setActiveSection(id)
  }

  return (
    <nav className={className}>
      <h4 className="font-semibold mb-4 text-foreground">On this page</h4>
      <ul className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          const level = section.level || 1
          
          return (
            <li key={section.id} className={level > 1 ? `ml-${(level - 1) * 3}` : ''}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleLinkClick(e, section.id)}
                className={`block text-sm transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'text-primary font-semibold border-l-2 border-primary pl-3 -ml-3'
                    : 'text-muted-foreground hover:text-foreground hover:font-medium'
                }`}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Hook to automatically detect headings in a container and generate TOC sections
 * This is useful when you want to automatically generate TOC from DOM headings
 */
export function useAutoDetectHeadings(containerSelector: string = 'main'): TocSection[] {
  const [sections, setSections] = useState<TocSection[]>([])

  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const detectedSections: TocSection[] = Array.from(headings).map(heading => {
      const id = heading.id || heading.textContent?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') || ''
      
      // Set ID if not already present
      if (!heading.id && id) {
        heading.id = id
      }

      const level = parseInt(heading.tagName.charAt(1))
      
      return {
        id: heading.id || id,
        label: heading.textContent || '',
        level
      }
    })

    setSections(detectedSections)
  }, [containerSelector])

  return sections
}