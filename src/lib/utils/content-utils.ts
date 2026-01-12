// Content utility functions for HTML and Notion content detection

// Type for Notion block structure used in content detection
interface NotionBlockValue {
  type?: string
  properties?: Record<string, unknown>
}

interface NotionBlockWrapper {
  value?: NotionBlockValue
}

type NotionRecordMapBlock = Record<string, NotionBlockWrapper>

// Checks if HTML string has actual visible text content (not just empty tags)
export function hasTextContent(html: string | undefined): boolean {
  if (!html) return false
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
}

// Checks if Notion recordMap has meaningful visible content (not just empty blocks or page blocks)
export function hasNotionVisibleContent(
  recordMap: { block?: NotionRecordMapBlock } | undefined
): boolean {
  if (!recordMap?.block) return false
  
  const blocks = Object.values(recordMap.block)
  
  // Filter out page blocks and check if remaining blocks have content
  const contentBlocks = blocks.filter(b => {
    const type = b?.value?.type
    return type && type !== 'page'
  })
  
  if (contentBlocks.length === 0) return false
  
  // Check if any block has actual text properties
  return contentBlocks.some(b => {
    const props = b?.value?.properties
    if (!props) return false
    
    // Check title/content properties for text
    const titleProp = props.title as string[][] | undefined
    if (titleProp && Array.isArray(titleProp) && titleProp.length > 0) {
      const text = titleProp.map(t => t[0]).join('').trim()
      if (text.length > 0) return true
    }
    return false
  })
}
