import { Suspense } from "react"
import { experiences } from "@/lib/core/data"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import HomePage from "@/components/pages/home/home-page"
import Loading from "./loading"
import type { Project, ProjectContent, TechStackItem } from "@/lib/schemas"

// Transform Notion project to local project structure
// Maps Notion's data format to our app's expected format
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
    // Fallback to placeholder if no image provided
    heroImage: notionProject.heroImage || notionProject.coverImage || "/assets/placeholders/placeholder-logo.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    vectaryEmbedUrl: notionProject.vectaryEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack as TechStackItem[] || [],
    recordMap: notionProject.recordMap, // Keep raw Notion data for rendering
  }
}

export default async function PortfolioPage() {
  let projects: readonly Project[] = []
  
  try {
    // Fetch project previews from Notion
    const notionProjects = await getAllProjects()
    if (notionProjects?.length > 0) {
      // Fetch full details for each project in parallel
      const fullProjects = await Promise.all(
        notionProjects.map(async (preview) => {
          const fullProject = await getProjectById(preview.id)
          return fullProject ? transformNotionToLocalProject(fullProject) : null
        })
      )
      // Filter out any failed fetches
      projects = fullProjects.filter(Boolean) as Project[]
    }
  } catch (error) {
    // Gracefully handle Notion API failures
    console.error('Failed to fetch projects from Notion:', error)
    projects = []
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
