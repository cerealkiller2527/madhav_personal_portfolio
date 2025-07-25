"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ResumeModal } from "@/components/layout/resume-modal"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onResumeOpen={() => setIsResumeModalOpen(true)} />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  )
}