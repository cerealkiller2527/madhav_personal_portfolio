import { Suspense } from "react"
import { projects, experiences } from "@/lib/data"
import HomePage from "@/components/pages/home-page"
import Loading from "./loading"

/**
 * The main portfolio page, acting as a Server Component.
 * It imports static data and passes it to the client-side wrapper
 * to handle interactivity. This pattern optimizes for performance by
 * rendering static parts on the server.
 */
export default function PortfolioPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage projects={projects} experiences={experiences} />
    </Suspense>
  )
}
