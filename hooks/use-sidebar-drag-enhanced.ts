'use client'

import { useState, useEffect, useRef } from 'react'

interface TouchState {
  startX: number
  startY: number
  currentX: number
  isDragging: boolean
}

export function useSidebarDragEnhanced() {
  const [isOpen, setIsOpen] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isDragging: false,
  })

  const DRAG_THRESHOLD = 50 // pixels to drag before sidebar opens
  const DRAG_VELOCITY_THRESHOLD = 5 // pixels per ms for quick swipe
  const LEFT_DRAG_ZONE = 100 // pixels from left edge to start drag

  useEffect(() => {
    const startDrag = (clientX: number, clientY: number) => {
      if (clientX <= LEFT_DRAG_ZONE || isOpen) {
        touchState.current = {
          startX: clientX,
          startY: clientY,
          currentX: clientX,
          isDragging: true,
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startDrag(touch.clientX, touch.clientY)
    }

    const updateDrag = (clientX: number, clientY: number) => {
      if (!touchState.current.isDragging) return

      const deltaX = clientX - touchState.current.startX
      const deltaY = clientY - touchState.current.startY

      // Check if it's more horizontal than vertical (not a scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        touchState.current.currentX = clientX

        // Calculate progress for visual feedback
        if (isOpen) {
          // Closing: drag right to left
          const progress = Math.max(0, Math.min(1, (300 - clientX) / 300))
          setDragProgress(progress)
        } else {
          // Opening: drag left to right
          const progress = Math.max(0, Math.min(1, deltaX / DRAG_THRESHOLD))
          setDragProgress(progress)
        }
      }
    }

    const endDrag = () => {
      if (!touchState.current.isDragging) return

      const deltaX = touchState.current.currentX - touchState.current.startX
      const velocity = Math.abs(deltaX) / 100 // rough velocity calculation

      if (isOpen) {
        // Sidebar is open - check if we should close it
        if (deltaX < -DRAG_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD) {
          setIsOpen(false)
        }
      } else {
        // Sidebar is closed - check if we should open it
        if (deltaX > DRAG_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD) {
          setIsOpen(true)
        }
      }

      setDragProgress(0)
      touchState.current.isDragging = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      updateDrag(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = () => {
      endDrag()
    }

    // Mouse support for desktop / large screens
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      startDrag(e.clientX, e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      updateDrag(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      endDrag()
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isOpen])

  return {
    isOpen,
    setIsOpen,
    dragProgress,
  }
}
