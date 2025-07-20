"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogoSpinnerInline } from "@/components/ui/logo-spinner"
import { Download, ChevronLeft, ChevronRight, Loader2, X, Code, Bot, Settings, Zap, ZoomIn, ZoomOut, RotateCcw, Printer, Maximize2, Minimize2 } from "lucide-react"

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(() => import("react-pdf").then(mod => ({ default: mod.Document })), { ssr: false })
const Page = dynamic(() => import("react-pdf").then(mod => ({ default: mod.Page })), { ssr: false })

// Set up the worker and CSS client-side only
if (typeof window !== 'undefined') {
  import("react-pdf").then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
  })
  
  // Import CSS dynamically
  import("react-pdf/dist/Page/AnnotationLayer.css")
  import("react-pdf/dist/Page/TextLayer.css")
}

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
  const [loadingTab, setLoadingTab] = useState<string>("software") // Separate loading state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeResume = resumeTypes.find(resume => resume.id === activeTab) || resumeTypes[0]
  const loadingResume = resumeTypes.find(resume => resume.id === loadingTab) || resumeTypes[0]

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle quick tab transitions
  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return
    
    setActiveTab(newTab)
    setLoadingTab(newTab)
    setPageNumber(1)
    setNumPages(null)
    setScale(1.0)
    setRotation(0)
  }

  // Reset page and view settings when switching tabs
  useEffect(() => {
    if (loadingTab === activeTab) {
      setPageNumber(1)
      setNumPages(null)
      setScale(1.0)
      setRotation(0)
    }
  }, [loadingTab, activeTab])

  // This effect ensures the PDF page resizes correctly when the window size changes.
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize() // Set initial width
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
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
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))

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
                  onClick={handleRotate}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
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
            
            {numPages && numPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-lg glass-effect flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="text-xs font-medium px-1 sm:px-2 min-w-[50px] sm:min-w-[60px] text-center">
                  {pageNumber} / {numPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-500/20 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-muted/20 dark:bg-muted/40 overflow-auto p-2 sm:p-4" ref={containerRef}>
          <div className="h-full">
            {isClient ? (
              <Document
                key={loadingTab}
                file={loadingResume.filePath}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
                error={
                  <div className="flex justify-center items-center h-full text-destructive">
                    <div className="text-center">
                      <p className="font-medium">Failed to load PDF</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please try downloading it or switching to another resume
                      </p>
                    </div>
                  </div>
                }
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth > 0 ? Math.min(containerWidth - 32, 800) * scale : undefined}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-xl rounded-lg overflow-hidden transition-all duration-300"
                  onRenderError={(error) => {
                    // Suppress TextLayer cancellation warnings
                    if (error?.message?.includes('TextLayer task cancelled')) {
                      return;
                    }
                    console.warn('PDF render error:', error);
                  }}
                />
              </Document>
            ) : (
              <div className="flex justify-center items-center h-full">
                <LogoSpinnerInline size="md" text="Loading PDF Viewer..." />
              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}