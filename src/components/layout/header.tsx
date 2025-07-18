"use client"
import { useRouter, usePathname } from "next/navigation"
import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { Home, Briefcase, Code, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { smoothScrollToElement } from "@/lib/utils"

const navItems = [
  { name: "Home", id: "home", icon: <Home className="h-4 w-4" /> },
  { name: "Experience", id: "experience", icon: <Briefcase className="h-4 w-4" /> },
  { name: "Projects", id: "projects", icon: <Code className="h-4 w-4" /> },
  { name: "Contact", id: "contact", icon: <Mail className="h-4 w-4" /> },
]

export function Header({ onResumeOpen }: { onResumeOpen: () => void }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()

    if (pathname === "/") {
      // We are on the homepage, so just scroll smoothly
      smoothScrollToElement(sectionId, 800)
    } else {
      // We are on another page, so navigate to home and tell it to scroll
      sessionStorage.setItem("scrollTo", sectionId)
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
          <a
            href="/"
            onClick={(e) => handleNavClick(e, "home")}
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
          </a>

          <nav className="flex items-center justify-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`} // Keep for semantics, but prevent default
                onClick={(e) => handleNavClick(e, item.id)}
                className="flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-medium text-white/70 transition-colors duration-200 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={onResumeOpen}
              className="bg-primary hover:bg-primary/90 text-white font-medium text-xs px-3 py-1.5 h-auto"
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
