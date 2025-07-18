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

### Important Notes
- Build errors and TypeScript errors are ignored in production (`next.config.mjs`)
- Images are unoptimized for deployment flexibility
- Uses `src/` directory structure for better organization
- Uses absolute imports with `@/` prefix pointing to `src/` directory
- All components are properly typed with TypeScript interfaces