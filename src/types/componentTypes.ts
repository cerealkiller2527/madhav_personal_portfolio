import React from "react"
import { Project, Experience } from "./portfolioTypes"
import { BlogPost, BlogPostPreview } from "./blogTypes"

// Base component props
export interface BaseComponentProps {
  readonly className?: string
  readonly children?: React.ReactNode
  readonly id?: string
}

// Layout component props
export interface HeaderProps {
  readonly onResumeOpen: () => void
}

export interface FooterProps extends BaseComponentProps {}

export interface SectionProps extends BaseComponentProps {
  readonly title?: string
  readonly hasBackground?: boolean
}

// Hero section props
export interface HeroSectionProps {
  readonly projects: readonly Project[]
  readonly onHoverChange: (isHovering: boolean) => void
  readonly onProjectSelect: (projectId: string) => void
}

// Experience section props
export interface ExperienceSectionProps {
  readonly experiences: readonly Experience[]
}

// Projects section props
export interface ProjectsSectionProps {
  readonly projects: readonly Project[]
  readonly onProjectSelect: (project: Project) => void
  readonly bounceProjectId: string | null
  readonly onBounceComplete: () => void
}

export interface ProjectGridCardProps {
  readonly project: Project
  readonly onSelect: (project: Project) => void
  readonly shouldBounce?: boolean
  readonly onBounceComplete?: () => void
}

export interface ProjectModalProps {
  readonly project: Project | null
  readonly onClose: () => void
}

export interface ProjectMarqueeProps {
  readonly projects: readonly Project[]
  readonly onProjectSelect: (projectId: string) => void
}

// Blog component props
export interface BlogCardProps {
  readonly post: BlogPostPreview
}

export interface BlogListProps {
  readonly posts: readonly BlogPostPreview[]
  readonly loading?: boolean
  readonly error?: string
}

export interface BlogPostPageProps {
  readonly post: BlogPost
}

export interface BlogErrorBoundaryProps {
  readonly children: React.ReactNode
  readonly fallback?: React.ComponentType<BlogErrorFallbackProps>
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export interface BlogErrorFallbackProps {
  readonly error: Error
  readonly reset: () => void
}

// UI component props
export interface ButtonProps {
  readonly variant?: "default" | "outline" | "ghost" | "destructive"
  readonly size?: "sm" | "md" | "lg"
  readonly disabled?: boolean
  readonly loading?: boolean
  readonly children: React.ReactNode
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  readonly type?: "button" | "submit" | "reset"
  readonly className?: string
  readonly asChild?: boolean
}

export interface BadgeProps {
  readonly variant?: "default" | "secondary" | "outline" | "destructive"
  readonly children: React.ReactNode
  readonly className?: string
}

export interface LoadingSpinnerProps {
  readonly size?: "sm" | "md" | "lg"
  readonly className?: string
}

// Dialog component props
export interface DialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly children: React.ReactNode
}

export interface DialogContentProps extends BaseComponentProps {
  readonly onEscapeKeyDown?: (event: KeyboardEvent) => void
  readonly onPointerDownOutside?: (event: PointerEvent) => void
}

export interface DialogHeaderProps extends BaseComponentProps {}

export interface DialogTitleProps extends BaseComponentProps {}

export interface DialogDescriptionProps extends BaseComponentProps {}

// Theme component props
export interface ThemeToggleProps {
  readonly className?: string
}

export interface ThemeProviderProps {
  readonly children: React.ReactNode
  readonly defaultTheme?: "light" | "dark" | "system"
  readonly storageKey?: string
  readonly attribute?: string
  readonly enableSystem?: boolean
  readonly disableTransitionOnChange?: boolean
}

// Resume modal props
export interface ResumeModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export interface ResumeTypeCardProps {
  readonly resume: {
    readonly id: string
    readonly title: string
    readonly description: string
    readonly icon: React.ReactNode
  }
  readonly isActive: boolean
  readonly onSelect: (id: string) => void
}

// Navigation props
export interface NavigationItemProps {
  readonly href: string
  readonly children: React.ReactNode
  readonly isActive?: boolean
  readonly onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  readonly className?: string
}

// Form component props
export interface FormFieldProps {
  readonly name: string
  readonly label: string
  readonly error?: string
  readonly required?: boolean
  readonly className?: string
}

export interface InputProps extends FormFieldProps {
  readonly type?: "text" | "email" | "password" | "number" | "tel" | "url"
  readonly placeholder?: string
  readonly value?: string
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readonly disabled?: boolean
}

export interface TextareaProps extends FormFieldProps {
  readonly placeholder?: string
  readonly value?: string
  readonly onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  readonly rows?: number
  readonly disabled?: boolean
}

// Animation component props
export interface AnimatedCounterProps {
  readonly value: number
  readonly duration?: number
  readonly className?: string
}

export interface FadeInProps extends BaseComponentProps {
  readonly delay?: number
  readonly duration?: number
  readonly direction?: "up" | "down" | "left" | "right"
}

// Cursor glow props
export interface CursorGlowProps {
  readonly isVisible: boolean
}

// Event handler types
export type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void
export type KeyboardEventHandler<T = Element> = (event: React.KeyboardEvent<T>) => void
export type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void
export type FocusEventHandler<T = Element> = (event: React.FocusEvent<T>) => void

// Ref types
export type RefCallback<T> = (instance: T | null) => void
export type MutableRefObject<T> = React.MutableRefObject<T>
export type RefObject<T> = React.RefObject<T>

// Children types
export type ReactChildren = React.ReactNode
export type ReactChild = React.ReactElement | string | number
export type ReactFragment = React.ReactFragment
export type ReactPortal = React.ReactPortal

// Component types
export type FunctionComponent<P = {}> = React.FunctionComponent<P>
export type ComponentType<P = {}> = React.ComponentType<P>
export type ComponentClass<P = {}> = React.ComponentClass<P>

// Higher-order component types
export type HOC<TOwnProps = {}, TInjectedProps = {}> = (
  component: ComponentType<TOwnProps & TInjectedProps>
) => ComponentType<TOwnProps>

// Render prop types
export type RenderProp<T> = (props: T) => React.ReactNode
export type ChildrenRenderProp<T> = (props: T) => React.ReactNode

// Context types
export interface ThemeContextType {
  readonly theme: "light" | "dark" | "system"
  readonly setTheme: (theme: "light" | "dark" | "system") => void
  readonly resolvedTheme: "light" | "dark"
}

// Error boundary types
export interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error?: Error
}

export interface ErrorInfo {
  readonly componentStack: string
}