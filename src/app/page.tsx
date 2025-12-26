import { Suspense } from "react"
import { experiences } from "@/lib/core/data"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import HomePage from "@/components/pages/home/home-page"
import Loading from "./loading"
import type { Project, ProjectContent, TechStackItem } from "@/lib/schemas"

function transformNotionToLocalProject(notionProject: ProjectContent): Project & { recordMap?: ProjectContent['recordMap'] } {
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
    heroImage: notionProject.heroImage || notionProject.coverImage || "/assets/placeholders/placeholder-logo.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    sketchfabEmbedUrl: notionProject.sketchfabEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack as TechStackItem[] || [],
    recordMap: notionProject.recordMap,
  }
}

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
