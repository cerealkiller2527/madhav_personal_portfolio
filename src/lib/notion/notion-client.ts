// Notion client - handles all Notion API operations
// Updated for Notion API version 2025-09-03 with data source support

import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { NotionPage, NotionConfig } from "@/lib/schemas"

// ============================================================================
// Type Definitions for Notion API 2025-09-03
// ============================================================================

/** Single property filter condition */
interface PropertyFilter {
  property: string
  checkbox?: { equals: boolean }
}

/** Compound filter with AND/OR conditions */
type DataSourceFilter = PropertyFilter | {
  and: PropertyFilter[]
} | {
  or: PropertyFilter[]
}

/** Sort configuration for queries */
interface DataSourceSort {
  property: string
  direction: "ascending" | "descending"
}

/** Data source object returned from database retrieval */
interface DataSource {
  id: string
  name: string
}

/** Response from GET /databases/{id} endpoint */
interface DatabaseResponse {
  object: "database"
  id: string
  data_sources?: DataSource[]
}

/** Response from POST /data_sources/{id}/query endpoint */
interface DataSourceQueryResponse {
  object: "list"
  results: NotionPage[]
  has_more: boolean
  next_cursor: string | null
}

export class UnifiedNotionClient {
  private readonly client: Client | null = null
  private readonly notionAPI = new NotionAPI()
  private readonly config: NotionConfig
  private readonly dataSourceCache: Map<string, string> = new Map()

  constructor(config?: Partial<NotionConfig>) {
    this.config = {
      token: config?.token || process.env.NOTION_TOKEN,
      blogDatabaseId: config?.blogDatabaseId || process.env.NOTION_DATABASE_ID,
      projectsDatabaseId: config?.projectsDatabaseId || process.env.NOTION_PROJECTS_DATABASE_ID,
    }

    if (this.config.token) {
      this.client = new Client({ 
        auth: this.config.token,
        notionVersion: "2025-09-03"
      })
    }
  }


  async getPage(pageId: string): Promise<ExtendedRecordMap> {
    try {
      return await this.notionAPI.getPage(pageId)
    } catch {
      throw new Error(`Failed to fetch page: ${pageId}`)
    }
  }

  /**
   * Fetches the data source ID for a given database ID
   * Caches the result to avoid repeated API calls
   */
  private async getDataSourceId(databaseId: string): Promise<string | null> {
    if (!this.client) return null

    // Check cache first
    if (this.dataSourceCache.has(databaseId)) {
      return this.dataSourceCache.get(databaseId)!
    }

    try {
      // Use the new Get Database endpoint to retrieve data sources
      const response = await this.client.request({
        method: "get",
        path: `databases/${databaseId}`
      }) as DatabaseResponse

      const dataSourceId = response.data_sources?.[0]?.id
      
      if (dataSourceId) {
        this.dataSourceCache.set(databaseId, dataSourceId)
        return dataSourceId
      }
      
      return null
    } catch (error) {
      console.error(`Failed to get data source ID for database ${databaseId}:`, error)
      return null
    }
  }

  /**
   * Queries a data source using the new 2025-09-03 API
   */
  private async queryDataSource(
    databaseId: string,
    filter?: DataSourceFilter,
    sorts?: DataSourceSort[]
  ): Promise<NotionPage[]> {
    if (!this.client) return []

    try {
      // First, get the data source ID for this database
      const dataSourceId = await this.getDataSourceId(databaseId)
      
      if (!dataSourceId) {
        console.error(`No data source found for database ${databaseId}`)
        return []
      }

      // Query the data source using the new endpoint
      const response = await this.client.request({
        method: "post",
        path: `data_sources/${dataSourceId}/query`,
        body: {
        filter,
          sorts
        }
      }) as DataSourceQueryResponse

      return response.results
    } catch (error) {
      console.error(`Failed to query data source for database ${databaseId}:`, error)
      return []
    }
  }


  async getBlogContents(): Promise<NotionPage[]> {
    if (!this.config.blogDatabaseId) return []
    
    return this.queryDataSource(
      this.config.blogDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  async getProjects(): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) return []
    
    return this.queryDataSource(
      this.config.projectsDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  isBlogConfigured(): boolean {
    return !!(this.config.token && this.config.blogDatabaseId)
  }

  isProjectsConfigured(): boolean {
    return !!(this.config.token && this.config.projectsDatabaseId)
  }
}


export const notionClient = new UnifiedNotionClient()
export default notionClient
