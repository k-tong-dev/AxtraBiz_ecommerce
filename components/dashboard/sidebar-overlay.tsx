'use client'

import { useSidebarDragEnhanced } from '@/hooks/use-sidebar-drag-enhanced'

export function SidebarOverlay() {
  const { isOpen, setIsOpen } = useSidebarDragEnhanced()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 md:hidden"
      onClick={() => setIsOpen(false)}
    />
  )
}
