import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getAllProjects, getProjectById } from "@/lib/notion/notion-service"
import ProjectDetailPage from "./project-detail"
import type { Project, TechStackItem } from "@/lib/schemas/project.schemas"
import type { ProjectContent as NotionProject } from "@/lib/schemas"
import { LogoSpinner } from "@/components/common/ui/logo-spinner"

function transformNotionToLocalProject(notionProject: NotionProject): Project & { coverImage?: string; recordMap?: NotionProject['recordMap'] } {
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
    coverImage: notionProject.coverImage || notionProject.heroImage || "/assets/placeholders/placeholder-logo.svg",
    gallery: notionProject.gallery || [],
    detailedDescription: notionProject.description || "",
    vectaryEmbedUrl: notionProject.vectaryEmbedUrl,
    keyFeatures: notionProject.keyFeatures || [],
    techStack: notionProject.techStack as TechStackItem[] || [],
    recordMap: notionProject.recordMap,
  }
}

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProjectData(id: string) {
  try {
    const notionProject = await getProjectById(id)
    if (notionProject) {
      return transformNotionToLocalProject(notionProject)
    }
    
    const allNotionProjects = await getAllProjects()
    const foundProject = allNotionProjects.find(p => p.id === id || p.slug === id)
    if (foundProject) {
      const fullProject = await getProjectById(foundProject.id)
      if (fullProject) {
        return transformNotionToLocalProject(fullProject)
      }
    }
  } catch (error) {
    console.error('Failed to fetch project from Notion:', error)
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

export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const notionProjects = await getAllProjects()
    if (notionProjects && notionProjects.length > 0) {
      console.log(`Found ${notionProjects.length} Notion projects for static generation`)
      return notionProjects.map((project) => ({
        id: project.id,
      }))
    }
    
    console.log('No projects found for static generation')
    return []
  } catch (error) {
    console.error('Error in generateStaticParams for projects:', error)
    return []
  }
}

async function getAllProjectsWithOrder(): Promise<Project[]> {
  try {
    const notionProjects = await getAllProjects()
    if (notionProjects && notionProjects.length > 0) {
      const transformedProjects = await Promise.all(
        notionProjects.map(async (preview) => {
          try {
            const fullProject = await getProjectById(preview.id)
            if (fullProject) {
              return transformNotionToLocalProject(fullProject)
            } else {
              const projectFromPreview: NotionProject = {
                ...preview,
                keyFeatures: [],
                techStack: [],
                gallery: [],
                updatedAt: preview.publishedAt,
                recordMap: undefined,
              }
              return transformNotionToLocalProject(projectFromPreview)
            }
          } catch {
            // Transform preview to local project structure
            const projectFromPreview: NotionProject = {
              ...preview,
              keyFeatures: [],
              techStack: [],
              gallery: [],
              updatedAt: preview.publishedAt,
              recordMap: undefined,
            }
            return transformNotionToLocalProject(projectFromPreview)
          }
        })
      )
      return transformedProjects
    }
  } catch (error) {
    console.error('Failed to fetch projects for navigation:', error)
  }
  
  return []
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
        project={project}
        previousProject={previousProject}
        nextProject={nextProject}
      />
    </Suspense>
  )
}