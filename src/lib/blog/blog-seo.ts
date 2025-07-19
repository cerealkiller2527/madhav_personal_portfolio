import { BlogPost, BlogPostPreview } from "@/types/blog"

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

export function generateBlogPostSEO(post: BlogPost, baseUrl: string = ""): SEOData {
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

export function generateBlogIndexSEO(posts: BlogPostPreview[], baseUrl: string = ""): SEOData {
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

export function generateStructuredData(post: BlogPost, baseUrl: string = "") {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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