# Madhav Lodha's Portfolio Website

Hey there! 👋 This is the source code for my personal portfolio website. It's a modern, responsive web app that showcases my projects, blog posts, and professional experience.

## What's Inside

This portfolio is built with some pretty cool tech:

- **Next.js 15** - The React framework that makes everything fast and SEO-friendly
- **TypeScript** - Keeps the code clean and catches bugs early
- **Tailwind CSS** - For styling without the hassle
- **Notion API** - My CMS of choice (because who wants to manage a database?)
- **Framer Motion** - Smooth animations that make things feel alive
- **React Notion X** - Renders my Notion pages beautifully

## Getting Started

Want to run this locally? Here's how:

### Prerequisites

You'll need:
- Node.js 18+ installed
- pnpm (this project uses pnpm for package management)
- A Notion account with API access (if you want to use the CMS features)

### Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/portfolio-clone.git
cd portfolio-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your environment variables. Create a `.env.local` file:
```
# Notion Integration
NOTION_TOKEN=your_notion_api_token
NOTION_DATABASE_ID=your_blog_database_id
NOTION_PROJECTS_DATABASE_ID=your_projects_database_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Giscus Comments (optional)
NEXT_PUBLIC_GISCUS_REPO=your-github-username/your-repo-name
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# Author Info
AUTHOR_EMAIL=your.email@example.com
```

4. Run the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` and you should see the site running!

## How to Deploy

This site is configured for static export, which means you can host it anywhere that serves HTML files. Here's the process:

### Build for Production

```bash
pnpm build
```

This creates an `out` folder with all your static files.

### Deployment Options

1. **Vercel** (Recommended)
   - Just connect your GitHub repo
   - Vercel automatically detects Next.js and deploys it

2. **Netlify**
   - Drag and drop the `out` folder
   - Or connect your GitHub repo with build command: `pnpm build`

3. **GitHub Pages**
   - Push the `out` folder to a `gh-pages` branch
   - Enable GitHub Pages in your repo settings

4. **Any Static Host**
   - Upload the contents of the `out` folder
   - That's it! No server required

## Project Structure

Here's how everything is organized:

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
│   ├── common/      # Shared components (theme, loading, etc.)
│   ├── layout/      # Header, footer, navigation
│   ├── pages/       # Page-specific components
│   ├── projects/    # Project showcase components
│   └── ui/          # Basic UI components (buttons, cards)
├── lib/             # Core functionality
│   ├── core/        # Config, data, utilities
│   ├── hooks/       # Custom React hooks
│   ├── notion/      # Notion API integration
│   ├── schemas/     # TypeScript type definitions
│   └── utils/       # Helper functions
└── styles/          # Global styles and overrides
```

## Design Choices

Let me explain some of the decisions I made:

### Why Static Export?

I chose to build this as a static site because:
- It's blazing fast (no server round trips)
- Can be hosted anywhere for free
- Better SEO out of the box
- No server to maintain or worry about

### Why Notion as CMS?

- I'm already using Notion for everything else
- No need to build an admin panel
- Rich text editing is already solved
- Can update content from anywhere

### Component Architecture

The components are organized by feature rather than type:
- `common/` - Stuff used everywhere
- `pages/` - Components for specific pages
- `projects/` - Everything related to showcasing projects

This makes it easy to find what you're looking for.

### Styling Approach

I went with Tailwind CSS because:
- No context switching between CSS and JSX
- Built-in dark mode support
- Easy responsive design
- Smaller bundle size (unused styles are removed)

## Customization

Want to make this your own? Here's what to change:

1. **Personal Info**: Edit `src/lib/core/data.ts`
2. **Colors**: Modify the CSS variables in `src/app/globals.css`
3. **Fonts**: Change the font import in `src/app/layout.tsx`
4. **Resume**: Add your PDFs to `public/documents/`
5. **Images**: Replace files in `public/assets/portfolio/`

## Performance Tips

The site is already optimized, but here are some things to know:

- Images are served unoptimized in static export mode
- Use WebP format for better compression
- Keep your Notion pages reasonably sized
- The build process fetches all content at once

## Troubleshooting

### Build Fails
- Check your environment variables
- Make sure Notion databases are shared with your integration
- Look for TypeScript errors in the build output

### Content Not Updating
- The site uses build-time caching
- You need to rebuild to see Notion changes
- In development, restart the server to clear cache

### Styling Issues
- Make sure Tailwind classes aren't purged incorrectly
- Check for conflicting styles in globals.css
- Dark mode uses the `dark:` prefix

## Contributing

Found a bug or want to add a feature? Feel free to:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License. Feel free to use it as a starting point for your own portfolio!

---

Built with ❤️ by Madhav Lodha