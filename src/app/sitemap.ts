import { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllProjects } from '@/lib/notion/notion-service'
import { projects as localProjects } from '@/lib/core/data'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000').replace(/\/$/, '')
  
  try {
    const posts = await getAllBlogPosts()
    
    const blogUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // Get projects (Notion or local)
    let projectUrls: MetadataRoute.Sitemap = []
    try {
      const notionProjects = await getAllProjects()
      if (notionProjects && notionProjects.length > 0) {
        projectUrls = notionProjects.map((project) => ({
          url: `${baseUrl}/projects/${project.id}/`,
          lastModified: new Date(project.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))
      } else {
        projectUrls = localProjects.map((project) => ({
          url: `${baseUrl}/projects/${project.id}/`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))
      }
    } catch {
      // Use local projects if Notion fails
      projectUrls = localProjects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}/`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    }

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...blogUrls,
      ...projectUrls,
    ]
  } catch {
    // Return basic sitemap if blog fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }
}