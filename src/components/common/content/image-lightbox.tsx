// Full-screen image lightbox with zoom controls and keyboard navigation

"use client"

import { useEffect, useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, Maximize } from "lucide-react"

// ============================================================================
// Types
// ============================================================================

interface ImageLightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

// ============================================================================
// Constants
// ============================================================================

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

const BUTTON_CLASS =
  "flex items-center justify-center w-9 h-9 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"

// ============================================================================
// Component
// ============================================================================

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Reset zoom when a new image opens
  useEffect(() => {
    if (isOpen) setScale(1)
  }, [isOpen, src])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  const handleClose = useCallback(() => onClose(), [onClose])
  const zoomIn = useCallback(() => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE)), [])
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE)), [])
  const resetZoom = useCallback(() => setScale(1), [])

  // Keyboard: ESC closes, +/- zoom, 0 resets
  // Uses capture phase so ESC is handled before Radix Dialog
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault()
          e.stopPropagation()
          handleClose()
          break
        case "+":
        case "=":
          e.preventDefault()
          zoomIn()
          break
        case "-":
          e.preventDefault()
          zoomOut()
          break
        case "0":
          e.preventDefault()
          resetZoom()
          break
      }
    }

    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [isOpen, handleClose, zoomIn, zoomOut, resetZoom])

  // Scroll-wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
      setScale((s) => Math.min(Math.max(s + delta, MIN_SCALE), MAX_SCALE))
    },
    []
  )

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onWheel={handleWheel}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={handleClose}
            role="button"
            tabIndex={-1}
            aria-label="Close image preview"
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image */}
          <motion.div
            className="relative z-[1] flex items-center justify-center"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
          >
            {/* Using native img because the src is already a resolved URL from Notion */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.2s ease",
              }}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>

          {/* Alt text / caption */}
          {alt && alt !== "Image" && (
            <p className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 max-w-lg text-center text-sm text-white/50 truncate pointer-events-none">
              {alt}
            </p>
          )}

          {/* Zoom toolbar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className={BUTTON_CLASS} aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="min-w-[3.5rem] text-center text-sm font-medium text-white/70 select-none tabular-nums">
              {Math.round(scale * 100)}%
            </span>

            <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className={BUTTON_CLASS} aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="w-px h-5 bg-white/20 mx-0.5" />

            <button onClick={resetZoom} disabled={scale === 1} className={BUTTON_CLASS} aria-label="Reset zoom">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
