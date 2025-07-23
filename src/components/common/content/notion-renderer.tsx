/**
 * Universal Notion Content Renderer
 * Meta Engineering Standards: DRY, configurable, performant
 * Handles Notion content for both Blog and Project domains
 */

'use client'

import { NotionRenderer as ReactNotionRenderer } from "react-notion-x"
import { ExtendedRecordMap } from "notion-types"

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
  const pageIcon = contentType === 'blog' ? "📄" : "🚀"
  const pageClassName = `notion-${contentType}-page`
  const bodyClassName = `notion-${contentType}-body`

  return (
    <div className={className}>
      <ReactNotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false} // Will be controlled by our theme system
        rootPageId={rootPageId}
        previewImages
        showCollectionViewDropdown={false}
        showTableOfContents={false}
        minTableOfContentsItems={3}
        defaultPageIcon={pageIcon}
        defaultPageCover=""
        defaultPageCoverPosition={0.5}
        className={pageClassName}
        bodyClassName={bodyClassName}
        components={{
          // Collection views will render with basic support
          // Advanced features like equations, code blocks work out of the box
        }}
      />
    </div>
  )
}