import { Suspense } from "react"
import { projects as localProjects, experiences } from "@/lib/core/data"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import HomePage from "@/components/pages/home/home-page"
import Loading from "./loading"
import type { Project, ProjectContent } from "@/lib/schemas"

export const revalidate = 60

// Transform Notion project to local project structure
function transformNotionToLocalProject(notionProject: ProjectContent): Project {
  return {
    id: notionProject.id,
    title: notionProject.title,
    subtitle: notionProject.subtitle,
    description: notionProject.description || "",
    category: notionProject.category,
    award: notionProject.award,
    awardRank: notionProject.awardRank,
    stats: notionProject.stats || [],
    tags: notionProject.tags,
    liveLink: notionProject.liveLink,
    githubLink: notionProject.githubLink,
    heroImage: notionProject.heroImage || "/placeholder.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    vectaryEmbedUrl: notionProject.vectaryEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    techStack: notionProject.techStack as any || [],
    recordMap: notionProject.recordMap,
  }
}

export default async function PortfolioPage() {
  const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
  let projects: readonly Project[] = localProjects
  
  if (useNotionProjects) {
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
    } catch {
      // Use local projects on error
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
