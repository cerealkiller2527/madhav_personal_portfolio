import { getProjectById, getProjects } from "@/lib/api"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { TableOfContents } from "@/components/ui/table-of-contents"
import { ProjectNavigation } from "@/components/features/projects/project-navigation"
import { BackButton } from "@/components/ui/back-button"
import { ArrowLeft } from "lucide-react"

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Key Features" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "gallery", label: "Gallery" },
]

async function getProjectData(id: string) {
  const [project, allProjects] = await Promise.all([getProjectById(id), getProjects()])

  if (!project) {
    notFound()
  }

  const currentIndex = allProjects.findIndex((p) => p.id === project.id)
  const previousProject =
    allProjects.length > 1 ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length] : null
  const nextProject = allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : null

  return { project, previousProject, nextProject }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, previousProject, nextProject } = await getProjectData(params.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <aside className="hidden lg:block lg:col-span-1 py-16">
          <div className="sticky top-28">
            <div className="mb-8">
              <BackButton sectionId="projects" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </BackButton>
            </div>
            <TableOfContents sections={sections} />
          </div>
        </aside>

        <main className="lg:col-span-4 py-16">
          <div className="lg:hidden mb-8">
            <BackButton sectionId="projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </BackButton>
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-balance">{project.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{project.subtitle}</p>
            </header>

            <div id="overview" className="scroll-mt-28">
              <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden shadow-lg bg-secondary">
                <Image
                  src={project.heroImage || "/placeholder.svg"}
                  alt={`${project.title} hero image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
              <div
                className="prose dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
              />
            </div>

            {project.keyFeatures?.length > 0 && (
              <section id="features" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Key Features</h2>
                <ul className="space-y-6">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature.title}>
                      <p className="font-semibold text-lg text-foreground">{feature.title}</p>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.techStack?.length > 0 && (
              <section id="tech-stack" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech.name} variant="secondary" className="text-sm px-3 py-1">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {project.gallery?.length > 0 && (
              <section id="gallery" className="mt-12 scroll-mt-28">
                <h2 className="text-3xl font-bold mb-4 border-b pb-3">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative w-full h-56 rounded-md overflow-hidden bg-secondary">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ProjectNavigation previousProject={previousProject} nextProject={nextProject} />
          </article>
        </main>
      </div>
    </div>
  )
}
