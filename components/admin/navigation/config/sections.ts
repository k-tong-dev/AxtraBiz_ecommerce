import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Percent, FolderTree,
  Truck, SlidersHorizontal, FileText, Megaphone, Settings, Gift, Star,
  MapPin, Wallet, CreditCard, Heart, ListOrdered, Menu, Warehouse,
  DollarSign, BarChart3, LineChart, Globe, History, Clock,
  Image, CircleDollarSign, HelpCircle,
} from 'lucide-react'

// ── Module bar types ──

export interface LinkItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface GroupItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

export type NavEntry = LinkItem | GroupItem

export type SectionModules = Record<string, { entries: NavEntry[] }>

export const sectionModules: SectionModules = {
  dashboard: {
    entries: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Revenue', href: '/admin?tab=revenue', icon: DollarSign },
      { label: 'Analytics', href: '/admin?tab=analytics', icon: BarChart3 },
      { label: 'Reports', href: '/admin?tab=reports', icon: LineChart },
    ],
  },
  inventory: {
    entries: [
      { label: 'Dashboard', href: '/admin/inventory', icon: LayoutDashboard },
      {
        label: 'Products', icon: Package,
        children: [
          { label: 'Products', href: '/admin/products', icon: Package },
          { label: 'Product Variants', href: '/admin/product-variants', icon: Package },
        ],
      },
      {
        label: 'Configuration', icon: SlidersHorizontal,
        children: [
          { label: 'Brand', href: '/admin/brands', icon: Tag },
          { label: 'Category', href: '/admin/categories', icon: FolderTree },
          { label: 'Attribute', href: '/admin/product-attributes', icon: SlidersHorizontal },
          { label: 'Attribute Values', href: '/admin/product-attribute-values', icon: SlidersHorizontal },
        ],
      },
    ],
  },
  taxes: {
    entries: [
      { label: 'Dashboard', href: '/admin/taxes', icon: LayoutDashboard },
      { label: 'Tax Rates', href: '/admin/tax-rates', icon: Percent },
    ],
  },
  shipping: {
    entries: [
      { label: 'Dashboard', href: '/admin/shipping', icon: LayoutDashboard },
      { label: 'Shipping Zones', href: '/admin/shipping-zones', icon: Globe },
      { label: 'Shipping Methods', href: '/admin/shipping-methods', icon: Truck },
    ],
  },
  sales: {
    entries: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Order Lines', href: '/admin/order-lines', icon: ListOrdered },
      { label: 'Invoices', href: '/admin/invoices', icon: FileText },
      { label: 'Payment Trans.', href: '/admin/payment-transactions', icon: CreditCard },
    ],
  },
  customers: {
    entries: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Addresses', href: '/admin/addresses', icon: MapPin },
      { label: 'Wishlist', href: '/admin/wishlist-items', icon: Heart },
      { label: 'Cart Items', href: '/admin/cart-items', icon: ShoppingCart },
      { label: 'Payment Methods', href: '/admin/payment-methods', icon: Wallet },
    ],
  },
  marketing: {
    entries: [
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Coupons', href: '/admin/coupons', icon: Gift },
      { label: 'Reviews', href: '/admin/product-reviews', icon: Star },
    ],
  },
  content: {
    entries: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Menus', href: '/admin/menus', icon: Menu },
    ],
  },
  system: {
    entries: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Config.', href: '/admin/configurations', icon: SlidersHorizontal },
    ],
  },
  audit: {
    entries: [
      { label: 'Dashboard', href: '/admin/audit-logs', icon: History },
      { label: 'Cron', href: '/admin/audit-logs/cron', icon: Clock },
      { label: 'Configuration', href: '/admin/audit-logs/config', icon: Settings },
    ],
  },
}

// ── Sidebar types & groups ──

export interface SidebarLink {
  type: 'link'
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
}

export interface SidebarMenu {
  type: 'menu'
  label: string
  eventKey: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  children: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; iconColor?: string }[]
}

export type SidebarEntry = SidebarLink | SidebarMenu

export interface SidebarGroup {
  label: string
  entries: SidebarEntry[]
}

