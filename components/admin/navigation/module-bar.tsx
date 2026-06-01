'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useActiveSection } from './hooks/use-navigation'
import type { LinkItem, GroupItem, NavEntry } from './config/sections'

function isLinkItem(entry: NavEntry): entry is LinkItem {
  return 'href' in entry
}

function NavLink({ item, pathname }: { item: LinkItem; pathname: string }) {
  const Icon = item.icon
  const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  return (
    <Link
      href={item.href}
      className={`inline-flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </Link>
  )
}

function NavDropdown({ item, pathname }: { item: GroupItem; pathname: string }) {
  const router = useRouter()
  const GroupIcon = item.icon
  const anyActive = item.children.some((c) => pathname.startsWith(c.href))

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
          const ChildIcon = child.icon
          const active = pathname.startsWith(child.href)
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

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-1.5 scrollbar-none">
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider mr-1">
          {label}
        </span>
        <div className="w-px h-4 bg-border/40" />
        {entries.map((entry) =>
          isLinkItem(entry) ? (
            <NavLink key={entry.href} item={entry} pathname={pathname} />
          ) : (
            <NavDropdown key={entry.label} item={entry} pathname={pathname} />
          )
        )}
      </div>
    </div>
  )
}
