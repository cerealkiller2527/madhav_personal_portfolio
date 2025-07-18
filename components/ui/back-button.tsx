"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  sectionId: string
  children: React.ReactNode
  className?: string
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link"
  size?: "sm" | "default" | "lg" | "icon"
}

export function BackButton({ sectionId, children, className, variant = "outline", size }: BackButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Store the section to scroll to and navigate smoothly
    sessionStorage.setItem("scrollTo", sectionId)
    router.push("/")
  }

  return (
    <Button onClick={handleClick} className={className} variant={variant} size={size}>
      {children}
    </Button>
  )
}