export const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Overview',
    entries: [
      { type: 'link', label: 'Dashboard', href: '/admin', icon: LayoutDashboard, iconColor: 'text-primary/70' },
    ],
  },
  {
    label: 'Commerce',
    entries: [
      {
        type: 'menu', label: 'Catalog', eventKey: 'catalog', icon: Package, iconColor: 'text-primary/70',
        children: [
          { label: 'Inventory', href: '/admin/inventory', icon: Warehouse, iconColor: 'text-primary/50' },
          { label: 'Taxes', href: '/admin/taxes', icon: Percent, iconColor: 'text-primary/50' },
          { label: 'Shipping', href: '/admin/shipping', icon: Truck, iconColor: 'text-primary/50' },
        ],
      },
      {
        type: 'menu', label: 'Sales', eventKey: 'sales', icon: ShoppingCart, iconColor: 'text-emerald-600/70',
        children: [
          { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, iconColor: 'text-emerald-500/50' },
          { label: 'Invoices', href: '/admin/invoices', icon: FileText, iconColor: 'text-emerald-500/50' },
        ],
      },
      {
        type: 'menu', label: 'Customers', eventKey: 'crm', icon: Users, iconColor: 'text-blue-600/70',
        children: [
          { label: 'Customer Directory', href: '/admin/customers', icon: Users, iconColor: 'text-blue-500/50' },
        ],
      },
    ],
  },
  {
    label: 'Content',
    entries: [
      {
        type: 'menu', label: 'Content', eventKey: 'content', icon: FileText, iconColor: 'text-cyan-600/70',
        children: [
          { label: 'Pages', href: '/admin/pages', icon: FileText, iconColor: 'text-cyan-500/50' },
          { label: 'Menus', href: '/admin/menus', icon: Menu, iconColor: 'text-cyan-500/50' },
        ],
      },
    ],
  },
  {
    label: 'Marketing',
    entries: [
      {
        type: 'menu', label: 'Marketing', eventKey: 'marketing', icon: Megaphone, iconColor: 'text-amber-600/70',
        children: [
          { label: 'Announcements', href: '/admin/announcements', icon: Megaphone, iconColor: 'text-amber-500/50' },
          { label: 'Coupons', href: '/admin/coupons', icon: Gift, iconColor: 'text-amber-500/50' },
          { label: 'Reviews', href: '/admin/product-reviews', icon: Star, iconColor: 'text-amber-500/50' },
        ],
      },
    ],
  },
  {
    label: 'Media',
    entries: [
      { type: 'link', label: 'Asset Management', href: '/admin/assets', icon: Image, iconColor: 'text-purple-600/70' },
    ],
  },
  {
    label: 'System',
    entries: [
      {
        type: 'menu', label: 'Preferences', eventKey: 'preferences', icon: Settings, iconColor: 'text-muted-foreground/70',
        children: [
          { label: 'Settings', href: '/admin/settings', icon: Settings, iconColor: 'text-muted-foreground/50' },
          { label: 'Configurations', href: '/admin/configurations', icon: SlidersHorizontal, iconColor: 'text-muted-foreground/50' },
          { label: 'Currencies', href: '/admin/currencies', icon: CircleDollarSign, iconColor: 'text-muted-foreground/50' },
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: History, iconColor: 'text-muted-foreground/50' },
        ],
      },
    ],
  },
]

// ── Section labels & detection ──

export const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Catalog',
  taxes: 'Taxes',
  shipping: 'Shipping',
  sales: 'Sales',
  customers: 'Customers',
  marketing: 'Marketing',
  content: 'Content',
  system: 'System',
  audit: 'Audit Log',
}

export function detectSection(pathname: string): string {
  if (pathname === '/admin' || pathname.startsWith('/admin?tab=')) return 'dashboard'
  if (pathname.startsWith('/admin/inventory') || pathname.startsWith('/admin/products') || pathname.startsWith('/admin/product-variants') || pathname.startsWith('/admin/product-attributes') || pathname.startsWith('/admin/product-attribute-values') || pathname.startsWith('/admin/brands') || pathname.startsWith('/admin/categories')) return 'inventory'
  if (pathname.startsWith('/admin/taxes') || pathname.startsWith('/admin/tax-rates')) return 'taxes'
  if (pathname.startsWith('/admin/shipping') || pathname.startsWith('/admin/shipping-zones') || pathname.startsWith('/admin/shipping-methods')) return 'shipping'
  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/order-lines') || pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/payment-transactions')) return 'sales'
  if (pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/addresses') || pathname.startsWith('/admin/wishlist-items') || pathname.startsWith('/admin/cart-items') || pathname.startsWith('/admin/payment-methods')) return 'customers'
  if (pathname.startsWith('/admin/announcements') || pathname.startsWith('/admin/coupons') || pathname.startsWith('/admin/product-reviews')) return 'marketing'
  if (pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/menus')) return 'content'
  if (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/configurations')) return 'system'
  if (pathname.startsWith('/admin/audit-logs')) return 'audit'
  return 'dashboard'
}

// ── Re-exports for Components ──
export { HelpCircle }
