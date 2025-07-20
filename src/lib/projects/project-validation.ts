import { NotionProject, NotionProjectPreview, ProjectValidationResult, ProjectCategory, TechCategory, ProjectStatistic, ProjectGalleryItem, ProjectFeature, ProjectTechStackItem } from "@/types/projectTypes"

// Runtime validation for project content
export function validateProjectPreview(data: unknown): ProjectValidationResult<NotionProjectPreview> {
  const errors: string[] = []
  let validatedData: Partial<NotionProjectPreview> = {}

  if (!data || typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid data structure"] }
  }

  const record = data as Record<string, unknown>

  // Required fields
  if (!record.id || typeof record.id !== "string") {
    errors.push("Missing or invalid id")
  } else {
    validatedData.id = record.id
  }

  if (!record.slug || typeof record.slug !== "string") {
    errors.push("Missing or invalid slug")
  } else {
    validatedData.slug = record.slug
  }

  if (!record.title || typeof record.title !== "string") {
    errors.push("Missing or invalid title")
  } else {
    validatedData.title = record.title
  }

  if (!record.subtitle || typeof record.subtitle !== "string") {
    errors.push("Missing or invalid subtitle")
  } else {
    validatedData.subtitle = record.subtitle
  }

  if (!record.description || typeof record.description !== "string") {
    errors.push("Missing or invalid description")
  } else {
    validatedData.description = record.description
  }

  if (!record.publishedAt || typeof record.publishedAt !== "string") {
    errors.push("Missing or invalid publishedAt")
  } else {
    // Validate date format
    const date = new Date(record.publishedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid publishedAt date format")
    } else {
      validatedData.publishedAt = record.publishedAt
    }
  }

  // Validate category
  if (!record.category || typeof record.category !== "string") {
    errors.push("Missing or invalid category")
  } else {
    const category = record.category as string
    if (!Object.values(ProjectCategory).includes(category as ProjectCategory)) {
      errors.push("Invalid category - must be Software, Hardware, or Hybrid")
    } else {
      validatedData.category = category as ProjectCategory
    }
  }

  // Optional fields validation
  if (record.award !== undefined) {
    if (typeof record.award !== "string") {
      errors.push("Invalid award type")
    } else {
      validatedData.award = record.award
    }
  }

  if (record.awardRank !== undefined) {
    if (typeof record.awardRank !== "string") {
      errors.push("Invalid awardRank type")
    } else {
      validatedData.awardRank = record.awardRank
    }
  }

  // Validate stats array
  if (record.stats !== undefined) {
    if (!Array.isArray(record.stats)) {
      errors.push("Invalid stats type - must be array")
    } else {
      const validStats: ProjectStatistic[] = []
      for (const stat of record.stats) {
        if (typeof stat === "object" && stat !== null) {
          const s = stat as Record<string, unknown>
          if (typeof s.value === "string" && typeof s.label === "string") {
            validStats.push({ value: s.value, label: s.label })
          }
        }
      }
      validatedData.stats = validStats
    }
  } else {
    validatedData.stats = []
  }

  // Validate tags array
  if (record.tags !== undefined) {
    if (!Array.isArray(record.tags)) {
      errors.push("Invalid tags type - must be array")
    } else {
      const invalidTags = record.tags.filter((tag: unknown) => typeof tag !== "string")
      if (invalidTags.length > 0) {
        errors.push("All tags must be strings")
      } else {
        validatedData.tags = record.tags as string[]
      }
    }
  } else {
    validatedData.tags = []
  }

  // Optional URL fields
  if (record.liveLink !== undefined) {
    if (typeof record.liveLink !== "string") {
      errors.push("Invalid liveLink type")
    } else {
      validatedData.liveLink = record.liveLink
    }
  }

  if (record.githubLink !== undefined) {
    if (typeof record.githubLink !== "string") {
      errors.push("Invalid githubLink type")
    } else {
      validatedData.githubLink = record.githubLink
    }
  }

  if (record.heroImage !== undefined) {
    if (typeof record.heroImage !== "string") {
      errors.push("Invalid heroImage type")
    } else {
      validatedData.heroImage = record.heroImage
    }
  }

  if (record.vectaryEmbedUrl !== undefined) {
    if (typeof record.vectaryEmbedUrl !== "string") {
      errors.push("Invalid vectaryEmbedUrl type")
    } else {
      validatedData.vectaryEmbedUrl = record.vectaryEmbedUrl
    }
  }

  // Published status
  if (record.published !== undefined && typeof record.published !== "boolean") {
    errors.push("Invalid published type - must be boolean")
  } else {
    validatedData.published = record.published ?? true
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as NotionProjectPreview : undefined
  }
}

