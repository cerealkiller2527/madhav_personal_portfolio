// Main portfolio page - fetches and displays projects and experience

import { Suspense } from "react"
import { experiences } from "@/lib/core/data"
import { getAllProjects, getProjectById, getAllBlogPosts } from "@/lib/notion/notion-service"
import HomePage from "@/components/pages/home/home-page"
import Loading from "./loading"
import { transformNotionToLocalProject } from "@/lib/utils/project-utils"
import type { Project, BlogPreview } from "@/lib/types"

export default async function PortfolioPage() {
  let projects: readonly Project[] = []
  let blogPosts: readonly BlogPreview[] = []
  
  try {
    const [notionProjects, posts] = await Promise.all([
      getAllProjects(),
      getAllBlogPosts(),
    ])
    
    if (notionProjects?.length > 0) {
      const fullProjects = await Promise.all(
        notionProjects.map(async (preview) => {
          const fullProject = await getProjectById(preview.id)
          return fullProject ? transformNotionToLocalProject(fullProject) : null
        })
      )
      projects = fullProjects.filter(Boolean) as Project[]
    }
    
    blogPosts = posts || []
  } catch (error) {
    console.error('Failed to fetch content from Notion:', error)
    projects = []
    blogPosts = []
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} blogPosts={blogPosts} />
    </Suspense>
  )
}
