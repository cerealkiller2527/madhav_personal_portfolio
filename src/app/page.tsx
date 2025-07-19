import { Suspense } from "react"
import { projects as localProjects, experiences } from "@/lib/data"
import { getAllProjects, getProjectById } from "@/lib/projects/project-queries"
import HomePage from "@/components/pages/home-page"
import Loading from "./loading"

// Add revalidation for ISR
export const revalidate = 60

/**
 * The main portfolio page, acting as a Server Component.
 * Fetches projects from Notion if configured, otherwise uses local data.
 * This pattern optimizes for performance while enabling dynamic content.
 */
export default async function PortfolioPage() {
  // Check if Notion projects should be used (environment flag)
  const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
  let projects = localProjects
  
  if (useNotionProjects) {
    try {
      // First get the project previews
      const notionProjects = await getAllProjects()
      if (notionProjects && notionProjects.length > 0) {
        console.log(`Successfully fetched ${notionProjects.length} projects`)
        
        // Now fetch full project data with recordMap for each project
        const fullProjects = await Promise.all(
          notionProjects.map(async (preview) => {
            try {
              const fullProject = await getProjectById(preview.id)
              if (fullProject) {
                console.log(`Successfully fetched project: ${preview.id}`)
                return fullProject
              } else {
                console.log(`❌ Failed to fetch full project data for: ${preview.id}`)
                // Fallback to preview data
                return {
                  ...preview,
                  detailedDescription: preview.description || "",
                  keyFeatures: [],
                  techStack: [],
                  gallery: [],
                  heroImage: preview.heroImage || "/placeholder.svg",
                  stats: preview.stats || [],
                }
              }
            } catch (error) {
              console.warn(`Error fetching full project ${preview.id}:`, error)
              // Fallback to preview data
              return {
                ...preview,
                detailedDescription: preview.description || "",
                keyFeatures: [],
                techStack: [],
                gallery: [],
                heroImage: preview.heroImage || "/placeholder.svg",
                stats: preview.stats || [],
              }
            }
          })
        )
        
        projects = fullProjects
        console.log(`Loaded ${projects.length} projects from Notion`)
      } else {
        console.log("No Notion projects found, using local data")
      }
    } catch (error) {
      console.warn("Failed to fetch Notion projects, using local data:", error)
    }
  } else {
    console.log("Notion projects not configured, using local data")
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
