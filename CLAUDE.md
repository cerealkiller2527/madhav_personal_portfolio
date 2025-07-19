# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server (uses Next.js 15 dev server)
- `pnpm build` - Build for production (TypeScript errors ignored via next.config.mjs)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality

## Project Overview

This is a modern portfolio website built with Next.js 15, featuring a comprehensive blog system, project showcase, and professional experience sections. The site demonstrates advanced full-stack development skills with TypeScript, React 19, Tailwind CSS, and integrated Notion CMS.

## Technology Stack

### Core Framework & Language
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5+ with strict configuration
- **React**: React 19 with React DOM 19
- **Package Manager**: pnpm (10.13.1+)

### Styling & UI
- **CSS Framework**: Tailwind CSS 3.4.17 with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React (450+ icons)
- **Animations**: Framer Motion (latest)
- **Fonts**: Roboto Mono (Google Fonts)
- **Theme System**: next-themes with dark/light mode

### Data & State Management
- **CMS**: Notion integration (@notionhq/client 4.0.1)
- **Content Rendering**: react-notion-x 7.4.2
- **Forms**: React Hook Form 7.54.1 with Zod validation
- **Date Handling**: date-fns 4.1.0

### Development & Build Tools
- **Build**: Next.js with custom webpack optimizations
- **Linting**: ESLint 9.31.0 with Next.js config
- **PostCSS**: Custom configuration with Tailwind
- **TypeScript**: Strict mode with path mapping

## Project Architecture

### Directory Structure
```
portfolio-clone/
├── public/                          # Static assets
│   ├── assets/
│   │   ├── portfolio/              # Personal branding (avatars, logos)
│   │   ├── projects/               # Project hero images and screenshots
│   │   └── placeholders/           # Development placeholder images
│   └── documents/                  # Resume PDFs organized by engineering discipline
├── src/                            # Source code (all imports use @/ prefix)
│   ├── app/                        # Next.js 15 App Router
│   │   ├── globals.css             # Global styles + blog CSS imports
│   │   ├── layout.tsx              # Root layout with theme provider
│   │   ├── layout-client.tsx       # Client-side layout wrapper
│   │   ├── page.tsx                # Homepage (Server Component)
│   │   ├── loading.tsx             # Global loading UI
│   │   ├── sitemap.ts              # SEO sitemap generation
│   │   ├── blog/                   # Blog routes with ISR
│   │   │   ├── page.tsx            # Blog listing (60s revalidation)
│   │   │   ├── [slug]/page.tsx     # Individual blog posts
│   │   │   ├── loading.tsx         # Blog loading states
│   │   │   ├── not-found.tsx       # Blog 404 page
│   │   │   ├── sitemap.xml/        # Blog sitemap route
│   │   │   └── rss.xml/            # RSS feed route
│   │   └── projects/[id]/          # Individual project pages
│   ├── components/                 # React components
│   │   ├── blog/                   # Blog-specific components
│   │   │   ├── blog-list/          # Grid, cards, wrappers
│   │   │   ├── blog-post/          # Post rendering, navigation, headers
│   │   │   └── shared/             # Error boundaries, loading states, fallbacks
│   │   ├── common/                 # Shared utilities
│   │   │   ├── cursor-glow.tsx     # Interactive cursor effects
│   │   │   ├── grid-background.tsx # Animated background patterns
│   │   │   ├── section.tsx         # Layout wrapper component
│   │   │   ├── theme-provider.tsx  # Theme context provider
│   │   │   └── theme-toggle.tsx    # Dark/light mode switcher
│   │   ├── layout/                 # Site-wide layout
│   │   │   ├── header.tsx          # Navigation with active states
│   │   │   └── footer.tsx          # Site footer
│   │   ├── pages/                  # Page-level components
│   │   │   └── home-page.tsx       # Homepage client wrapper
│   │   ├── sections/               # Homepage sections
│   │   │   ├── blog/               # Blog preview section
│   │   │   ├── experience/         # Work experience section
│   │   │   ├── hero/               # Hero section with animations
│   │   │   ├── projects/           # Project showcase with filtering
│   │   │   └── resume/             # Resume download modal
│   │   └── ui/                     # Reusable UI components (shadcn/ui)
│   ├── lib/                        # Core utilities and data
│   │   ├── api/                    # API client configurations
│   │   ├── blog/                   # Blog system utilities
│   │   │   ├── notion-client.ts    # Notion API client with error handling
│   │   │   ├── blog-queries.ts     # Data fetching and caching
│   │   │   ├── blog-transforms.ts  # Data transformation utilities
│   │   │   ├── blog-cache.ts       # Caching system with TTL
│   │   │   ├── blog-seo.ts         # SEO metadata generation
│   │   │   └── blog-validation.ts  # Data validation and sanitization
│   │   ├── environment/            # Environment configuration
│   │   │   └── config.ts           # Type-safe env var management
│   │   ├── errors/                 # Error handling
│   │   │   ├── error-handlers.tsx  # React error boundaries
│   │   │   └── server-error-handlers.ts # Server-side error handling
│   │   ├── validation/             # Data validation utilities
│   │   │   └── type-guards.ts      # TypeScript type guards
│   │   ├── data.ts                 # Portfolio data (projects, experiences)
│   │   ├── types.ts                # Legacy type exports (backward compatibility)
│   │   └── utils.ts                # Utility functions (cn, etc.)
│   ├── styles/                     # Styling
│   │   └── blog/                   # Blog-specific styles
│   │       ├── notion-overrides.css # Custom Notion content styling
│   │       ├── blog-layout.css     # Blog layout styles
│   │       └── blog-components.css # Blog component styles
│   └── types/                      # TypeScript type definitions
│       ├── api.ts                  # API response types
│       ├── blog.ts                 # Blog system types
│       ├── components.ts           # Component prop types
│       ├── environment.ts          # Environment variable types
│       ├── index.ts                # Type exports
│       ├── notion.ts               # Notion-specific types
│       └── portfolio.ts            # Portfolio data types
├── components.json                 # shadcn/ui configuration
├── next.config.mjs                # Next.js configuration with optimizations
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration with path mapping
├── postcss.config.mjs             # PostCSS configuration
├── package.json                   # Dependencies and scripts
└── BLOG_SETUP.md                  # Blog system setup guide
```

