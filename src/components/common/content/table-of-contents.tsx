"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { smoothScrollTo, findHeadingByText } from "@/lib/core/utils"
import type { TOCNode } from "@/lib/hooks/use-content-toc"

interface TableOfContentsProps {
  sections: TOCNode[]
  sectionIds: string[]
  className?: string
}

function getAllParentIds(nodes: TOCNode[], targetId: string, path: string[] = []): string[] {
  for (const node of nodes) {
    if (node.id === targetId) return path
    if (node.children.length > 0) {
      const found = getAllParentIds(node.children, targetId, [...path, node.id])
      if (found.length > 0) return found
    }
  }
  return []
}

function flattenSections(nodes: TOCNode[]): TOCNode[] {
  return nodes.flatMap(n => [n, ...flattenSections(n.children)])
}

export function TableOfContents({ sections, sectionIds, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [hoveredIds, setHoveredIds] = useState<Set<string>>(new Set())
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const allSections = flattenSections(sections)

  useEffect(() => {
    if (sectionIds.length === 0) return

    let ticking = false

    const updateActiveSection = () => {
      if (isScrollingRef.current) return
      
      const headings = document.querySelectorAll('.notion-h1, .notion-h2, .notion-h3')
      let lastVisible = ""
      
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 150) {
          const text = heading.textContent?.trim() || ""
          const section = allSections.find(s => s.label === text)
          if (section) lastVisible = section.id
        }
      }
      
      if (lastVisible && lastVisible !== activeId) {
        setActiveId(lastVisible)
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateActiveSection()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, allSections, activeId])

  const scrollExpandedIds = useMemo(() => 
    activeId ? new Set(getAllParentIds(sections, activeId)) : new Set<string>()
  , [activeId, sections])

  const scrollToSection = useCallback((label: string, id: string) => {
    const element = findHeadingByText(label)
    if (!element) return

    isScrollingRef.current = true
    setActiveId(id)

    const y = element.getBoundingClientRect().top + window.scrollY - 120
    smoothScrollTo(y, 600)

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 700)
  }, [])

  const handleMouseEnter = useCallback((id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    const parentIds = getAllParentIds(sections, id)
    setHoveredIds(new Set([...parentIds, id]))
  }, [sections])

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredIds(new Set()), 200)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  const isActiveOrHasActiveChild = useCallback((node: TOCNode): boolean => {
    if (node.id === activeId) return true
    return node.children.some(child => isActiveOrHasActiveChild(child))
  }, [activeId])

  const shouldExpand = useCallback((nodeId: string, node: TOCNode): boolean => {
    return scrollExpandedIds.has(nodeId) || isActiveOrHasActiveChild(node) || hoveredIds.has(nodeId)
  }, [scrollExpandedIds, isActiveOrHasActiveChild, hoveredIds])

  if (sections.length === 0) return null

  return (
    <nav className={className} aria-label="Table of contents">
      <h4 className="font-semibold mb-3 text-foreground text-sm tracking-wide uppercase">
        On this page
      </h4>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin" onMouseLeave={handleMouseLeave}>
        <ul className="border-l border-border/40">
          {sections.map((section) => (
            <TOCItem
              key={section.id}
              node={section}
              activeId={activeId}
              shouldExpand={shouldExpand}
              onMouseEnter={handleMouseEnter}
              onNavigate={scrollToSection}
              depth={0}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
}

interface TOCItemProps {
  node: TOCNode
  activeId: string
  shouldExpand: (nodeId: string, node: TOCNode) => boolean
  onMouseEnter: (id: string) => void
  onNavigate: (label: string, id: string) => void
  depth: number
}

function TOCItem({ node, activeId, shouldExpand, onMouseEnter, onNavigate, depth }: TOCItemProps) {
  const isActive = activeId === node.id
  const hasChildren = node.children.length > 0
  const isExpanded = shouldExpand(node.id, node)

  const indentClasses = ["pl-3", "pl-6", "pl-9"]
  const fontClasses = ["font-medium text-sm", "font-normal text-sm", "font-normal text-xs"]

  return (
    <li onMouseEnter={() => hasChildren && onMouseEnter(node.id)}>
      <button
        onClick={() => onNavigate(node.label, node.id)}
        className={`
          relative w-full text-left py-1.5 leading-snug transition-colors duration-150
          ${indentClasses[Math.min(depth, 2)]}
          ${fontClasses[Math.min(depth, 2)]}
          ${isActive ? "text-orange-500 font-medium" : "text-muted-foreground hover:text-foreground"}
        `}
      >
        {isActive && (
          <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-orange-500 rounded-full" />
        )}
        <span className="line-clamp-2">{node.label}</span>
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TOCItem
                key={child.id}
                node={child}
                activeId={activeId}
                shouldExpand={shouldExpand}
                onMouseEnter={onMouseEnter}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
