"use client"

import type React from "react"

interface TocProps {
  sections: { id: string; label: string }[]
  containerRef?: React.RefObject<HTMLElement>
}

/**
 * A Table of Contents component that can scroll either the main window
 * or a specified container element.
 */
export function TableOfContents({ sections, containerRef }: TocProps) {
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
  }

  return (
    <nav>
      <h4 className="font-semibold mb-4 text-foreground">On this page</h4>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => handleLinkClick(e, section.id)}
              className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:font-semibold"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