## Data Architecture

### Portfolio Data (`src/lib/data.ts`)
- **Static Data**: Projects and experiences defined as TypeScript arrays
- **Type Safety**: All data strictly typed with interfaces from `src/types/portfolio.ts`
- **Rich Content**: Supports statistics, tech stacks, galleries, detailed descriptions
- **Asset Organization**: Hero images, project galleries, and resumes organized by category

### Blog System (Notion CMS Integration)
- **Data Source**: Notion Database with configurable properties
- **Content Rendering**: react-notion-x for pixel-perfect Notion block rendering
- **Caching**: Multi-level caching with TTL for performance
- **ISR**: Incremental Static Regeneration with 60-second revalidation
- **SEO**: Dynamic metadata, OpenGraph tags, sitemap, and RSS feed generation

## Component Architecture

### Component Hierarchy
1. **App Layout** (`src/app/layout.tsx`)
   - Root HTML structure with theme provider
   - Global font loading (Roboto Mono)
   - Theme provider with system detection

2. **Homepage** (`src/app/page.tsx` → `src/components/pages/home-page.tsx`)
   - Server Component pattern for optimal performance
   - Data fetching at server level, passed to client components
   - Section-based layout (Hero, Projects, Experience, Blog Preview)

3. **Section Components** (`src/components/sections/`)
   - Modular, reusable sections with consistent styling
   - Animation integration with Framer Motion
   - Responsive design with mobile-first approach

4. **UI Components** (`src/components/ui/`)
   - Based on shadcn/ui with Radix UI primitives
   - Customized to match portfolio design system
   - Full TypeScript support with prop validation

### State Management
- **Client State**: React hooks for UI interactions
- **Theme State**: next-themes for dark/light mode persistence
- **Animation State**: Framer Motion for smooth transitions
- **Form State**: React Hook Form with Zod validation

## Styling System

