import { NotionProject, NotionProjectPreview } from "@/types/projects"
import { NotionPage } from "@/types/notion"
import { withServerErrorHandling } from "@/lib/errors/server-error-handlers"
import { notionProjectsClient } from "./notion-client"
import { transformNotionPageToProject, transformNotionPageToProjectPreview } from "./project-transforms"
import { validateProjectEnvironment, sanitizeProjectPreview } from "./project-validation"
import { getCachedProjects, getCachedProject } from "./project-cache"

export async function getAllProjects(): Promise<NotionProjectPreview[]> {
  return withServerErrorHandling(
    () => getCachedProjects(async () => {
    // Validate environment first
    const envValidation = validateProjectEnvironment()
    if (!envValidation.isValid) {
      console.warn("Projects environment validation failed:", envValidation.errors)
      return []
    }

    if (!notionProjectsClient.isConfigured()) {
      console.warn("Notion projects not configured, returning empty projects")
      return []
    }

    try {
      const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID!
      const pages = await notionProjectsClient.getProjects(databaseId)
      
      const projects = pages
        .map((page: NotionPage) => {
          try {
            const preview = transformNotionPageToProjectPreview(page)
            return sanitizeProjectPreview(preview)
          } catch (error) {
            console.error("Error transforming project preview:", error)
            return null
          }
        })
        .filter(Boolean) as NotionProjectPreview[]

      console.log(`Successfully fetched ${projects.length} projects`)
      return projects
    } catch (error) {
      console.error("Error fetching projects:", error)
      throw new Error("Failed to fetch projects from Notion")
    }
  }),
    "fetch-all-projects",
    {
      maxRetries: 2,
      baseDelay: 1000,
      shouldRetry: (error) => !error.message.includes("configuration")
    }
  )
}

export async function getProjectBySlug(slug: string): Promise<NotionProject | null> {
  return withServerErrorHandling(
    () => getCachedProject(slug, async (slug: string) => {
    if (!notionProjectsClient.isConfigured()) {
      console.warn("Notion projects not configured, returning null for project")
      return null
    }

    try {
      const allProjects = await getAllProjects()
      const projectPreview = allProjects.find(project => project.slug === slug)
      
      if (!projectPreview) {
        console.warn(`Project with slug "${slug}" not found`)
        return null
      }

      const recordMap = await notionProjectsClient.getPage(projectPreview.id)
      const project = transformNotionPageToProject(projectPreview, recordMap)
      
      console.log(`Successfully fetched project: ${slug}`)
      return project
    } catch (error) {
      console.error(`Error fetching project with slug ${slug}:`, error)
      throw new Error(`Failed to fetch project: ${slug}`)
    }
  }),
    `fetch-project-${slug}`,
    {
      maxRetries: 2,
      baseDelay: 1000
    }
  )
}

export async function getProjectById(id: string): Promise<NotionProject | null> {
  return withServerErrorHandling(
    () => getCachedProject(id, async (id: string) => {
    if (!notionProjectsClient.isConfigured()) {
      console.warn("Notion projects not configured, returning null for project")
      return null
    }

    try {
      const allProjects = await getAllProjects()
      const projectPreview = allProjects.find(project => project.id === id)
      
      if (!projectPreview) {
        console.warn(`Project with id "${id}" not found`)
        return null
      }

      const recordMap = await notionProjectsClient.getPage(projectPreview.id)
      const project = transformNotionPageToProject(projectPreview, recordMap)
      
      console.log(`Successfully fetched project: ${id}`)
      return project
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error)
      throw new Error(`Failed to fetch project: ${id}`)
    }
  }),
    `fetch-project-${id}`,
    {
      maxRetries: 2,
      baseDelay: 1000
    }
  )
}

export async function getFeaturedProjects(limit: number = 4): Promise<NotionProjectPreview[]> {
  const allProjects = await getAllProjects()
  return allProjects.slice(0, limit)
}

export async function getProjectsByCategory(category: string): Promise<NotionProjectPreview[]> {
  const allProjects = await getAllProjects()
  return allProjects.filter(project => 
    project.category.toLowerCase() === category.toLowerCase()
  )
}

export async function getProjectsByTag(tag: string): Promise<NotionProjectPreview[]> {
  const allProjects = await getAllProjects()
  return allProjects.filter(project => 
    project.tags.some(projectTag => 
      projectTag.toLowerCase() === tag.toLowerCase()
    )
  )
}