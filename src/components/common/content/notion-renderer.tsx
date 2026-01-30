'use client'

import dynamic from "next/dynamic"
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x"
import { ExtendedRecordMap } from "notion-types"

const Code = dynamic(
  () => import("react-notion-x-code-block").then((m) => m.Code),
  { ssr: false }
)

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
        }}
      />
    </div>
  )
}
