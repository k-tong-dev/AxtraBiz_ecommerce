'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, HelpCircle } from 'lucide-react'
import { Nav, Sidenav } from 'rsuite'
import { useAuth } from '@/hooks/use-auth'
import {
  sidebarGroups,
  detectSection,
  resolveIcon,
  isMenuEntry,
} from './config/sections'
import type { SidebarLeaf } from './config/sections'

function GroupLabel({ label }: { label: string }) {
  return (
    <div className="pt-4 pb-1">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.15em]">
          {label}
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>
    </div>
  )
}

function NavItem({
  leaf,
  onSelect,
}: {
  leaf: SidebarLeaf
  onSelect: (href: string) => void
}) {
  const Icon = resolveIcon(leaf.icon)
  return (
    <Nav.Item
      eventKey={leaf.section}
      icon={<Icon className="h-3.5 w-3.5 text-primary/70" />}
      onSelect={() => onSelect(leaf.href)}
    >
      <span className="flex items-center justify-between w-full">
        <span>{leaf.label}</span>
        {leaf.badge != null && (
          <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {leaf.badge}
          </span>
        )}
      </span>
    </Nav.Item>
  )
}

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const activeSection = detectSection(pathname)
  const [mounted, setMounted] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    sidebarGroups.flatMap((g) =>
      g.entries
        .filter((e) => isMenuEntry(e) && e.children.some((c) => c.section === detectSection(pathname)))
        .map((e) => e.label)
    )
  )
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Auto-expand the menu that contains the active section
  useEffect(() => {
    setOpenKeys((prev) => {
      const needed = sidebarGroups.flatMap((g) =>
        g.entries
          .filter((e) => isMenuEntry(e) && e.children.some((c) => c.section === activeSection))
          .map((e) => e.label)
      )
      const next = new Set([...prev, ...needed])
      return prev.length === next.size && needed.every((k) => prev.includes(k))
        ? prev
        : [...next]
    })
  }, [activeSection])

  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)
  const onNav = (href: string) => {
    router.push(href)
    close()
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={toggle}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-background/70 backdrop-blur border border-border/60 hover:bg-background transition-colors shadow-sm"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-background/80 backdrop-blur-xl transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col border-r border-border/60 shadow-sm`}
      >
        {/* Header — compact user */}
        <div className="shrink-0 px-3 pt-3 pb-2">
          {user && (
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-2 border border-border/40">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-semibold text-[11px]">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-xs font-medium text-foreground/80 truncate">
                  {user.name || 'Admin User'}
                </p>
                <p className="text-[10px] text-muted-foreground/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-0 pb-2 scrollbar-thin">
          {mounted ? (
            <Sidenav
              expanded
              appearance="subtle"
              className="!bg-transparent"
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys.map(String))}
            >
              <Sidenav.Body>
                <Nav
                  activeKey={activeSection}
                  className="!bg-transparent !px-0"
                >
                  {sidebarGroups.map((group) => (
                    <div key={group.label}>
                      <GroupLabel label={group.label} />
                      {group.entries.map((entry) => {
                        if (isMenuEntry(entry)) {
                          const MenuIcon = resolveIcon(entry.icon)
                          return (
                            <Nav.Menu
                              key={entry.label}
                              eventKey={entry.label}
                              icon={<MenuIcon className="h-3.5 w-3.5 text-primary/70" />}
                              title={entry.label}
                            >
                              {entry.children.map((child) => (
                                <NavItem key={child.href} leaf={child} onSelect={onNav} />
                              ))}
                            </Nav.Menu>
                          )
                        }
                        return <NavItem key={entry.href} leaf={entry} onSelect={onNav} />
                      })}
                    </div>
                  ))}
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          ) : (
            <div className="px-3 py-6 text-center">
              <div className="animate-pulse space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-md"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 8%, transparent)' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — help */}
        <div className="shrink-0 px-3 py-2.5 border-t border-border/40">
          <a
            href="https://docs.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full h-8 px-2 rounded-md text-xs font-medium text-muted-foreground/60 hover:text-foreground/80 hover:bg-muted/60 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Help Center</span>
          </a>
        </div>
      </aside>

      <style>{`
        .rs-sidenav-subtle { background-color: transparent !important; }

        .rs-sidenav-item,
        .rs-nav-item,
        .rs-nav-item-content {
          background-color: transparent !important;
          color: inherit !important;
          transition: all 0.15s ease !important;
        }

        .rs-nav-item:not(.rs-nav-item-disabled) > .rs-nav-item-content,
        .rs-sidenav-item:not(.rs-sidenav-item-disabled) > .rs-sidenav-item-content {
          padding: 5px 10px !important;
          border-radius: 5px !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
          color: color-mix(in srgb, var(--foreground) 60%, transparent) !important;
        }

        .rs-nav-item:not(.rs-nav-item-disabled) > .rs-nav-item-content:hover,
        .rs-sidenav-item:not(.rs-sidenav-item-disabled) > .rs-sidenav-item-content:hover {
          background-color: color-mix(in srgb, var(--primary) 10%, transparent) !important;
          color: var(--foreground) !important;
        }

        .rs-nav-item-active > .rs-nav-item-content,
        .rs-sidenav-item-active > .rs-sidenav-item-content {
          background-color: color-mix(in srgb, var(--primary) 12%, transparent) !important;
          color: var(--foreground) !important;
          font-weight: 500 !important;
          box-shadow: inset 2px 0 0 0 color-mix(in srgb, var(--primary) 60%, transparent) !important;
        }

        .rs-nav-item-content > .rs-icon,
        .rs-sidenav-item-content > .rs-icon {
          margin-right: 8px !important;
        }

        /* Nav.Menu toggle styling — keep rsuite defaults for chevron */
        .rs-dropdown-toggle {
          background-color: transparent !important;
        }

        .rs-sidenav-item.rs-sidenav-item-disabled {
          opacity: 1 !important;
        }

        .rs-nav-item-panel .rs-nav-item-content {
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Nested dropdown items indentation */
        .rs-sidenav-collapse-in .rs-dropdown-menu .rs-nav-item-content {
          padding-left: 32px !important;
        }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--foreground) 10%, transparent);
          border-radius: 99px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--foreground) 18%, transparent);
        }
      `}</style>
    </>
  )
}
