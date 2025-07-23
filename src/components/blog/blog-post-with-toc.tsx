"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { BlogContent } from "@/schemas"
import type { ExtendedRecordMap } from "notion-types"
import { BlogRenderer } from "@/components/blog/blog-renderer"
import { BlogHeader } from "@/components/blog/blog-header"
import { BlogNavigation } from "@/components/blog/blog-navigation"
import { Button } from "@/components/ui/button"
import { EnhancedTableOfContents } from "@/components/ui/enhanced-table-of-contents"

interface BlogContentWithTOCProps {
  post: BlogContent
  previousPost?: BlogContent
  nextPost?: BlogContent
}

// Extract headings from Notion recordMap to generate TOC
function extractHeadings(recordMap: ExtendedRecordMap | undefined): { id: string; label: string; level: number }[] {
  const headings: { id: string; label: string; level: number }[] = []
  
  if (!recordMap?.block) return headings

  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = (block as { value?: { type?: string; properties?: { title?: string[][] } } })?.value
    if (!blockValue) continue

    const { type, properties } = blockValue
    
    // Check if it's a heading block
    if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
      const title = properties?.title?.[0]?.[0] || ''
      if (title) {
        // Generate a URL-friendly ID from the title
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        
        const level = type === 'header' ? 1 : type === 'sub_header' ? 2 : 3
        
        headings.push({
          id: id || blockId,
          label: title,
          level
        })
      }
    }
  }

  return headings
}

export function BlogContentWithTOC({ post, previousPost, nextPost }: BlogContentWithTOCProps) {
  const contentRef = useRef<HTMLElement>(null)
  const headings = extractHeadings(post.recordMap)
  
  // Only show TOC if there are headings and it's a longer post
  const showTOC = headings.length >= 2

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className={`grid gap-12 ${showTOC ? 'lg:grid-cols-5' : ''}`}>
            {/* Table of Contents - Desktop Only */}
            {showTOC && (
              <aside className="hidden lg:block lg:col-span-1 py-8">
                <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <EnhancedTableOfContents 
                    sections={headings.map(h => ({ id: h.id, label: h.label, level: h.level }))}
                    containerRef={contentRef as React.RefObject<HTMLElement>}
                  />
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className={`${showTOC ? 'lg:col-span-4' : ''}`} ref={contentRef}>
              <article>
                <BlogHeader 
                  post={post}
                  author={{
                    name: "Madhav Lodha",
                    avatar: "/assets/portfolio/avatar-logo.png"
                  }}
                  readingTime={post.description?.split(' ').length ? Math.ceil(post.description.split(' ').length / 200) : undefined}
                />

                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <BlogRenderer recordMap={post.recordMap} />
                </div>
              </article>

              <BlogNavigation 
                previousPost={previousPost}
                nextPost={nextPost}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}