import { notFound } from "next/navigation"
import { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: `${params.slug} - Blog - Madhav Lodha`,
    description: "Blog post content will be loaded from Notion.",
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Blog Post: {params.slug}</h1>
          <p className="text-muted-foreground">
            Blog post content will be loaded from Notion once configured.
          </p>
        </div>
      </div>
    </div>
  )
}