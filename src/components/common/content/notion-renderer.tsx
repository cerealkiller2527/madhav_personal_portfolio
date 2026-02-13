'use client'

import { useRef, useEffect, useMemo, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x"
import { ExtendedRecordMap, CodeBlock } from "notion-types"
import { ImageLightbox } from "@/components/common/content/image-lightbox"

const ShikiCode = dynamic(
  () => import("react-notion-x-code-block").then((m) => m.Code),
  { ssr: false }
)

const TomoGame = dynamic(
  () => import("@/components/tomo").then((m) => m.TomoGame),
  { ssr: false }
)

function Code({ block }: { block: CodeBlock }) {
  const language = block.properties?.language?.[0]?.[0]?.toLowerCase()
  if (language === 'mermaid') return null
  return <ShikiCode block={block} />
}

function Collection() {
  return null
}

const TOMO_BOOKMARK_URL = "github.com/Ben-Santana/Tomo"

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  className?: string
  contentType?: 'blog' | 'project'
}

export function NotionRenderer({ 
  recordMap, 
  rootPageId, 
  className,
  contentType = 'blog'
}: NotionRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLElement | null>(null)
  const [portalReady, setPortalReady] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  const closeLightbox = useCallback(() => setLightboxImage(null), [])

  // Intercept clicks on Notion images to open custom lightbox instead of medium-zoom.
  // Uses capture phase so the event is caught before medium-zoom's handler.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== "IMG") return

      const notionBlock = target.closest(".notion-image, .notion-asset-wrapper")
      if (!notionBlock) return

      e.preventDefault()
      e.stopPropagation()

      const img = target as HTMLImageElement
      setLightboxImage({ src: img.src, alt: img.alt || "Image" })
    }

    container.addEventListener("click", handleClick, true)
    return () => container.removeEventListener("click", handleClick, true)
  }, [recordMap])

  const hasTomoBookmark = useMemo(() => {
    if (!recordMap?.block) return false
    return Object.values(recordMap.block).some((blockData) => {
      const block = (blockData as { value?: { type?: string; properties?: { link?: string[][] } } })?.value
      return (
        block?.type === "bookmark" &&
        block?.properties?.link?.[0]?.[0]?.includes(TOMO_BOOKMARK_URL)
      )
    })
  }, [recordMap])

  useEffect(() => {
    if (!hasTomoBookmark) return
    const container = containerRef.current
    if (!container) return

    // Already set up from a previous render — just make sure it's still in the DOM
    if (portalRef.current && container.contains(portalRef.current)) {
      setPortalReady(true)
      return
    }

    const bookmarks = container.querySelectorAll<HTMLAnchorElement>("a.notion-bookmark")
    for (const anchor of Array.from(bookmarks)) {
      const href = anchor.getAttribute("href") || ""
      if (href.includes(TOMO_BOOKMARK_URL)) {
        const wrapper = anchor.closest(".notion-row") || anchor.parentElement
        if (wrapper && wrapper.parentNode) {
          // Hide the bookmark (keep it in the DOM so React's reconciliation stays stable)
          ;(wrapper as HTMLElement).style.display = "none"

          // Insert our portal container right before the hidden bookmark
          const div = document.createElement("div")
          div.setAttribute("data-tomo-embed", "true")
          wrapper.parentNode.insertBefore(div, wrapper)

          portalRef.current = div
          setPortalReady(true)
          return
        }
      }
    }
  }, [recordMap, hasTomoBookmark])

  return (
    <div ref={containerRef} className={className}>
      <ReactNotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        rootPageId={rootPageId}
        previewImages
        showTableOfContents={false}
        className={`notion-${contentType}-page`}
        components={{
          Code,
          Collection,
        }}
      />
      {portalReady && portalRef.current && createPortal(<TomoGame />, portalRef.current)}

      <ImageLightbox
        src={lightboxImage?.src ?? ""}
        alt={lightboxImage?.alt ?? ""}
        isOpen={!!lightboxImage}
        onClose={closeLightbox}
      />
    </div>
  )
}
