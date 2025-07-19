# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality

## Project Architecture

This is a Next.js 15 portfolio website built with TypeScript, React 19, and Tailwind CSS. The architecture follows a modern src/ structure with organized component hierarchy:

### Key Structure
- **App Router**: Uses Next.js 15 App Router with the main page at `src/app/page.tsx`
- **Server-Side Data**: Portfolio data is fetched server-side in `src/lib/data.ts` and passed to client components
- **Component Architecture**: 
  - `src/components/sections/` - Page section components (hero, projects, experience)
  - `src/components/ui/` - Reusable UI components (shadcn/ui based)
  - `src/components/common/` - Shared utility components
  - `src/components/layout/` - Header, footer, navigation

### Data Flow
- Portfolio data (projects, experiences) is defined in `src/lib/data.ts` with TypeScript types from `src/lib/types.ts`
- The main page fetches data server-side and passes it to `HomePageClient` component
- Client components handle interactivity, animations, and state management

### Key Features
- **Theme System**: Uses `next-themes` with custom theme provider
- **Animations**: Framer Motion for smooth transitions and page interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Project Showcase**: Interactive project grid with filtering and detailed modals
- **Custom UI**: Built on shadcn/ui components with extensive customization

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Package Manager**: pnpm

### Asset Organization
- `public/assets/portfolio/` - Personal branding images (avatars, logos)
- `public/assets/projects/` - Project hero images and screenshots
- `public/assets/placeholders/` - Placeholder images for development
- `public/documents/` - PDF documents (resume, etc.)

### Blog Architecture
- **Blog System**: Integrated Notion CMS with react-notion-x for content rendering
- **Data Layer**: 
  - `src/lib/blog/` - Blog data fetching, caching, and transformation utilities
  - `src/lib/types/blog.ts` - TypeScript types for blog content
- **Components**: 
  - `src/components/blog/blog-list/` - Blog listing and card components
  - `src/components/blog/blog-post/` - Individual post rendering and navigation
  - `src/components/blog/shared/` - Shared utilities, loading states, error handling
  - `src/components/sections/blog/` - Homepage blog preview section
- **Styling**: 
  - `src/styles/blog/` - Blog-specific CSS for Notion content and layouts
  - Custom CSS overrides for react-notion-x to match portfolio design
- **Routes**: 
  - `/blog` - Blog listing page with ISR (60s revalidation)
  - `/blog/[slug]` - Individual blog posts with dynamic metadata
  - `/blog/sitemap.xml` - Blog-specific sitemap generation
  - `/blog/rss.xml` - RSS feed for blog content

### Blog Configuration
- **Environment Variables**:
  - `NOTION_TOKEN` - Notion integration token for API access
  - `NOTION_DATABASE_ID` - Notion database ID for blog posts
  - `BLOG_REVALIDATE_TIME` - ISR revalidation interval (default: 60s)
  - `NEXT_PUBLIC_SITE_URL` - Site URL for SEO and RSS feeds
  - `AUTHOR_EMAIL` - Author email for RSS feed
- **Notion Database Structure**:
  - Required properties: Name/Title, Published Date, Published (checkbox)
  - Optional properties: Description/Summary, Tags, Category, Cover/Image
  - Posts are filtered by Published=true and sorted by Published Date descending

### Important Notes
- Build errors and TypeScript errors are ignored in production (`next.config.mjs`)
- Images are unoptimized for deployment flexibility
- Uses `src/` directory structure for better organization
- Uses absolute imports with `@/` prefix pointing to `src/` directory
- All components are properly typed with TypeScript interfaces
- Blog functionality gracefully degrades if Notion is not configured
- ISR ensures blog content updates automatically without rebuilds
- Comprehensive error handling and fallback UI for blog features