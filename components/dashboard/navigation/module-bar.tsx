'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useActiveSection } from './hooks/use-navigation'
import { resolveIcon } from './config/sections'
import type { ModuleLink, ModuleGroup, ModuleEntry } from './config/sections'

function isLinkItem(entry: ModuleEntry): entry is ModuleLink {
  return 'href' in entry
}

/** Collect every href from module-bar entries (including dropdown children). */
function collectHrefs(entries: ModuleEntry[]): string[] {
  const hrefs: string[] = []
  for (const e of entries) {
    if (isLinkItem(e)) hrefs.push(e.href)
    else e.children.forEach((c) => hrefs.push(c.href))
  }
  return hrefs
}

/**
 * Among all module-bar hrefs, find the one that best matches the current pathname.
 * "Best" = longest matching prefix (most-specific wins).
 */
function bestMatchHref(hrefs: string[], pathname: string): string | null {
  let best: string | null = null
  for (const href of hrefs) {
    if (pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))) {
      if (!best || href.length > best.length) best = href
    }
  }
  return best
}

function NavLink({ item, isActive }: { item: ModuleLink; isActive: boolean }) {
  const Icon = resolveIcon(item.icon)
  return (
    <Link
      href={item.href}
      className={`inline-flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </Link>
  )
}

function NavDropdown({ item, pathname, activeChild }: { item: ModuleGroup; pathname: string; activeChild: string | null }) {
  const router = useRouter()
  const GroupIcon = resolveIcon(item.icon)
  const anyActive = activeChild !== null && item.children.some((c) => c.href === activeChild)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
            anyActive
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <GroupIcon className="w-3.5 h-3.5" />
          {item.label}
          <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {item.children.map((child) => {
          const ChildIcon = resolveIcon(child.icon)
          const active = child.href === activeChild
          return (
            <DropdownMenuItem
              key={child.href}
              onClick={() => router.push(child.href)}
              className={`text-xs cursor-pointer ${
                active
                  ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15 focus:bg-primary/15 focus:text-primary'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground focus:bg-muted/70 focus:text-foreground'
              }`}
            >
              <ChildIcon className="w-3.5 h-3.5" />
              {child.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ModuleBar() {
  const { section, label, entries, pathname } = useActiveSection()
  const allHrefs = useMemo(() => collectHrefs(entries), [entries])
  const bestHref = useMemo(() => bestMatchHref(allHrefs, pathname), [allHrefs, pathname])

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-1.5 scrollbar-none">
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider mr-1">
          {label}
        </span>
        <div className="w-px h-4 bg-border/40" />
        {entries.map((entry) =>
          isLinkItem(entry) ? (
            <NavLink key={entry.href} item={entry} isActive={entry.href === bestHref} />
          ) : (
            <NavDropdown key={entry.label} item={entry} pathname={pathname} activeChild={bestHref} />
          )
        )}
      </div>
    </div>
  )
}
