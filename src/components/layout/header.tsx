"use client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import type React from "react"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Home, Briefcase, Code, Mail, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme/theme-toggle"
import { GlobalSearch } from "@/components/common/global-search"
import { useSearch } from "@/lib/context/search-context"
import { smoothScrollToElement } from "@/lib/core/utils"

const navItems = [
  { name: "Home", id: "home", icon: <Home className="h-4 w-4" />, href: "/" },
  { name: "Experience", id: "experience", icon: <Briefcase className="h-4 w-4" />, href: "/#experience" },
  { name: "Projects", id: "projects", icon: <Code className="h-4 w-4" />, href: "/#projects" },
  { name: "Blog", id: "blog", icon: <BookOpen className="h-4 w-4" />, href: "/blog" },
  { name: "Contact", id: "contact", icon: <Mail className="h-4 w-4" />, href: "/#contact" },
]

interface HeaderProps {
  onResumeOpen: () => void
}

export function Header({ onResumeOpen }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { projects, blogPosts, onProjectSelect } = useSearch()
  const [activeSection, setActiveSection] = useState("home")
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const updateIndicator = (id: string) => {
    const item = itemRefs.current.get(id)
    const nav = navRef.current
    if (item && nav) {
      const navRect = nav.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      setIndicatorStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      })
    }
  }

  useLayoutEffect(() => {
    if (activeSection) {
      updateIndicator(activeSection)
    }
  }, [activeSection])

  useEffect(() => {
    const handleResize = () => {
      if (activeSection) updateIndicator(activeSection)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeSection])

  useEffect(() => {
    if (pathname !== "/") {
      if (pathname.startsWith("/blog")) {
        setActiveSection("blog")
      } else if (pathname.startsWith("/projects")) {
        setActiveSection("projects")
      } else {
        setActiveSection("")
      }
      return
    }

    const sectionIds = ["contact", "projects", "experience", "home"]
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id)
            return
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveSection("home")
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

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
              <div className="relative w-full h-full rounded-full overflow-hidden">
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

          <nav ref={navRef} className="flex items-center justify-center relative">
            {activeSection && indicatorStyle.width > 0 && (
              <motion.div
                className="absolute top-0 h-full rounded-lg bg-white/15 border border-white/20"
                initial={false}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {navItems.map((item) => (
              <Link
                key={item.id}
                ref={(el) => { if (el) itemRefs.current.set(item.id, el) }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer ${
                  activeSection === item.id 
                    ? "text-white" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon}
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <GlobalSearch
              projects={projects}
              blogPosts={blogPosts}
              onProjectSelect={onProjectSelect || undefined}
            />
            <Button
              variant="glass"
              size="icon"
              onClick={onResumeOpen}
              className="h-8 w-8 lg:w-auto lg:px-3 bg-primary/20 border-primary/30 hover:bg-primary/30 hover:border-primary/40 text-white"
            >
              <Eye className="h-4 w-4 lg:mr-1.5" />
              <span className="hidden lg:inline text-xs">Résumé</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
