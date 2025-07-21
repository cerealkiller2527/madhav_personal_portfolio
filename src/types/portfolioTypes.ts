import type { ExtendedRecordMap } from "notion-types"
import type { ProjectContent as NotionProject, ProjectPreview as NotionProjectPreview } from "./notion-unified"

// Core Portfolio Types
export interface Experience {
  readonly id: string
  readonly company: string
  readonly logo: string
  readonly role: string
  readonly title?: string
  readonly date?: string
  readonly location?: string
  readonly description: string
  readonly stats?: readonly Statistic[]
  readonly tags: readonly string[]
  readonly liveLink?: string
}

export interface Project {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly category: ProjectCategory
  readonly award?: string
  readonly awardRank?: string
  readonly stats?: readonly Statistic[]
  readonly tags: readonly string[]
  readonly liveLink?: string
  readonly githubLink?: string
  readonly heroImage: string
  readonly gallery: readonly GalleryItem[]
  readonly detailedDescription: string
  readonly vectaryEmbedUrl?: string
  readonly keyFeatures: readonly Feature[]
  readonly techStack: readonly TechStackItem[]
  // Optional Notion support
  readonly recordMap?: ExtendedRecordMap
}

export interface Statistic {
  readonly value: string
  readonly label: string
}

export interface GalleryItem {
  readonly url: string
  readonly caption: string
  readonly alt?: string
  readonly width?: number
  readonly height?: number
}

export interface Feature {
  readonly title: string
  readonly description: string
  readonly icon?: string
}

export interface TechStackItem {
  readonly name: string
  readonly category: TechCategory
  readonly icon?: string
  readonly proficiency?: ProficiencyLevel
}

// Enums
export enum ProjectCategory {
  SOFTWARE = "Software",
  HARDWARE = "Hardware",
  HYBRID = "Hybrid"
}

export enum TechCategory {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  DATABASE = "Database",
  DEVOPS = "DevOps",
  MOBILE = "Mobile",
  HARDWARE = "Hardware",
  TOOLS = "Tools",
  LANGUAGE = "Language",
  FRAMEWORK = "Framework",
  LIBRARY = "Library"
}

export enum ProficiencyLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert"
}

// Filter and Search Types
export interface ProjectFilter {
  readonly category?: ProjectCategory
  readonly tags?: readonly string[]
  readonly hasLiveLink?: boolean
  readonly hasGithubLink?: boolean
}

export interface ExperienceFilter {
  readonly company?: string
  readonly tags?: readonly string[]
  readonly location?: string
  readonly dateRange?: DateRange
}

export interface DateRange {
  readonly start: string
  readonly end: string
}

// UI State Types
export interface ProjectUIState {
  readonly selectedProject: Project | null
  readonly showMore: boolean
  readonly activeFilter: ProjectCategory | "All"
  readonly bounceProjectId: string | null
}

export interface NavigationState {
  readonly activeSection: string
  readonly isMenuOpen: boolean
  readonly isScrolled: boolean
}

// Animation Types
export interface AnimationConfig {
  readonly duration: number
  readonly delay?: number
  readonly easing?: string
  readonly stagger?: number
}

export interface CursorGlowState {
  readonly isVisible: boolean
  readonly mouseX: number
  readonly mouseY: number
  readonly size: number
  readonly opacity: number
}

// Resume Types
export interface Resume {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: React.ReactNode
  readonly filePath: string
  readonly downloadName: string
  readonly category: ResumeCategory
}

export enum ResumeCategory {
  SOFTWARE = "software",
  ROBOTICS = "robotics",
  MECHANICAL = "mechanical",
  ELECTRICAL = "electrical"
}

// Portfolio Configuration
export interface PortfolioConfig {
  readonly personalInfo: PersonalInfo
  readonly socialLinks: readonly SocialLink[]
  readonly resumeTypes: readonly Resume[]
  readonly theme: ThemeConfig
}

export interface PersonalInfo {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly email: string
  readonly location: string
  readonly avatar: string
  readonly tagline: string
}

export interface SocialLink {
  readonly platform: SocialPlatform
  readonly url: string
  readonly username?: string
  readonly icon: React.ReactNode
}

export enum SocialPlatform {
  LINKEDIN = "linkedin",
  GITHUB = "github",
  TWITTER = "twitter",
  EMAIL = "email",
  WEBSITE = "website"
}

export interface ThemeConfig {
  readonly defaultTheme: "light" | "dark" | "system"
  readonly colors: Record<string, string>
  readonly fonts: Record<string, string>
}

// Data Loading Types
export interface PortfolioData {
  readonly projects: readonly Project[]
  readonly experiences: readonly Experience[]
  readonly personalInfo: PersonalInfo
  readonly socialLinks: readonly SocialLink[]
}

// Notion-enhanced portfolio data
export interface NotionPortfolioData {
  readonly projects: readonly NotionProjectPreview[]
  readonly experiences: readonly Experience[]
  readonly personalInfo: PersonalInfo
  readonly socialLinks: readonly SocialLink[]
}

// Error Types
export class PortfolioError extends Error {
  constructor(
    message: string,
    public readonly code: PortfolioErrorCode,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = "PortfolioError"
  }
}

export enum PortfolioErrorCode {
  DATA_LOADING_ERROR = "DATA_LOADING_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR"
}