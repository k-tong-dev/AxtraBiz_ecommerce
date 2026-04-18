'use client'

import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  let lastScrollY = 0
  let scrollTimeout: NodeJS.Timeout | null = null

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 100) {
        // Only show/hide after scrolling down 100px
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(true)
        } else {
          // Scrolling up
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
      setScrollY(currentScrollY)

      // Clear existing timeout
      if (scrollTimeout) clearTimeout(scrollTimeout)

      // Hide navbar after scroll stops (after 2 seconds of no scrolling)
      scrollTimeout = setTimeout(() => {
        if (currentScrollY > 100) {
          setIsVisible(false)
        }
      }, 2000)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  return { isVisible, scrollY }
}
