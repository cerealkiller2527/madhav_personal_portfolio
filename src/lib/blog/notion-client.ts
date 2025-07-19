import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"

const notion = new NotionAPI()

export class NotionBlogClient {
  private client: Client | null = null

  constructor() {
    if (process.env.NOTION_TOKEN) {
      this.client = new Client({
        auth: process.env.NOTION_TOKEN,
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

  async getDatabasePages(databaseId: string) {
    if (!this.client) {
      throw new Error("Notion client not initialized. Please check NOTION_TOKEN.")
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: "Published Date",
            direction: "descending",
          },
        ],
      })

      return response.results
    } catch (error) {
      console.error("Error fetching database pages:", error)
      throw new Error(`Failed to fetch database: ${databaseId}`)
    }
  }

  isConfigured(): boolean {
    return !!(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)
  }
}

export const notionClient = new NotionBlogClient()