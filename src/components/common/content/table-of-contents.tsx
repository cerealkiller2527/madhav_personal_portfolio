"use client"

import { useState, useEffect } from "react"

interface TocSection {
  id: string
  label: string
  level?: number
}

interface TableOfContentsProps {
  sections: TocSection[]
  containerRef?: React.RefObject<HTMLElement>
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
          
          if (elementTop <= scrollPosition + 200) {
            setActiveSection(section.id)
          }
        }
      }
    }

    const target = containerRef?.current || window
    target.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => target.removeEventListener('scroll', handleScroll)
  }, [sections, containerRef])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (!targetElement) return

    if (containerRef?.current) {
      const top = targetElement.offsetTop - 24
      containerRef.current.scrollTo({ top, behavior: "smooth" })
    } else {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 100
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }

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
                className={`block text-sm transition-colors ${
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