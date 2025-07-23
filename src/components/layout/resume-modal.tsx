"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogoSpinnerInline } from "@/components/ui/logo-spinner"
import { Download, X, Code, Bot, Settings, Zap, ZoomIn, ZoomOut, Printer, Maximize2, Minimize2 } from "lucide-react"

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
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activeResume = resumeTypes.find(resume => resume.id === activeTab) || resumeTypes[0]

  // Handle quick tab transitions
  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return
    
    setActiveTab(newTab)
    setScale(1.0)
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

  const handlePrint = () => {
    window.open(activeResume.filePath, '_blank')
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setScale(1.0)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isFullscreen ? 'w-screen h-screen max-w-none' : 'w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-6xl h-[95vh] sm:h-[90vh]'} flex flex-col p-0 gap-0 [&>button]:hidden transition-all duration-300`}>
        <DialogHeader className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b backdrop-blur-sm bg-background/80">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg lg:text-xl truncate">My Résumés</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm truncate">
                Madhav Lodha - {activeResume.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 -mt-2 -mr-2 flex-shrink-0">
              <Button onClick={handleDownload} size="sm" variant="ghost" className="glass-effect text-xs sm:text-sm px-2 sm:px-3">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 hover:bg-primary hover:text-white h-8 w-8 sm:h-10 sm:w-10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          
          {/* Glass Panel Tabs */}
          <div className="flex justify-center pt-4 -mb-4">
            <div className="flex gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl glass-effect shadow-xl border border-white/10 dark:border-white/5">
              {resumeTypes.map((resume) => (
                <motion.button
                  key={resume.id}
                  onClick={() => handleTabChange(resume.id)}
                  className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  {activeTab === resume.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-lg shadow-lg"
                      initial={false}
                      transition={{ 
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        duration: 0.4
                      }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1 sm:gap-1.5 transition-colors duration-200 font-semibold ${
                    activeTab === resume.id 
                      ? 'text-white dark:text-white' 
                      : 'text-foreground/95 dark:text-foreground/90 hover:text-foreground/80 dark:hover:text-white'
                  }`}>
                    <span className="sm:hidden">{resume.icon}</span>
                    <span className="hidden sm:flex sm:items-center sm:gap-1.5">
                      {resume.icon}
                      {resume.title}
                    </span>
                    <span className="hidden xs:inline sm:hidden text-xs">
                      {resume.title.replace(" Engineering", "")}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* PDF Toolbar */}
        <div className="px-2 sm:px-4 py-2 sm:py-3 border-b bg-muted/30 backdrop-blur-sm">
          <div className="flex justify-between items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 p-1 rounded-lg glass-effect">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs hover:bg-orange-500/20 transition-colors"
                >
                  {Math.round(scale * 100)}%
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= 3.0}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1 p-1 rounded-lg glass-effect">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-muted/20 dark:bg-muted/40 overflow-auto p-2 sm:p-4 relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm z-10">
              <LogoSpinnerInline size="md" text="Loading PDF..." />
            </div>
          )}
          
          <div className="h-full flex justify-center items-center">
            <div 
              className="transition-transform duration-300 shadow-xl rounded-lg overflow-hidden"
              style={{ transform: `scale(${scale})` }}
            >
              <iframe
                ref={iframeRef}
                key={activeTab}
                src={activeResume.filePath}
                width="800"
                height="1100"
                className="border-0 bg-white"
                onLoad={handleIframeLoad}
                title={`${activeResume.title} Resume`}
              />
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}