/**
 * Universal Notion Content Renderer
 *
 * Handles Notion content for both Blog and Project domains.
 * Provides custom component overrides to suppress warnings
 * for unsupported block types.
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

/**
 * No-op component for unsupported Notion block types.
 * Suppresses react-notion-x warnings for Collection/database views
 * and other unsupported blocks without breaking the render.
 */
const NoOpBlock = () => null

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
        darkMode={false}
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
          // Suppress warnings for Collection/database views
          Collection: NoOpBlock,
        }}
      />
    </div>
  )
}