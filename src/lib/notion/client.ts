/**
 * Unified Notion Client
 * Handles all Notion API operations for both blog and projects
 */

import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { 
  NotionPage, 
  NotionConfig, 
  NotionError, 
  NotionErrorCode
} from "@/types/notion-unified"

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
    } catch (error) {
      throw new NotionError(
        `Failed to fetch page: ${pageId}`,
        NotionErrorCode.NETWORK_ERROR,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  private async queryDatabase(
    databaseId: string,
    filter?: Record<string, unknown>,
    sorts?: Array<Record<string, unknown>>
  ): Promise<NotionPage[]> {
    if (!this.client) {
      throw new NotionError(
        "Notion client not initialized. Please check NOTION_TOKEN.",
        NotionErrorCode.CONFIGURATION_ERROR
      )
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      })

      return response.results as NotionPage[]
    } catch (error) {
      throw new NotionError(
        `Failed to query database: ${databaseId}`,
        NotionErrorCode.NETWORK_ERROR,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  async getPageWithCover(pageId: string): Promise<NotionPage> {
    if (!this.client) {
      throw new NotionError(
        "Notion client not initialized. Please check NOTION_TOKEN.",
        NotionErrorCode.CONFIGURATION_ERROR
      )
    }

    try {
      const page = await this.client.pages.retrieve({ page_id: pageId })
      return page as NotionPage
    } catch (error) {
      throw new NotionError(
        `Failed to fetch page with cover: ${pageId}`,
        NotionErrorCode.NETWORK_ERROR,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  // =============================================================================
  // BLOG METHODS
  // =============================================================================

  async getBlogContents(): Promise<NotionPage[]> {
    if (!this.config.blogDatabaseId) {
      throw new NotionError(
        "Blog database ID not configured",
        NotionErrorCode.CONFIGURATION_ERROR
      )
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
      throw new NotionError(
        "Projects database ID not configured",
        NotionErrorCode.CONFIGURATION_ERROR
      )
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
      throw new NotionError(
        "Projects database ID not configured",
        NotionErrorCode.CONFIGURATION_ERROR
      )
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