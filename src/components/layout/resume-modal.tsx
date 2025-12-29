"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogoSpinnerInline } from "@/components/common/ui/logo-spinner"
import { Download, X, Code, Bot, Settings, Zap } from "lucide-react"

interface ResumeType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  filePath: string
  downloadName: string
}

const resumeTypes: ResumeType[] = [
  {
    id: "software",
    title: "Software Engineering",
    description: "Full-stack development & programming",
    icon: <Code className="h-4 w-4" />,
    filePath: "/documents/Software Engineering/Madhav_Lodha_Software_resume.pdf",
    downloadName: "Madhav_Lodha_Software_Resume.pdf"
  },
  {
    id: "robotics",
    title: "Robotics Engineering",
    description: "Robotics systems & automation",
    icon: <Bot className="h-4 w-4" />,
    filePath: "/documents/Robotics Engineering/Madhav_Lodha_Robotics_Resume.pdf",
    downloadName: "Madhav_Lodha_Robotics_Resume.pdf"
  },
  {
    id: "mechanical",
    title: "Mechanical Engineering",
    description: "Mechanical design & manufacturing",
    icon: <Settings className="h-4 w-4" />,
    filePath: "/documents/Mechanical Engineering/Madhav_Lodha_Mechanical_resume.pdf",
    downloadName: "Madhav_Lodha_Mechanical_Resume.pdf"
  },
  {
    id: "electrical",
    title: "Electrical Engineering",
    description: "Electronics & circuit design",
    icon: <Zap className="h-4 w-4" />,
    filePath: "/documents/Electrical Engineering/Madhav_Lodha_Electrical_resume.pdf",
    downloadName: "Madhav_Lodha_Electrical_Resume.pdf"
  }
]

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<string>("software")
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activeResume = resumeTypes.find(resume => resume.id === activeTab) || resumeTypes[0]

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return
    setActiveTab(newTab)
    setIsLoading(true)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = activeResume.filePath
    link.download = activeResume.downloadName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl">My Résumés</DialogTitle>
              <DialogDescription className="hidden sm:block">
                Madhav Lodha - {activeResume.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button onClick={handleDownload} size="sm" variant="ghost" className="px-2 sm:px-3">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center pt-3 sm:pt-4">
            <div className="flex gap-0.5 xs:gap-1 sm:gap-2 p-1 sm:p-2 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/25 backdrop-blur-md">
              {resumeTypes.map((resume) => (
                <motion.button
                  key={resume.id}
                  onClick={() => handleTabChange(resume.id)}
                  className="relative flex items-center justify-center gap-1 sm:gap-2 p-2 xs:px-2 sm:px-4 xs:py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  {activeTab === resume.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg backdrop-blur-xl bg-primary/50 dark:bg-primary/40 border border-primary/50 dark:border-primary/50 shadow-md shadow-black/10 dark:shadow-black/20"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1 sm:gap-2 ${
                    activeTab === resume.id ? 'text-white' : 'text-foreground'
                  }`}>
                    {resume.icon}
                    <span className="hidden xs:inline sm:hidden">{resume.title.split(' ')[0]}</span>
                    <span className="hidden sm:inline">{resume.title}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </DialogHeader>


        <div className="flex-1 bg-muted/20 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 z-10">
              <LogoSpinnerInline size="md" text="Loading PDF..." />
            </div>
          )}
          
          <div className="w-full h-full overflow-auto p-2 sm:p-4">
            <div className="flex justify-center items-start min-h-full">
              <div className="w-full max-w-[90vw] xs:max-w-[85vw] sm:max-w-[800px] shadow-xl rounded-lg overflow-hidden bg-white">
                <div className="relative w-full" style={{ paddingBottom: '141.4%' /* A4 ratio */ }}>
                  <iframe
                    ref={iframeRef}
                    key={activeTab}
                    src={`${activeResume.filePath}#view=FitH`}
                    className="absolute inset-0 w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title={`${activeResume.title} Resume`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}