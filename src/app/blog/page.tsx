import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Madhav Lodha",
  description: "Thoughts on software engineering, web development, and technology.",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <p className="text-muted-foreground">
            Coming soon - blog posts will appear here once Notion is configured.
          </p>
        </div>
      </div>
    </div>
  )
}