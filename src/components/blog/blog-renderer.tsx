'use client'

import { NotionRenderer } from "react-notion-x"
import { ExtendedRecordMap } from "notion-types"

// Custom Collection component to suppress warnings
const Collection = () => {
  return (
    <div className="notion-collection-placeholder p-4 my-4 border rounded-lg bg-muted/50">
      <p className="text-sm text-muted-foreground">
        Collection view is not supported in this preview
      </p>
    </div>
  )
}

interface BlogRendererProps {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  className?: string
}

export function BlogRenderer({ recordMap, rootPageId, className }: BlogRendererProps) {
  return (
    <div className={className}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false} // Will be controlled by our theme system
        rootPageId={rootPageId}
        previewImages
        showCollectionViewDropdown={false}
        showTableOfContents={false}
        minTableOfContentsItems={3}
        defaultPageIcon="📄"
        defaultPageCover=""
        defaultPageCoverPosition={0.5}
        className="notion-page"
        bodyClassName="notion-page-body"
        components={{
          Collection,
        }}
        // Optional: Custom map for page URLs
        // mapPageUrl={(pageId) => `/blog/${pageId}`}
        // Optional: Custom map for image URLs
        // mapImageUrl={(url, block) => url}
      />
    </div>
  )
}