/**
 * Represents a work experience entry.
 */
export type Experience = {
  id: string
  company: string
  logo: string
  role: string
  title?: string
  date?: string
  location?: string
  description: string
  stats?: { value: string; label: string }[]
  tags: string[]
  liveLink?: string
}

/**
 * Represents a project entry.
 */
export type Project = {
  id: string
  title: string
  subtitle: string
  description: string
  category: "Software" | "Hardware" | "Hybrid"
  award?: string
  stats?: { value: string; label: string }[]
  tags: string[]
  liveLink?: string
  githubLink?: string
  heroImage: string
  gallery: { url: string; caption: string }[]
  detailedDescription: string
  vectaryEmbedUrl?: string
  keyFeatures: { title: string; description: string }[]
  techStack: { name: string; category: string }[]
}
