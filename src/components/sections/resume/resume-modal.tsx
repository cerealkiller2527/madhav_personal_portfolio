"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react"

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

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

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
    link.href = "/resume.pdf"
    link.download = "Madhav_Lodha_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-4xl h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg sm:text-xl">My Résumé</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Madhav Lodha - Robotics & Software Engineer
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2 -mt-2 -mr-2">
            <Button onClick={handleDownload} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/20 dark:bg-muted/40 overflow-y-auto p-2 sm:p-4" ref={containerRef}>
          {isClient ? (
            <Document
              file="/resume.pdf" // This path points to the public directory
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-4 text-muted-foreground">Loading Resume...</span>
                </div>
              }
              error={
                <div className="flex justify-center items-center h-full text-destructive">
                  Failed to load PDF. Please try downloading it.
                </div>
              }
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                width={containerWidth > 0 ? Math.min(containerWidth - 16, 800) : undefined}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-4 text-muted-foreground">Loading PDF Viewer...</span>
            </div>
          )}
        </div>

        {numPages && numPages > 1 && (
          <div className="p-2 sm:p-4 border-t flex justify-center items-center gap-4 bg-background">
            <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Page {pageNumber} of {numPages}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