### Design System
- **Color Palette**: CSS variables with HSL values for theme switching
- **Typography**: Roboto Mono for consistent monospace aesthetic
- **Spacing**: Tailwind's spacing scale for consistent layout
- **Breakpoints**: Mobile-first responsive design
- **Animations**: Custom CSS animations + Framer Motion

### Tailwind Configuration (`tailwind.config.ts`)
- **Custom Colors**: Extensive color system with semantic naming
- **Custom Screens**: Additional `xs` breakpoint (475px)
- **Custom Animations**: Accordion animations, fade effects
- **Plugin Integration**: tailwindcss-animate for enhanced animations

### Blog Styling (`src/styles/blog/`)
- **Notion Overrides**: Custom styling for Notion blocks to match portfolio theme
- **Layout Styles**: Blog-specific layout and spacing
- **Component Styles**: Blog component styling with consistent design

## Performance Optimizations

### Next.js Optimizations
- **App Router**: Latest Next.js routing for optimal performance
- **ISR**: Incremental Static Regeneration for dynamic content
- **Image Optimization**: Disabled for deployment flexibility (can be re-enabled)
- **Bundle Optimization**: Webpack configuration for react-notion-x

### Caching Strategy
- **Blog Cache**: Multi-level caching with configurable TTL
- **Static Assets**: Efficient asset organization and delivery
- **Font Optimization**: Google Fonts with display swap

### Security Headers
- **Content Security**: X-Content-Type-Options, X-Frame-Options
- **XSS Protection**: X-XSS-Protection headers for blog routes
- **CORS**: Configured for Notion asset domains

## Environment Configuration

### Required Environment Variables
```bash
# Core Application
NODE_ENV=development|production|test
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Blog System (Optional - graceful degradation if not configured)
NOTION_TOKEN=secret_notion_integration_token
NOTION_DATABASE_ID=notion_database_id

# Blog Configuration (Optional with defaults)
BLOG_REVALIDATE_TIME=60                    # ISR revalidation in seconds
ENABLE_BLOG_CACHE=true                     # Enable blog caching
CACHE_MAX_SIZE=100                         # Max cache entries
AUTHOR_EMAIL=your-email@example.com        # RSS feed author

# Analytics (Optional)
ANALYTICS_ID=your_analytics_id
```

### Environment Management
- **Type Safety**: Full TypeScript support for environment variables
- **Validation**: Runtime validation with helpful error messages
- **Fallbacks**: Sensible defaults for optional configuration
- **Error Handling**: Graceful degradation when services aren't configured

## Blog System Details

### Notion Database Structure
**Required Properties:**
- `Name` (Title) - Post title and slug generation
- `Published Date` (Date) - Publication timestamp
- `Published` (Checkbox) - Publication status filter

**Optional Properties:**
- `Description` (Text) - Post excerpt/summary
- `Tags` (Multi-select) - Post categorization
- `Category` (Select) - Post category
- `Cover` (Files) - Cover image

### Content Rendering
- **react-notion-x**: Pixel-perfect Notion block rendering
- **Rich Content**: Support for all Notion block types
- **Custom Styling**: Overrides to match portfolio design
- **Responsive**: Mobile-optimized content rendering

### SEO & Discovery
- **Dynamic Metadata**: Generated per-post metadata and OpenGraph tags
- **Sitemap**: Automatic sitemap generation for blog posts
- **RSS Feed**: Full RSS 2.0 feed with proper content encoding
- **Schema Markup**: Structured data for search engines

## Development Guidelines

### Code Organization
- **Absolute Imports**: Use `@/` prefix for all internal imports
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Component Props**: All components properly typed with interfaces
- **Error Boundaries**: Comprehensive error handling at all levels

### Styling Guidelines
- **Tailwind First**: Use Tailwind utilities before custom CSS
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Theme Variables**: Use CSS variables for theme-aware components
- **Animation Performance**: Optimize animations with will-change and transform

### Performance Guidelines
- **Server Components**: Use Server Components for static content
- **Client Components**: Mark client components with "use client"
- **Bundle Size**: Monitor and optimize bundle size, especially for blog dependencies
- **Caching**: Implement appropriate caching strategies for dynamic content

## Build & Deployment

