"use client"

import { useRef } from "react"  
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { BlogContent } from "@/lib/types"
import { NotionRenderer } from "@/components/common/content/notion-renderer"
import { BlogHeader } from "@/components/pages/blog/blog-header"
import { BlogNavigation } from "@/components/common/content/content-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableOfContents } from "@/components/common/content/table-of-contents"
import { useContentTOC } from "@/lib/hooks/use-content-toc"
import { Comments } from "@/components/common/comments"
import { siteInfo } from "@/lib/core/data"

interface BlogContentWithTOCProps {
  post: BlogContent
  previousPost?: BlogContent
  nextPost?: BlogContent
}

export function BlogContentWithTOC({ post, previousPost, nextPost }: BlogContentWithTOCProps) {
  const contentRef = useRef<HTMLElement>(null)
  const { sections, showTOC } = useContentTOC({ recordMap: post.recordMap })

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="glass" size="sm">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className={`grid gap-8 ${showTOC ? 'lg:grid-cols-5' : ''}`}>
            {/* Table of Contents - Desktop Only */}
            {showTOC && (
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28">
                  <Card variant="glass-subtle" className="p-4">
                    <ScrollArea className="max-h-[calc(100vh-10rem)]">
                      <TableOfContents 
                        sections={sections}
                        containerRef={contentRef}
                      />
                    </ScrollArea>
                  </Card>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className={showTOC ? 'lg:col-span-4' : ''} ref={contentRef}>
              <Card variant="glass" className="p-6 md:p-8">
                <article>
                  <BlogHeader 
                    post={post}
                    author={{
                      name: siteInfo.name,
                      avatar: siteInfo.avatarLogo
                    }}
                    readingTime={post.readingTime}
                  />

                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {post.recordMap && <NotionRenderer recordMap={post.recordMap} contentType="blog" />}
                  </div>
                </article>

                <BlogNavigation 
                  previousPost={previousPost}
                  nextPost={nextPost}
                />

                <Comments />
              </Card>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
