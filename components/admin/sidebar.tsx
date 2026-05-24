'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  Image,
  Tag,
  Percent,
  FolderTree,
  Truck,
  SlidersHorizontal,
  FileText,
} from 'lucide-react'
import { Nav, Sidenav } from 'rsuite'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

function SidebarGroupLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
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

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([
    'projects',
    'sales',
    'crm',
    'marketing',
    'preferences',
  ])

  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)

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
        <div className="flex-1 overflow-y-auto px-1.5 pb-2 scrollbar-thin">
          <Sidenav
            expanded
            appearance="subtle"
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            className="!bg-transparent"
          >
            <Sidenav.Body>
              <Nav
                activeKey={pathname}
                onSelect={(eventKey) => {
                  if (typeof eventKey === 'string' && eventKey.startsWith('/')) {
                    router.push(eventKey)
                    close()
                  }
                }}
                className="!bg-transparent"
              >
                <SidebarGroupLabel label="Overview" />
                <Nav.Item
                  eventKey="/admin"
                  icon={<LayoutDashboard className="h-3.5 w-3.5 text-primary/70" />}
                >
                  Dashboard
                </Nav.Item>

                <SidebarGroupLabel label="Commerce" />
                <Nav.Menu eventKey="projects" title="Catalog" icon={<Package className="h-3.5 w-3.5 text-primary/70" />}>
                  <Nav.Item eventKey="/admin/products" icon={<Package className="h-3.5 w-3.5 text-primary/50" />}>All Products</Nav.Item>
                  <Nav.Item eventKey="/admin/brands" icon={<Tag className="h-3.5 w-3.5 text-primary/50" />}>Brands</Nav.Item>
                  <Nav.Item eventKey="/admin/tax-rates" icon={<Percent className="h-3.5 w-3.5 text-primary/50" />}>Taxes</Nav.Item>
                  <Nav.Item eventKey="/admin/categories" icon={<FolderTree className="h-3.5 w-3.5 text-primary/50" />}>Categories</Nav.Item>
                  <Nav.Item eventKey="/admin/shipping-zones" icon={<Truck className="h-3.5 w-3.5 text-primary/50" />}>Shipping Zones</Nav.Item>
                  <Nav.Item eventKey="/admin/product-attributes" icon={<SlidersHorizontal className="h-3.5 w-3.5 text-primary/50" />}>Product Attributes</Nav.Item>
                  <Nav.Item eventKey="/admin/product-attribute-values" icon={<SlidersHorizontal className="h-3.5 w-3.5 text-primary/50" />}>Attribute Values</Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="sales" title="Sales" icon={<ShoppingCart className="h-3.5 w-3.5 text-emerald-600/70" />}>
                  <Nav.Item eventKey="/admin/orders" icon={<ShoppingCart className="h-3.5 w-3.5 text-emerald-500/50" />}>Orders</Nav.Item>
                  <Nav.Item eventKey="/admin/invoices" icon={<FileText className="h-3.5 w-3.5 text-emerald-500/50" />}>Invoices</Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="crm" title="Customers" icon={<Users className="h-3.5 w-3.5 text-blue-600/70" />}>
                  <Nav.Item eventKey="/admin/customers" icon={<Users className="h-3.5 w-3.5 text-blue-500/50" />}>Customer Directory</Nav.Item>
                </Nav.Menu>

                <SidebarGroupLabel label="Content" />
                <Nav.Menu eventKey="marketing" title="Marketing" icon={<Megaphone className="h-3.5 w-3.5 text-amber-600/70" />}>
                  <Nav.Item eventKey="/admin/announcements" icon={<Megaphone className="h-3.5 w-3.5 text-amber-500/50" />}>Announcements</Nav.Item>
                </Nav.Menu>

                <SidebarGroupLabel label="Media" />
                <Nav.Item eventKey="/admin/assets" icon={<Image className="h-3.5 w-3.5 text-purple-600/70" />}>
                  Asset Management
                </Nav.Item>

                <SidebarGroupLabel label="System" />
                <Nav.Menu eventKey="preferences" title="Preferences" icon={<Settings className="h-3.5 w-3.5 text-muted-foreground/70" />}>
                  <Nav.Item eventKey="/admin/settings" icon={<Settings className="h-3.5 w-3.5 text-muted-foreground/50" />}>Settings</Nav.Item>
                  <Nav.Item eventKey="/admin/configurations" icon={<SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/50" />}>Configurations</Nav.Item>
                </Nav.Menu>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>

        {/* Footer — compact logout */}
        <div className="shrink-0 px-3 py-2.5 border-t border-border/40">
          <Button
            onClick={logout}
            className="w-full h-8 gap-2 text-muted-foreground/60 hover:text-foreground/80"
            appearance="ghost"
            size="sm"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      <style>{`
        .rs-sidenav-subtle {
          background-color: transparent !important;
        }
        .rs-sidenav-item,
        .rs-nav-item,
        .rs-nav-item-content {
          background-color: transparent !important;
          color: inherit !important;
          transition: all 0.15s ease !important;
        }
        .rs-nav-item:not(.rs-nav-item-disabled) > .rs-nav-item-content,
        .rs-sidenav-item:not(.rs-sidenav-item-disabled) > .rs-sidenav-item-content {
          padding: 6px 10px !important;
          border-radius: 6px !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
          color: color-mix(in srgb, var(--foreground) 60%, transparent) !important;
        }
        .rs-nav-item:not(.rs-nav-item-disabled) > .rs-nav-item-content:hover,
        .rs-sidenav-item:not(.rs-sidenav-item-disabled) > .rs-sidenav-item-content:hover {
          background-color: color-mix(in srgb, var(--primary) 10%, transparent) !important;
          color: color-mix(in srgb, var(--foreground) 90%, transparent) !important;
        }
        .rs-nav-item-active > .rs-nav-item-content,
        .rs-sidenav-item-active > .rs-sidenav-item-content {
          background-color: color-mix(in srgb, var(--primary) 12%, transparent) !important;
          color: color-mix(in srgb, var(--foreground) 95%, transparent) !important;
          font-weight: 500 !important;
          box-shadow: inset 2px 0 0 0 color-mix(in srgb, var(--primary) 60%, transparent) !important;
        }
        .rs-sidenav-item.rs-sidenav-item-active > .rs-sidenav-item-content {
          font-weight: 500 !important;
        }
        .rs-nav-item-content > .rs-icon,
        .rs-sidenav-item-content > .rs-icon {
          margin-right: 8px !important;
        }
        .rs-nav-item-disabled {
          opacity: 0.5;
          cursor: default;
        }
        .rs-nav-item-panel {
          padding: 0 !important;
        }
        .rs-sidenav-menu-item,
        .rs-sidenav-menu-item > .rs-sidenav-item-content {
          background-color: transparent !important;
          transition: all 0.15s ease !important;
        }
        .rs-sidenav-menu-item:not(.rs-sidenav-item-disabled) > .rs-sidenav-item-content:hover {
          background-color: color-mix(in srgb, var(--primary) 10%, transparent) !important;
        }
        .rs-dropdown-menu {
          background-color: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
        }
        .rs-dropdown-menu .rs-nav-item-content {
          padding-left: 32px !important;
        }
        .rs-sidenav-collapse-in .rs-dropdown-menu {
          padding-left: 4px !important;
        }
        .rs-sidenav-collapse-in .rs-dropdown-menu .rs-nav-item-content {
          padding-left: 32px !important;
        }
        .rs-sidenav-item.rs-sidenav-item-disabled {
          opacity: 1 !important;
        }
        .rs-nav-item-panel .rs-nav-item-content {
          padding: 0 !important;
          margin: 0 !important;
        }
        .rs-dropdown-toggle {
          background-color: transparent !important;
        }
        .rs-dropdown-toggle-icon {
          top: 8px !important;
          right: 8px !important;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
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
