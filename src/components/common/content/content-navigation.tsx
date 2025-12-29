// Navigation components for blog and project content

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentImage } from "@/components/common/content/content-image"
import type { BlogPreview, Project } from "@/lib/types"

interface NavigationItem {
  id: string
  title: string
  description?: string
  coverImage?: string
  heroImage?: string
  slug?: string
}

interface ContentNavigationProps<T extends NavigationItem> {
  previousItem?: T | null
  nextItem?: T | null
  contentType: 'blog' | 'project'
  allItemsLabel?: string
  allItemsHref?: string
}

function NavigationCard<T extends NavigationItem>({ 
  item, 
  direction, 
  contentType 
}: { 
  item: T
  direction: "left" | "right"
  contentType: 'blog' | 'project'
}) {
  const href = contentType === 'blog' 
    ? `/blog/${item.slug}` 
    : `/projects/${item.id}`

  // Use heroImage for projects, coverImage for blogs
  const imageUrl = item.heroImage || item.coverImage || ""

  return (
    <Link
      href={href}
      className="group flex items-center w-full max-w-sm md:w-96 p-6 gap-6 rounded-2xl border border-orange-200/20 dark:border-orange-400/20 bg-orange-50/10 dark:bg-orange-900/10 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-orange-400/40 hover:bg-orange-100/20 dark:hover:bg-orange-800/20 hover:shadow-orange-200/20 dark:hover:shadow-orange-400/20"
    >
      {direction === "left" ? (
        <>
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
            <ContentImage
              src={imageUrl}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              fallbackType={contentType}
            />
          </div>
          <div className="flex flex-col gap-3 flex-grow min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:-translate-x-1">
                <ArrowLeft className="h-3 w-3" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
                Previous
              </p>
            </div>
            <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
              <span className="block truncate">{item.title}</span>
            </h4>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 flex-grow min-w-0 text-right">
            <div className="flex items-center gap-3 justify-end">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
                Next
              </p>
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
            <h4 className="font-bold text-lg leading-tight text-foreground overflow-hidden">
              <span className="block truncate">{item.title}</span>
            </h4>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            )}
          </div>
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
            <ContentImage
              src={imageUrl}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              fallbackType={contentType}
            />
          </div>
        </>
      )}
    </Link>
  )
}

export function ContentNavigation<T extends NavigationItem>({ 
  previousItem, 
  nextItem, 
  contentType,
  allItemsLabel,
  allItemsHref
}: ContentNavigationProps<T>) {
  if (!previousItem && !nextItem) {
    return null
  }

  return (
    <div className="mt-24 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          {previousItem ? (
            <NavigationCard item={previousItem} direction="left" contentType={contentType} />
          ) : (
            <div className="hidden md:block w-96 h-1" />
          )}
        </div>

        {allItemsLabel && allItemsHref && (
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href={allItemsHref}>
                {allItemsLabel}
              </Link>
            </Button>
          </div>
        )}

        <div className="w-full md:w-auto flex justify-center md:justify-end">
          {nextItem ? (
            <NavigationCard item={nextItem} direction="right" contentType={contentType} />
          ) : (
            <div className="hidden md:block w-96 h-1" />
          )}
        </div>
      </div>
    </div>
  )
}


interface BlogNavigationProps {
  previousPost?: BlogPreview
  nextPost?: BlogPreview
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  return (
    <ContentNavigation
      previousItem={previousPost}
      nextItem={nextPost}
      contentType="blog"
      allItemsLabel="All Posts"
      allItemsHref="/blog"
    />
  )
}

interface ProjectNavigationProps {
  nextProject?: Project | null
  previousProject?: Project | null
}

export function ProjectNavigation({ nextProject, previousProject }: ProjectNavigationProps) {
  return (
    <ContentNavigation
      previousItem={previousProject}
      nextItem={nextProject}
      contentType="project"
    />
  )
}

interface BackButtonProps {
  sectionId: string
  children: React.ReactNode
  className?: string
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link"
  size?: "sm" | "default" | "lg" | "icon"
}

export function BackButton({ sectionId, children, className, variant = "outline", size }: BackButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    sessionStorage.setItem("scrollTo", sectionId)
    router.push("/")
  }

  return (
    <Button onClick={handleClick} className={className} variant={variant} size={size}>
      {children}
    </Button>
  )
}