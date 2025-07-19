import { BaseNotionClient } from "./base-client"

export class NotionBlogClient extends BaseNotionClient {
  constructor() {
    super()
  }

  async getBlogPosts(databaseId: string) {
    const filter = {
      property: "Published",
      checkbox: {
        equals: true,
      },
    }

    const sorts = [
      {
        property: "Published Date", 
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  isConfigured(): boolean {
    return !!(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)
  }
}

export const notionBlogClient = new NotionBlogClient()