export function validateProject(data: unknown): ProjectValidationResult<NotionProject> {
  const previewValidation = validateProjectPreview(data)
  
  if (!previewValidation.isValid || !previewValidation.data) {
    return {
      isValid: false,
      errors: previewValidation.errors
    }
  }

  const record = data as Record<string, unknown>
  const errors: string[] = []
  let validatedData: Partial<NotionProject> = {
    ...previewValidation.data
  }

  if (!record.updatedAt || typeof record.updatedAt !== "string") {
    errors.push("Missing or invalid updatedAt")
  } else {
    const date = new Date(record.updatedAt)
    if (isNaN(date.getTime())) {
      errors.push("Invalid updatedAt date format")
    } else {
      validatedData.updatedAt = record.updatedAt
    }
  }

  // Validate gallery array
  if (record.gallery !== undefined) {
    if (!Array.isArray(record.gallery)) {
      errors.push("Invalid gallery type - must be array")
    } else {
      const validGalleryItems: ProjectGalleryItem[] = []
      for (const item of record.gallery) {
        if (typeof item === "object" && item !== null) {
          const g = item as Record<string, unknown>
          if (typeof g.url === "string" && typeof g.caption === "string") {
            validGalleryItems.push({
              url: g.url,
              caption: g.caption,
              alt: typeof g.alt === "string" ? g.alt : g.caption,
              width: typeof g.width === "number" ? g.width : undefined,
              height: typeof g.height === "number" ? g.height : undefined,
            })
          }
        }
      }
      validatedData.gallery = validGalleryItems
    }
  } else {
    validatedData.gallery = []
  }

  // Validate key features array
  if (record.keyFeatures !== undefined) {
    if (!Array.isArray(record.keyFeatures)) {
      errors.push("Invalid keyFeatures type - must be array")
    } else {
      const validFeatures: ProjectFeature[] = []
      for (const feature of record.keyFeatures) {
        if (typeof feature === "object" && feature !== null) {
          const f = feature as Record<string, unknown>
          if (typeof f.title === "string" && typeof f.description === "string") {
            validFeatures.push({
              title: f.title,
              description: f.description,
              icon: typeof f.icon === "string" ? f.icon : undefined,
            })
          }
        }
      }
      validatedData.keyFeatures = validFeatures
    }
  } else {
    validatedData.keyFeatures = []
  }

  // Validate tech stack array
  if (record.techStack !== undefined) {
    if (!Array.isArray(record.techStack)) {
      errors.push("Invalid techStack type - must be array")
    } else {
      const validTechItems: ProjectTechStackItem[] = []
      for (const tech of record.techStack) {
        if (typeof tech === "object" && tech !== null) {
          const t = tech as Record<string, unknown>
          if (typeof t.name === "string" && typeof t.category === "string") {
            validTechItems.push({
              name: t.name,
              category: t.category as TechCategory,
              icon: typeof t.icon === "string" ? t.icon : undefined,
              proficiency: t.proficiency as any, // Allow undefined
            })
          }
        }
      }
      validatedData.techStack = validTechItems
    }
  } else {
    validatedData.techStack = []
  }

  if (!record.recordMap || typeof record.recordMap !== "object") {
    errors.push("Missing or invalid recordMap")
  } else {
    validatedData.recordMap = record.recordMap as any // ExtendedRecordMap type is complex
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? validatedData as NotionProject : undefined
  }
}

export function sanitizeProjectPreview(data: unknown): NotionProjectPreview | null {
  const validation = validateProjectPreview(data)
  
  if (!validation.isValid || !validation.data) {
    return null
  }

  return validation.data
}

export function sanitizeProject(data: unknown): NotionProject | null {
  const validation = validateProject(data)
  
  if (!validation.isValid || !validation.data) {
    return null
  }

  return validation.data
}

// URL slug validation
export function validateSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 100
}

// Content safety validation
export function validateContent(content: string): ProjectValidationResult<string> {
  if (typeof content !== "string") {
    return { 
      isValid: false, 
      errors: ["Content must be a string"] 
    }
  }
  
  const errors: string[] = []
  
  // Check for potentially malicious content
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:.*?base64/gi,
    /vbscript:/gi,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      errors.push("Content contains potentially unsafe elements")
      break
    }
  }
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? content : undefined
  }
}

// Environment validation
export function validateProjectEnvironment(): ProjectValidationResult<boolean> {
  const errors: string[] = []
  
  if (!process.env.NOTION_TOKEN && !process.env.NOTION_PROJECTS_DATABASE_ID) {
    errors.push("Projects functionality requires NOTION_TOKEN and NOTION_PROJECTS_DATABASE_ID environment variables")
  }
  
  if (process.env.NOTION_TOKEN && !process.env.NOTION_PROJECTS_DATABASE_ID) {
    errors.push("NOTION_PROJECTS_DATABASE_ID is required when NOTION_TOKEN is provided")
  }
  
  if (process.env.NOTION_PROJECTS_DATABASE_ID && !process.env.NOTION_TOKEN) {
    errors.push("NOTION_TOKEN is required when NOTION_PROJECTS_DATABASE_ID is provided")
  }
  
  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    data: isValid ? true : undefined
  }
}

// Category validation
export function validateProjectCategory(category: string): boolean {
  return Object.values(ProjectCategory).includes(category as ProjectCategory)
}

// Tech category validation
export function validateTechCategory(category: string): boolean {
  return Object.values(TechCategory).includes(category as TechCategory)
}