/**
 * Notion Client - Handles all Notion API operations
 */

import { Client } from "@notionhq/client"
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { NotionPage, NotionConfig } from "@/lib/schemas"

// =============================================================================
// NOTION CLIENT
// =============================================================================

export class UnifiedNotionClient {
  private readonly client: Client | null = null
  private readonly notionAPI = new NotionAPI()
  private readonly config: NotionConfig

  constructor(config?: Partial<NotionConfig>) {
    this.config = {
      token: config?.token || process.env.NOTION_TOKEN,
      blogDatabaseId: config?.blogDatabaseId || process.env.NOTION_DATABASE_ID,
      projectsDatabaseId: config?.projectsDatabaseId || process.env.NOTION_PROJECTS_DATABASE_ID,
      revalidateTime: config?.revalidateTime || 60,
      enableCache: config?.enableCache ?? true,
      cacheMaxSize: config?.cacheMaxSize || 100
    }

    if (this.config.token) {
      this.client = new Client({ auth: this.config.token })
    }
  }

  // =============================================================================
  // CORE METHODS
  // =============================================================================

  async getPage(pageId: string): Promise<ExtendedRecordMap> {
    try {
      return await this.notionAPI.getPage(pageId)
    } catch {
      throw new Error(`Failed to fetch page: ${pageId}`)
    }
  }

  private async queryDatabase(
    databaseId: string,
    filter?: QueryDatabaseParameters["filter"],
    sorts?: QueryDatabaseParameters["sorts"]
  ): Promise<NotionPage[]> {
    if (!this.client) return []

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      })
      return response.results as NotionPage[]
    } catch {
      return []
    }
  }

  // =============================================================================
  // DATABASE METHODS
  // =============================================================================

  async getBlogContents(): Promise<NotionPage[]> {
    if (!this.config.blogDatabaseId) return []
    
    return this.queryDatabase(
      this.config.blogDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  async getProjects(): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) return []
    
    return this.queryDatabase(
      this.config.projectsDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  async getFeaturedProjects(limit: number = 4): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) return []

    const pages = await this.queryDatabase(
      this.config.projectsDatabaseId,
      {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Featured", checkbox: { equals: true } }
        ]
      },
      [{ property: "Published Date", direction: "descending" }]
    )
    
    return pages.slice(0, limit)
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  isBlogConfigured(): boolean {
    return !!(this.config.token && this.config.blogDatabaseId)
  }

  isProjectsConfigured(): boolean {
    return !!(this.config.token && this.config.projectsDatabaseId)
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const notionClient = new UnifiedNotionClient()
export default notionClient