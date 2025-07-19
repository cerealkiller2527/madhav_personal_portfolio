'use client'

import { NotionRenderer } from "react-notion-x"
import { ExtendedRecordMap } from "notion-types"

// Optional: Import additional components for rich content
// import { Code } from 'react-notion-x/build/third-party/code'
// import { Collection } from 'react-notion-x/build/third-party/collection'
// import { Equation } from 'react-notion-x/build/third-party/equation'
// import { Modal } from 'react-notion-x/build/third-party/modal'
// import { Pdf } from 'react-notion-x/build/third-party/pdf'

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
        // Optional: Add custom components
        // components={{
        //   Code,
        //   Collection,
        //   Equation,
        //   Modal,
        //   Pdf,
        // }}
        // Optional: Custom map for page URLs
        // mapPageUrl={(pageId) => `/blog/${pageId}`}
        // Optional: Custom map for image URLs
        // mapImageUrl={(url, block) => url}
      />
    </div>
  )
}