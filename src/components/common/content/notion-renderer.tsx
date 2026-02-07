'use client'

import { useRef, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x"
import { ExtendedRecordMap, CodeBlock } from "notion-types"

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
    const bookmarks = container.querySelectorAll<HTMLAnchorElement>("a.notion-bookmark")
    bookmarks.forEach((anchor) => {
      const href = anchor.getAttribute("href") || ""
      if (href.includes(TOMO_BOOKMARK_URL)) {
        const wrapper = anchor.closest(".notion-row") || anchor.parentElement
        if (wrapper) {
          ;(wrapper as HTMLElement).style.display = "none"
        }
      }
    })
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
      {hasTomoBookmark && <TomoGame />}
    </div>
  )
}
