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
  private readonly notionAPI = new NotionAPI() // For fetching full page content
  private readonly config: NotionConfig

  constructor(config?: Partial<NotionConfig>) {
    // Set defaults from environment or provided config
    this.config = {
      token: config?.token || process.env.NOTION_TOKEN,
      blogDatabaseId: config?.blogDatabaseId || process.env.NOTION_DATABASE_ID,
      projectsDatabaseId: config?.projectsDatabaseId || process.env.NOTION_PROJECTS_DATABASE_ID,
      revalidateTime: config?.revalidateTime || 60,
      enableCache: config?.enableCache ?? true,
      cacheMaxSize: config?.cacheMaxSize || 100
    }

    // Only initialize client if token is provided
    if (this.config.token) {
      this.client = new Client({ auth: this.config.token })
    }
  }

  // =============================================================================
  // CORE METHODS
  // =============================================================================

  async getPage(pageId: string): Promise<ExtendedRecordMap> {
    try {
      // Fetches full page content including blocks
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
    // Return empty array if client not initialized
    if (!this.client) return []

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      })
      return response.results as NotionPage[]
    } catch {
      // Gracefully handle API errors
      return []
    }
  }

  // =============================================================================
  // DATABASE METHODS
  // =============================================================================

  async getBlogContents(): Promise<NotionPage[]> {
    if (!this.config.blogDatabaseId) return []
    
    // Only fetch published posts, sorted by date
    return this.queryDatabase(
      this.config.blogDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  async getProjects(): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) return []
    
    // Only fetch published projects, sorted by date
    return this.queryDatabase(
      this.config.projectsDatabaseId,
      { property: "Published", checkbox: { equals: true } },
      [{ property: "Published Date", direction: "descending" }]
    )
  }

  async getFeaturedProjects(limit: number = 4): Promise<NotionPage[]> {
    if (!this.config.projectsDatabaseId) return []

    // Fetch projects marked as both published AND featured
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
    // Check if both token and blog database ID are set
    return !!(this.config.token && this.config.blogDatabaseId)
  }

  isProjectsConfigured(): boolean {
    // Check if both token and projects database ID are set
    return !!(this.config.token && this.config.projectsDatabaseId)
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

// Export single instance for consistent state across app
export const notionClient = new UnifiedNotionClient()
export default notionClient