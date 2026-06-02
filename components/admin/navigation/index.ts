export { AdminSidebar } from './sidebar'
export { ModuleBar } from './module-bar'
export { AdminTopBar } from './top-bar'

// Re-export with old names for backward compatibility
export { ModuleBar as ModuleNavBar } from './module-bar'
export { AdminTopBar as AdminTopNavbar } from './top-bar'

export { useActiveSection } from './hooks/use-navigation'
export { detectSection, sectionLabels, sectionModules, sidebarGroups } from './config/sections'
export type { ModuleLink, ModuleGroup, ModuleEntry, ModuleSection, SectionModules, SidebarLeaf, SidebarMenu, SidebarEntry, SidebarGroup } from './config/sections'
