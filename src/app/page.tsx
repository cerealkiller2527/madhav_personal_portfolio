import { Suspense } from "react"
import { projects as localProjects, experiences } from "@/lib/data"
import { getAllProjects, getProjectById } from "@/lib/notion"
import HomePage from "@/components/pages/home-page"
import Loading from "./loading"
import type { Project } from "@/types/portfolioTypes"
import type { NotionProject } from "@/types/projectTypes"

// Add revalidation for ISR
export const revalidate = 60

// Transform Notion project to local project structure
function transformNotionToLocalProject(notionProject: NotionProject): Project {
  return {
    id: notionProject.id,
    title: notionProject.title,
    subtitle: notionProject.subtitle,
    description: notionProject.description,
    category: notionProject.category,
    award: notionProject.award,
    awardRank: notionProject.awardRank,
    stats: notionProject.stats || [],
    tags: notionProject.tags,
    liveLink: notionProject.liveLink,
    githubLink: notionProject.githubLink,
    heroImage: notionProject.heroImage || "/placeholder.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description, // Use description as fallback
    vectaryEmbedUrl: notionProject.vectaryEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack || [],
    // Preserve recordMap for Notion content rendering
    recordMap: notionProject.recordMap,
  }
}

/**
 * The main portfolio page, acting as a Server Component.
 * Fetches projects from Notion if configured, otherwise uses local data.
 * This pattern optimizes for performance while enabling dynamic content.
 */
export default async function PortfolioPage() {
  // Check if Notion projects should be used (environment flag)
  const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
  let projects: Project[] = localProjects
  
  if (useNotionProjects) {
    try {
      // First get the project previews
      const notionProjects = await getAllProjects()
      if (notionProjects && notionProjects.length > 0) {
        // Now fetch full project data with recordMap for each project
        const fullProjects = await Promise.all(
          notionProjects.map(async (preview) => {
            try {
              const fullProject = await getProjectById(preview.id)
              if (fullProject) {
                return transformNotionToLocalProject(fullProject)
              } else {
                // Fallback: transform preview to local project structure
                const fallbackProject: NotionProject = {
                  ...preview,
                  keyFeatures: [],
                  techStack: [],
                  gallery: [],
                  updatedAt: preview.publishedAt,
                  recordMap: {} as any, // Empty recordMap for preview fallback
                }
                return transformNotionToLocalProject(fallbackProject)
              }
            } catch (error) {
              // Fallback: transform preview to local project structure
              const fallbackProject: NotionProject = {
                ...preview,
                keyFeatures: [],
                techStack: [],
                gallery: [],
                updatedAt: preview.publishedAt,
                recordMap: {} as any, // Empty recordMap for preview fallback
              }
              return transformNotionToLocalProject(fallbackProject)
            }
          })
        )
        
        projects = fullProjects
      }
    } catch (error) {
      // Failed to fetch Notion projects, fallback to local data
      console.error("Failed to fetch Notion projects:", error)
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
