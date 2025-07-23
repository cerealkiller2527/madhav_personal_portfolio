/**
 * Unified Notion Client
 * Handles all Notion API operations for both blog and projects
 */

import { Client } from "@notionhq/client"
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionConfig
} from "@/schemas"

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
    return await this.notionAPI.getPage(pageId)
  }

  private async queryDatabase(
    databaseId: string,
    filter?: QueryDatabaseParameters["filter"],
    sorts?: QueryDatabaseParameters["sorts"]
  ): Promise<NotionPage[]> {
    if (!this.client) {
      return []
    }

    const response = await this.client.databases.query({
      database_id: databaseId,
      filter,
      sorts,
    })

    return response.results as NotionPage[]
  }

  async getPageWithCover(pageId: string): Promise<NotionPage | null> {
    if (!this.client) {
      return null
    }

    const page = await this.client.pages.retrieve({ page_id: pageId })
    return page as NotionPage
  }

  // =============================================================================
  // BLOG METHODS
  // =============================================================================

  async getBlogContents(): Promise<NotionPage[]> {
    if (!this.config.blogDatabaseId) {
      return []
    }

    const filter = {
      property: "Published",
      checkbox: { equals: true }
    }

    const sorts = [{
      property: "Published Date",
      direction: "descending" as const
    }]

    return this.queryDatabase(this.config.blogDatabaseId, filter, sorts)
  }

  // =============================================================================
  // PROJECT METHODS
  // =============================================================================

  async getProjects(): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) {
      return []
    }

    const filter = {
      property: "Published",
      checkbox: { equals: true }
    }

    const sorts = [{
      property: "Published Date",
      direction: "descending" as const
    }]

    return this.queryDatabase(this.config.projectsDatabaseId, filter, sorts)
  }

  async getFeaturedProjects(limit: number = 4): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) {
      return []
    }

    const filter = {
      and: [
        {
          property: "Published",
          checkbox: { equals: true }
        },
        {
          property: "Featured",
          checkbox: { equals: true }
        }
      ]
    }

    const sorts = [{
      property: "Published Date",
      direction: "descending" as const
    }]

    const pages = await this.queryDatabase(this.config.projectsDatabaseId, filter, sorts)
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

  isConfigured(): boolean {
    return !!this.config.token
  }

  getConfig(): NotionConfig {
    return { ...this.config }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const notionClient = new UnifiedNotionClient()
export default notionClient