### Production Build
- **TypeScript Errors**: Ignored during build (configurable in next.config.mjs)
- **ESLint**: Errors ignored during build (configurable)
- **Image Optimization**: Disabled for deployment flexibility
- **Bundle Analysis**: Available via webpack configuration

### Deployment Considerations
- **Static Export**: Can be configured for static deployment
- **Environment Variables**: Ensure all required env vars are set
- **Asset Optimization**: Images optimized for web delivery
- **SEO**: Automatic sitemap and robots.txt generation

## Security Considerations

### Content Security
- **Input Sanitization**: All user inputs properly validated
- **XSS Protection**: Security headers for all routes
- **CORS Configuration**: Proper CORS setup for external assets
- **Environment Variables**: Sensitive data properly secured

### Blog Security
- **Notion Integration**: Secure API token handling
- **Content Validation**: All content validated before rendering
- **Error Handling**: No sensitive information leaked in error messages
- **Cache Security**: Secure caching with proper TTL management

## Testing & Quality Assurance

### Code Quality
- **TypeScript**: Strict type checking for compile-time error detection
- **ESLint**: Comprehensive linting with Next.js configuration
- **Component Testing**: Props validation and error boundary testing
- **Performance Testing**: Bundle size and runtime performance monitoring

### Error Handling
- **Error Boundaries**: React error boundaries for graceful failures
- **Server Errors**: Proper server-side error handling and logging
- **Network Errors**: Retry logic and graceful degradation
- **User Feedback**: Clear error messages and recovery options

## Maintenance & Updates

### Dependency Management
- **Regular Updates**: Keep dependencies updated for security and features
- **Breaking Changes**: Test thoroughly when updating major versions
- **Bundle Size**: Monitor impact of dependency updates on bundle size
- **Security**: Regular security audits and vulnerability scanning

### Content Management
- **Blog Content**: Notion database for easy content management
- **Portfolio Data**: Update `src/lib/data.ts` for portfolio changes
- **Assets**: Organize assets in appropriate public directories
- **SEO**: Regular review and optimization of metadata and content

## Extensibility

### Adding New Features
- **Component System**: Extend existing components or create new ones
- **Type Safety**: Add proper TypeScript types for new features
- **Styling**: Follow existing design system and conventions
- **Testing**: Add appropriate testing for new functionality

### Integration Options
- **CMS**: Can be extended to support other CMS platforms
- **Analytics**: Easy integration with various analytics platforms
- **Email**: Can add contact forms and email integration
- **Commerce**: Extensible for e-commerce or service offerings

## Key Files Reference

### Configuration Files
- `next.config.mjs` - Next.js configuration with security headers and optimizations
- `tailwind.config.ts` - Tailwind CSS configuration with custom design system
- `tsconfig.json` - TypeScript configuration with strict mode and path mapping
- `components.json` - shadcn/ui configuration for UI components
- `package.json` - Dependencies, scripts, and package manager configuration

### Core Application Files
- `src/app/layout.tsx` - Root layout with theme provider and global styles
- `src/app/page.tsx` - Homepage Server Component
- `src/lib/data.ts` - Portfolio data (projects and experiences)
- `src/lib/utils.ts` - Utility functions and helpers
- `src/app/globals.css` - Global styles and CSS imports

### Type Definitions
- `src/types/portfolio.ts` - Portfolio data types and interfaces
- `src/types/blog.ts` - Blog system types and interfaces  
- `src/types/environment.ts` - Environment variable types
- `src/types/components.ts` - Component prop types

### Blog System Files
- `src/lib/blog/notion-client.ts` - Notion API client
- `src/lib/blog/blog-queries.ts` - Data fetching functions
- `src/lib/environment/config.ts` - Environment configuration management
- `src/styles/blog/` - Blog-specific styling

## Important Reminders

- **Type Safety**: All components and data are strictly typed with TypeScript
- **Performance**: Server Components are used for static content, Client Components for interactivity
- **Styling**: Tailwind-first approach with custom design system
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **SEO**: Automatic sitemap generation and proper metadata handling
- **Accessibility**: Components built with Radix UI primitives for accessibility
- **Responsive**: Mobile-first responsive design throughout
- **Theme Support**: Full dark/light theme support with CSS variables