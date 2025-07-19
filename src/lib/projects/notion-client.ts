import { BaseNotionClient } from "@/lib/notion/base-client"

export class NotionProjectsClient extends BaseNotionClient {
  constructor() {
    super()
  }

  async getProjects(databaseId: string) {
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

  async getProjectsByCategory(databaseId: string, category: string) {
    const filter = {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Category",
          select: {
            equals: category,
          },
        },
      ],
    }

    const sorts = [
      {
        property: "Published Date",
        direction: "descending" as const,
      },
    ]

    return this.getDatabasePages(databaseId, filter, sorts)
  }

  async getFeaturedProjects(databaseId: string, limit: number = 4) {
    const filter = {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
      ],
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
    return !!(process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID)
  }
}

export const notionProjectsClient = new NotionProjectsClient()