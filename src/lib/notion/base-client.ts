import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"
import { NotionClientInterface } from "@/types/notion"

const notion = new NotionAPI()

export class BaseNotionClient implements NotionClientInterface {
  protected client: Client | null = null

  constructor(token?: string) {
    const notionToken = token || process.env.NOTION_TOKEN
    if (notionToken) {
      this.client = new Client({
        auth: notionToken,
      })
    }
  }

  async getPage(pageId: string): Promise<ExtendedRecordMap> {
    try {
      const recordMap = await notion.getPage(pageId)
      return recordMap
    } catch (error) {
      console.error("Error fetching page from Notion:", error)
      throw new Error(`Failed to fetch page: ${pageId}`)
    }
  }

  async getDatabasePages(databaseId: string, filter?: Record<string, unknown>, sorts?: Array<Record<string, unknown>>) {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      })

      return response.results
    } catch (error) {
      console.error("Error fetching database pages:", error)
      throw new Error(`Failed to fetch database: ${databaseId}`)
    }
  }

  async getPageWithCover(pageId: string) {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }

    try {
      const page = await this.client.pages.retrieve({ page_id: pageId })
      return page
    } catch (error) {
      console.error("Error fetching page with cover:", error)
      throw new Error(`Failed to fetch page with cover: ${pageId}`)
    }
  }

  isConfigured(): boolean {
    return !!this.client
  }

  protected getClient(): Client {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }
    return this.client
  }
}