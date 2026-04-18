'use client'

import { useEffect, useState, useRef } from 'react'

export function useSidebarDrag() {
  const [isOpen, setIsOpen] = useState(false)
  const touchStartX = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if touch starts within 20px from left edge
      if (e.touches[0].clientX < 20) {
        touchStartX.current = e.touches[0].clientX
        isDragging.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return

      const currentX = e.touches[0].clientX
      const diff = currentX - touchStartX.current

      // If dragged more than 50px to the right from the left edge, open sidebar
      if (diff > 50) {
        setIsOpen(true)
        isDragging.current = false
      }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    // Also handle mouse drag on desktop for testing
    const handleMouseDown = (e: MouseEvent) => {
      if (e.clientX < 20) {
        touchStartX.current = e.clientX
        isDragging.current = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const diff = e.clientX - touchStartX.current
      if (diff > 50) {
        setIsOpen(true)
        isDragging.current = false
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
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
  }, [])

  return {
    isOpen,
    setIsOpen,
  }
}
