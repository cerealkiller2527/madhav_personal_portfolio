import { Suspense } from "react"
import { experiences } from "@/lib/core/data"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import HomePage from "@/components/pages/home/home-page"
import Loading from "./loading"
import { transformNotionToLocalProject } from "@/lib/utils/project-utils"
import type { Project } from "@/lib/schemas"

export default async function PortfolioPage() {
  let projects: readonly Project[] = []
  
  try {
    const notionProjects = await getAllProjects()
    if (notionProjects?.length > 0) {
      const fullProjects = await Promise.all(
        notionProjects.map(async (preview) => {
          const fullProject = await getProjectById(preview.id)
          return fullProject ? transformNotionToLocalProject(fullProject) : null
        })
      )
      projects = fullProjects.filter(Boolean) as Project[]
    }
  } catch (error) {
    console.error('Failed to fetch projects from Notion:', error)
    projects = []
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
