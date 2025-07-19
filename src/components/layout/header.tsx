"use client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import type React from "react"
import type { HeaderProps } from "@/types/componentTypes"

import { motion } from "framer-motion"
import Image from "next/image"
import { Home, Briefcase, Code, Mail, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { smoothScrollToElement } from "@/lib/utils"

const navItems = [
  { name: "Home", id: "home", icon: <Home className="h-4 w-4" />, href: "/" },
  { name: "Experience", id: "experience", icon: <Briefcase className="h-4 w-4" />, href: "/#experience" },
  { name: "Projects", id: "projects", icon: <Code className="h-4 w-4" />, href: "/#projects" },
  { name: "Blog", id: "blog", icon: <BookOpen className="h-4 w-4" />, href: "/blog" },
  { name: "Contact", id: "contact", icon: <Mail className="h-4 w-4" />, href: "/#contact" },
]

export function Header({ onResumeOpen }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
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
      smoothScrollToElement(item.id, 800)
    } else {
      // We are on another page, so navigate to home and tell it to scroll
      sessionStorage.setItem("scrollTo", item.id)
      router.push("/")
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-screen-xl px-4 pt-3 md:pt-4">
        <div className="flex h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 dark:bg-white/10 px-4 shadow-xl backdrop-blur-lg">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, navItems[0])}
            aria-label="Go to home page"
            className="cursor-pointer"
          >
            <div className="relative w-10 h-10 flex-shrink-0 transition-transform hover:scale-110 rounded-full overflow-hidden bg-primary p-1.5">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/assets/portfolio/avatar-logo.png"
                  alt="Madhav Lodha Avatar"
                  fill
                  sizes="32px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </Link>

          <nav className="flex items-center justify-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:text-white hover:bg-white/10 cursor-pointer text-white/70"
              >
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={onResumeOpen}
              className="glass-effect border-white/20 text-white font-medium text-xs px-3 py-1.5 h-auto hover:bg-white/20 transition-all duration-200"
            >
              <Eye className="mr-0 sm:mr-1.5 h-3 w-3" />
              <span className="hidden sm:inline">View Résumé</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
