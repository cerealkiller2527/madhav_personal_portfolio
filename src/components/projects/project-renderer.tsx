'use client'

import { NotionRenderer } from "react-notion-x"
import { ExtendedRecordMap } from "notion-types"

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
        // Custom styling for project content
        // This will integrate with our portfolio theme
      />
    </div>
  )
}