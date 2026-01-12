import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card variant="glass" className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Blog Post Not Found</h2>
          <p className="text-muted-foreground">
            The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}