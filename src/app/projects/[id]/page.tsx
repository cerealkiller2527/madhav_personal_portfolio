import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { projects as localProjects } from "@/lib/core/data"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import ProjectDetailPage from "./project-detail"
import type { Project } from "@/lib/schemas/project.schemas"
import type { ProjectContent as NotionProject } from "@/lib/schemas"
import { LogoSpinner } from "@/components/common/ui/logo-spinner"

// Add revalidation for ISR
export const revalidate = 60

// Transform Notion project to local project structure (shared with homepage)
function transformNotionToLocalProject(notionProject: NotionProject): Project & { coverImage?: string } {
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
    heroImage: notionProject.heroImage || "/assets/placeholders/placeholder-logo.svg",
    // Preserve coverImage for navigation components
    coverImage: notionProject.coverImage || notionProject.heroImage || "/assets/placeholders/placeholder-logo.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "", // Use description as fallback
    vectaryEmbedUrl: notionProject.vectaryEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    techStack: notionProject.techStack as any || [],
    // Preserve recordMap for Notion content rendering
    recordMap: notionProject.recordMap,
  }
}

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProjectData(id: string) {
  // First try to get project from Notion
  const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
  
  if (useNotionProjects) {
    try {
      // Try to get full Notion project with content
      const notionProject = await getProjectById(id)
      if (notionProject) {
        return transformNotionToLocalProject(notionProject)
      }
      
      // If not found by ID, try to get from projects list (in case of slug mismatch)
      const allNotionProjects = await getAllProjects()
      const foundProject = allNotionProjects.find(p => p.id === id || p.slug === id)
      if (foundProject) {
        const fullProject = await getProjectById(foundProject.id)
        if (fullProject) {
          return transformNotionToLocalProject(fullProject)
        }
      }
    } catch {
      // Failed to fetch Notion project, will try local data
    }
  }
  
  // Fallback to local project data
  const localProject = localProjects.find((p) => p.id === id)
  if (localProject) {
    return localProject
  }
  
  return null
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectData(id)
  
  if (!project) {
    return {
      title: "Project Not Found - Madhav Lodha",
      description: "The requested project could not be found.",
    }
  }
  
  return {
    title: `${project.title} - Projects - Madhav Lodha`,
    description: project.description || project.subtitle || "Project by Madhav Lodha",
    openGraph: {
      title: project.title,
      description: project.description || project.subtitle || "Project by Madhav Lodha",
      type: "article",
      ...(project.heroImage && { images: [project.heroImage] }),
    },
  }
}

// Generate static params for ISR
export async function generateStaticParams() {
  try {
    // Try to get Notion projects first
    const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
    
    if (useNotionProjects) {
      try {
        const notionProjects = await getAllProjects()
        if (notionProjects && notionProjects.length > 0) {
          return notionProjects.map((project) => ({
            id: project.id,
          }))
        }
      } catch {
        // Failed to generate static params from Notion, using local data
      }
    }
    
    // Fallback to local projects
    return localProjects.map((project) => ({
      id: project.id,
    }))
  } catch {
    return []
  }
}

async function getAllProjectsWithOrder(): Promise<Project[]> {
  // Check if Notion projects should be used (environment flag)
  const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
  
  if (useNotionProjects) {
    try {
      const notionProjects = await getAllProjects()
      if (notionProjects && notionProjects.length > 0) {
        // Transform all Notion projects to local project structure for consistency
        const transformedProjects = await Promise.all(
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
                  recordMap: undefined, // Empty recordMap for preview fallback
                }
                return transformNotionToLocalProject(fallbackProject)
              }
            } catch {
              // Fallback: transform preview to local project structure
              const fallbackProject: NotionProject = {
                ...preview,
                keyFeatures: [],
                techStack: [],
                gallery: [],
                updatedAt: preview.publishedAt,
                recordMap: undefined, // Empty recordMap for preview fallback
              }
              return transformNotionToLocalProject(fallbackProject)
            }
          })
        )
        return transformedProjects
      }
    } catch {
      // Failed to fetch Notion projects for navigation, using local data
    }
  }
  
  // Fallback to local projects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return localProjects as any
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const [project, allProjects] = await Promise.all([
    getProjectData(id),
    getAllProjectsWithOrder()
  ])
  
  if (!project) {
    notFound()
  }
  
  // Find previous and next projects
  const currentIndex = allProjects.findIndex((p: Project) => p.id === id)
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : undefined
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : undefined
  
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <div className="flex items-center justify-center py-32">
          <LogoSpinner size="xl" showText text="Loading project..." />
        </div>
      </div>
    }>
      <ProjectDetailPage 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        project={project as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        previousProject={previousProject as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nextProject={nextProject as any}
      />
    </Suspense>
  )
}