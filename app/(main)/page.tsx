import { Suspense } from "react"
import { getProjects, getExperiences } from "@/lib/api"
import HomePageClient from "./_components/home-page-client"
import Loading from "./loading"

/**
 * The main portfolio page, acting as a Server Component.
 * It fetches initial data and passes it to the client-side wrapper
 * to handle interactivity. This pattern optimizes for performance by
 * rendering static parts on the server.
 */
export default async function PortfolioPage() {
  // Fetch data on the server, in parallel.
  const [projects, experiences] = await Promise.all([getProjects(), getExperiences()])

  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient projects={projects} experiences={experiences} />
    </Suspense>
  )
}
