"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    title: "Software",
    description: "Full-stack development & programming",
    icon: <Code className="h-4 w-4" />,
    filePath: "/documents/Software Engineering/Madhav_Lodha_Software_resume.pdf",
    downloadName: "Madhav_Lodha_Software_Resume.pdf"
  },
  {
    id: "robotics",
    title: "Robotics",
    description: "Robotics systems & automation",
    icon: <Bot className="h-4 w-4" />,
    filePath: "/documents/Robotics Engineering/Madhav_Lodha_Robotics_Resume.pdf",
    downloadName: "Madhav_Lodha_Robotics_Resume.pdf"
  },
  {
    id: "mechanical",
    title: "Mechanical",
    description: "Mechanical design & manufacturing",
    icon: <Settings className="h-4 w-4" />,
    filePath: "/documents/Mechanical Engineering/Madhav_Lodha_Mechanical_resume.pdf",
    downloadName: "Madhav_Lodha_Mechanical_Resume.pdf"
  },
  {
    id: "electrical",
    title: "Electrical",
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
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="glass-subtle">
                {resumeTypes.map((resume) => (
                  <TabsTrigger
                    key={resume.id}
                    value={resume.id}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {resume.icon}
                    <span className="hidden sm:inline">{resume.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        <div className="flex-1 glass-subtle overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center glass z-10">
              <LogoSpinnerInline size="md" text="Loading PDF..." />
            </div>
          )}
          
          <ScrollArea className="w-full h-full">
            <div className="p-2 sm:p-4">
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
