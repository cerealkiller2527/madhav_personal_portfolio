import { ExtendedRecordMap } from "notion-types"

// Notion API Property Types
export interface NotionProperty {
  id: string
  type: string
}

export interface NotionTitleProperty extends NotionProperty {
  type: "title"
  title: Array<{
    type: "text"
    text: {
      content: string
      link?: {
        url: string
      } | null
    }
    annotations: {
      bold: boolean
      italic: boolean
      strikethrough: boolean
      underline: boolean
      code: boolean
      color: string
    }
    plain_text: string
    href?: string | null
  }>
}

export interface NotionRichTextProperty extends NotionProperty {
  type: "rich_text"
  rich_text: Array<{
    type: "text"
    text: {
      content: string
      link?: {
        url: string
      } | null
    }
    annotations: {
      bold: boolean
      italic: boolean
      strikethrough: boolean
      underline: boolean
      code: boolean
      color: string
    }
    plain_text: string
    href?: string | null
  }>
}

export interface NotionDateProperty extends NotionProperty {
  type: "date"
  date: {
    start: string
    end?: string | null
    time_zone?: string | null
  } | null
}

export interface NotionCheckboxProperty extends NotionProperty {
  type: "checkbox"
  checkbox: boolean
}

export interface NotionSelectProperty extends NotionProperty {
  type: "select"
  select: {
    id: string
    name: string
    color: string
  } | null
}

export interface NotionMultiSelectProperty extends NotionProperty {
  type: "multi_select"
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
}

export interface NotionFilesProperty extends NotionProperty {
  type: "files"
  files: Array<{
    name: string
    type: "external" | "file"
    external?: {
      url: string
    }
    file?: {
      url: string
      expiry_time: string
    }
  }>
}

export type NotionPropertyValue = 
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionDateProperty
  | NotionCheckboxProperty
  | NotionSelectProperty
  | NotionMultiSelectProperty
  | NotionFilesProperty

export interface NotionPage {
  object: "page"
  id: string
  created_time: string
  last_edited_time: string
  created_by: {
    object: "user"
    id: string
  }
  last_edited_by: {
    object: "user"
    id: string
  }
  cover: {
    type: "external" | "file"
    external?: {
      url: string
    }
    file?: {
      url: string
      expiry_time: string
    }
  } | null
  icon: {
    type: "emoji" | "external" | "file"
    emoji?: string
    external?: {
      url: string
    }
    file?: {
      url: string
      expiry_time: string
    }
  } | null
  parent: {
    type: "database_id" | "page_id" | "workspace"
    database_id?: string
    page_id?: string
    workspace?: boolean
  }
  archived: boolean
  properties: Record<string, NotionPropertyValue>
  url: string
  public_url?: string | null
}

export interface NotionDatabaseQueryResponse {
  object: "list"
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
  type: "page_or_database"
  page_or_database: Record<string, string | number | boolean | null>
}

// Notion Client Types
export interface NotionClientConfig {
  auth?: string
  baseUrl?: string
  timeoutMs?: number
  retryConfig?: {
    maxRetries: number
    baseDelay: number
    maxDelay: number
  }
}

export interface NotionClientInterface {
  isConfigured(): boolean
  getDatabasePages(databaseId: string): Promise<NotionPage[]>
  getPage(pageId: string): Promise<ExtendedRecordMap>
}

// Error Types
export class NotionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message)
    this.name = "NotionError"
  }
}

export class NotionConfigurationError extends NotionError {
  constructor(message: string) {
    super(message, "NOTION_CONFIG_ERROR")
    this.name = "NotionConfigurationError"
  }
}

export class NotionAPIError extends NotionError {
  constructor(message: string, statusCode: number, response?: unknown) {
    super(message, "NOTION_API_ERROR", statusCode, response)
    this.name = "NotionAPIError"
  }
}