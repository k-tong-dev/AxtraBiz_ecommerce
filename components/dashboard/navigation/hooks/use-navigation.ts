'use client'

import { usePathname } from 'next/navigation'
import { detectSection, sectionLabels, sectionModules } from '../config/sections'

export function useActiveSection() {
  const pathname = usePathname()
  const section = detectSection(pathname)
  return {
    section,
    label: sectionLabels[section] || 'Dashboard',
    entries: sectionModules[section]?.entries || [],
    pathname,
  }
}
