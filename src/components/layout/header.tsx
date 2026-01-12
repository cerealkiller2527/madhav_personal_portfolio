"use client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import type React from "react"
import { motion } from "framer-motion"
import { Home, Briefcase, Code, Mail, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/common/theme/theme-toggle"
import { smoothScrollToElement } from "@/lib/core/utils"
import { navItems, type NavItem } from "@/lib/core/data"

// Animation and scroll constants
const SCROLL_DURATION_MS = 800
const HEADER_INITIAL_Y = -100

// Map nav item IDs to their icons
const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  projects: <Code className="h-4 w-4" />,
  blog: <BookOpen className="h-4 w-4" />,
  contact: <Mail className="h-4 w-4" />,
}

interface HeaderProps {
  onResumeOpen: () => void
}

export function Header({ onResumeOpen }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault()

    // Handle blog navigation separately
    if (item.id === "blog") {
      router.push("/blog")
      return
    }

    // Handle home navigation
    if (item.id === "home") {
      router.push("/")
      return
    }

    // Handle section navigation
    if (pathname === "/") {
      // We are on the homepage, so just scroll smoothly
      smoothScrollToElement(item.id, SCROLL_DURATION_MS)
    } else {
      // We are on another page, so navigate to home and tell it to scroll
      sessionStorage.setItem("scrollTo", item.id)
      router.push("/")
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: HEADER_INITIAL_Y, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-screen-xl px-4 pt-3 md:pt-4">
        <div className="flex h-14 w-full items-center justify-between rounded-xl glass-strong px-4 shadow-xl">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, navItems[0])}
            aria-label="Go to home page"
            className="cursor-pointer"
          >
            <div className="flex-shrink-0 transition-transform hover:scale-110 rounded-full bg-primary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/assets/portfolio/avatar-logo.png"
                  alt="Madhav Lodha Avatar"
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">ML</AvatarFallback>
              </Avatar>
            </div>
          </Link>

          <nav className="flex items-center justify-center">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="nav"
                size="sm"
                asChild
                className="px-2 lg:px-3 h-8"
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {NAV_ICONS[item.id]}
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={onResumeOpen}
              variant="glass"
              size="sm"
              className="text-xs"
            >
              <Eye className="mr-0 lg:mr-1.5 h-3 w-3" />
              <span className="hidden lg:inline">View Résumé</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
