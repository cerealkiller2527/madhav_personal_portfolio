/**
 * Unified Blog Utilities
 * SEO generation, date formatting, display utilities, and constants
 */

import { BlogContent, BlogPreview } from "@/types"

// =============================================================================
// DATE AND DISPLAY UTILITIES
// =============================================================================

// Date formatting utilities
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Tag display utilities
export function getDisplayTags(tags: string[], maxTags = 2): { visible: string[]; overflow: number } {
  const visible = tags.slice(0, maxTags)
  const overflow = Math.max(0, tags.length - maxTags)
  
  return { visible, overflow }
}

// Blog preview constants
export const BLOG_PREVIEW_LIMITS = {
  POSTS_TO_SHOW: 3,
  MAX_TAGS_VISIBLE: 2,
  DEFAULT_READING_TIME: 5
} as const

// =============================================================================
// SEO UTILITIES
// =============================================================================

interface SEOData {
  title: string
  description: string
  canonical?: string
  openGraph: {
    title: string
    description: string
    type: string
    url?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    publishedTime?: string
    authors?: string[]
  }
  twitter: {
    card: string
    title: string
    description: string
    images?: string[]
  }
}

export function generateBlogContentSEO(post: BlogContent, baseUrl: string = ""): SEOData {
  const url = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage || `${baseUrl}/assets/portfolio/avatar-logo.png`
  
  return {
    title: `${post.title} - Blog - Madhav Lodha`,
    description: post.description || `Read "${post.title}" on Madhav Lodha's blog about software engineering and web development.`,
    canonical: url,
    openGraph: {
      title: post.title,
      description: post.description || `Read "${post.title}" on Madhav Lodha's blog about software engineering and web development.`,
      type: "article",
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: ["Madhav Lodha"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || `Read "${post.title}" on Madhav Lodha's blog about software engineering and web development.`,
      images: [imageUrl],
    },
  }
}

export function generateBlogIndexSEO(posts: BlogPreview[], baseUrl: string = ""): SEOData {
  const latestPost = posts[0]
  const imageUrl = latestPost?.coverImage || `${baseUrl}/assets/portfolio/avatar-logo.png`
  
  return {
    title: "Blog - Madhav Lodha",
    description: "Thoughts on software engineering, web development, and technology by Madhav Lodha.",
    canonical: `${baseUrl}/blog`,
    openGraph: {
      title: "Blog - Madhav Lodha",
      description: "Thoughts on software engineering, web development, and technology by Madhav Lodha.",
      type: "website",
      url: `${baseUrl}/blog`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Madhav Lodha's Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Madhav Lodha",
      description: "Thoughts on software engineering, web development, and technology by Madhav Lodha.",
      images: [imageUrl],
    },
  }
}

export function generateStructuredData(post: BlogContent, baseUrl: string = "") {
  return {
    "@context": "https://schema.org",
    "@type": "BlogContenting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${baseUrl}/assets/portfolio/avatar-logo.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Madhav Lodha",
      url: baseUrl,
      image: `${baseUrl}/assets/portfolio/avatar-logo.png`,
    },
    publisher: {
      "@type": "Person",
      name: "Madhav Lodha",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/assets/portfolio/avatar-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category || "Technology",
    url: `${baseUrl}/blog/${post.slug}`,
  }
}