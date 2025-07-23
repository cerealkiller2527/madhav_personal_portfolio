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

interface ProjectRendererProps {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  className?: string
}

export function ProjectRenderer({ recordMap, rootPageId, className }: ProjectRendererProps) {
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
        defaultPageIcon="🚀"
        defaultPageCover=""
        defaultPageCoverPosition={0.5}
        className="notion-project-page"
        bodyClassName="notion-project-body"
        components={{
          Collection,
        }}
      />
    </div>
  )
}