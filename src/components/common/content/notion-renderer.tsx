'use client'

import dynamic from "next/dynamic"
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x"
import { ExtendedRecordMap, CodeBlock } from "notion-types"

const ShikiCode = dynamic(
  () => import("react-notion-x-code-block").then((m) => m.Code),
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
  return (
    <div className={className}>
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
    </div>
  )
}
