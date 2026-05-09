'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
  SlidersHorizontal,
  Tag,
  Percent,
  FolderTree,
  Truck,
} from 'lucide-react'
import { Nav, Sidenav } from 'rsuite'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'


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
      {/* Mobile toggle (RSuite-like show/hide pattern) */}
      <button
        type="button"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={toggle}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-background/70 backdrop-blur border border-border/60 hover:bg-background transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 from-sidebar via-sidebar backdrop-blur-sm transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col shadow-xl`}
      >
        {/* Header with gradient and user info */}
        <div className="p-3 flex flex-col gap-4">
          {/* User Info */}
          {user && (
            <div className="bg-sidebar-accent/20 rounded-lg p-3 border border-sidebar-border/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-xs">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user.name || 'Admin User'}
                  </p>
                  <p className="text-xs truncate">
                    {user.email}
                  </p>
                  <p className="text-xs">
                    Role: {user.role || 'customer'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={close}
            className="md:hidden p-1.5 hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <Sidenav
            expanded
            appearance="subtle"
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
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
              >
                <Nav.Item panel>
                  <Sidenav.GroupLabel>Overview</Sidenav.GroupLabel>
                </Nav.Item>
                <Nav.Item eventKey="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
                  Dashboard
                </Nav.Item>

                <Nav.Item panel>
                  <Sidenav.GroupLabel>Commerce</Sidenav.GroupLabel>
                </Nav.Item>
                <Nav.Menu eventKey="projects" title="Catalog" icon={<Package className="h-4 w-4" />}>
                  <Nav.Item eventKey="/admin/products">All Products</Nav.Item>
                  <Nav.Item eventKey="/admin/brands" icon={<Tag className="h-4 w-4" />}>
                    Brands
                  </Nav.Item>
                  <Nav.Item eventKey="/admin/tax-rates" icon={<Percent className="h-4 w-4" />}>
                    Taxes
                  </Nav.Item>
                  <Nav.Item eventKey="/admin/categories" icon={<FolderTree className="h-4 w-4" />}>
                    Categories
                  </Nav.Item>
                  <Nav.Item eventKey="/admin/shipping-zones" icon={<Truck className="h-4 w-4" />}>
                    Shipping Zones
                  </Nav.Item>
                  <Nav.Item eventKey="/admin/product-attributes" icon={<SlidersHorizontal className="h-4 w-4" />}>
                    Product Attributes
                  </Nav.Item>
                  <Nav.Item eventKey="/admin/product-attribute-values" icon={<SlidersHorizontal className="h-4 w-4" />}>
                    Attribute Values
                  </Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="sales" title="Sales" icon={<ShoppingCart className="h-4 w-4" />}>
                  <Nav.Item eventKey="/admin/orders">Orders</Nav.Item>
                  <Nav.Item eventKey="/admin/invoices">Invoices</Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="crm" title="Customers" icon={<Users className="h-4 w-4" />}>
                  <Nav.Item eventKey="/admin/customers">Customer Directory</Nav.Item>
                </Nav.Menu>

                <Nav.Item panel>
                  <Sidenav.GroupLabel>Content</Sidenav.GroupLabel>
                </Nav.Item>
                <Nav.Menu eventKey="marketing" title="Marketing" icon={<Megaphone className="h-4 w-4" />}>
                  <Nav.Item eventKey="/admin/announcements">Announcements</Nav.Item>
                </Nav.Menu>

                <Nav.Item panel>
                  <Sidenav.GroupLabel>System</Sidenav.GroupLabel>
                </Nav.Item>
                <Nav.Menu eventKey="preferences" title="Preferences" icon={<Settings className="h-4 w-4" />}>
                  <Nav.Item eventKey="/admin/settings">Settings</Nav.Item>
                  <Nav.Item eventKey="/admin/configurations" icon={<SlidersHorizontal className="h-4 w-4" />}>
                    Configurations
                  </Nav.Item>
                </Nav.Menu>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border/30 space-y-2">
          <Button
            onClick={logout}
            className="w-full"
            appearance={"primary"}
            color="red"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
