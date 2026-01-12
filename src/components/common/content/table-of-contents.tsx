"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/core/utils"
import type { TOCSection } from "@/lib/types"

// Scroll detection and navigation constants
const SCROLL_DETECTION_OFFSET = 200
const CONTAINER_SCROLL_OFFSET = 24
const WINDOW_SCROLL_OFFSET = 100

// Static margin classes for TOC heading levels (avoids JIT purging)
const LEVEL_MARGIN_CLASSES: Record<number, string> = {
  1: '',
  2: 'ml-3',
  3: 'ml-6',
}

interface TableOfContentsProps {
  sections: TOCSection[]
  containerRef?: React.RefObject<HTMLElement | null>
  className?: string
}

export function TableOfContents({ sections, containerRef, className }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = containerRef?.current?.scrollTop || window.pageYOffset
      
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const elementTop = containerRef?.current 
            ? element.offsetTop - (containerRef.current.scrollTop || 0)
            : element.getBoundingClientRect().top + window.pageYOffset
          
          if (elementTop <= scrollPosition + SCROLL_DETECTION_OFFSET) {
            setActiveSection(section.id)
          }
        }
      }
    }

    const target = containerRef?.current || window
    target.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => target.removeEventListener('scroll', handleScroll)
  }, [sections, containerRef])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (!targetElement) return

    if (containerRef?.current) {
      const top = targetElement.offsetTop - CONTAINER_SCROLL_OFFSET
      containerRef.current.scrollTo({ top, behavior: "smooth" })
    } else {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - WINDOW_SCROLL_OFFSET
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }

    setActiveSection(id)
  }

  if (sections.length === 0) return null

  return (
    <nav className={className}>
      <h4 className="font-semibold mb-4 text-foreground text-sm">On this page</h4>
      <ul className="space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          const level = section.level
          
          return (
            <li key={section.id} className={LEVEL_MARGIN_CLASSES[level] || ''}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleLinkClick(e, section.id)}
                className={cn(
                  "block text-sm py-1 px-3 rounded-md transition-colors",
                  isActive
                    ? "glass text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
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
