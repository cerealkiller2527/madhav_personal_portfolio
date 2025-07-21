// This file exports blog types from notion.schemas.ts to maintain backward compatibility
// Blog types are now managed as part of the Notion integration

export {
  // Blog schemas
  blogContentSchema,
  blogPreviewSchema,
  
  // Blog types
  type BlogContent,
  type BlogPreview
} from './notion.schemas'