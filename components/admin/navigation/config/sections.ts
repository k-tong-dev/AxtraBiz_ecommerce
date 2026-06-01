import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Percent, FolderTree,
  Truck, SlidersHorizontal, FileText, Megaphone, Settings, Gift, Star,
  MapPin, Wallet, CreditCard, Heart, ListOrdered, Menu, Warehouse,
  DollarSign, BarChart3, LineChart, Globe, History, Clock,
  Image, CircleDollarSign, Shield,
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
      { label: 'Dashboard', href: '/admin/inventory/dashboard', icon: LayoutDashboard },
      {
        label: 'Products', icon: Package,
        children: [
          { label: 'Products', href: '/admin/inventory/products', icon: Package },
          { label: 'Product Variants', href: '/admin/inventory/product-variants', icon: Package },
        ],
      },
      {
        label: 'Configuration', icon: SlidersHorizontal,
        children: [
          { label: 'Brand', href: '/admin/inventory/brands', icon: Tag },
          { label: 'Category', href: '/admin/inventory/categories', icon: FolderTree },
          { label: 'Attribute', href: '/admin/inventory/product-attributes', icon: SlidersHorizontal },
          { label: 'Attribute Values', href: '/admin/inventory/product-attribute-values', icon: SlidersHorizontal },
        ],
      },
    ],
  },
  configuration: {
    entries: [
      { label: 'Shops', href: '/admin/configuration/shops', icon: Warehouse },
      { label: 'Payment Methods', href: '/admin/configuration/payment-methods', icon: Wallet },
      { label: 'Tax Rates', href: '/admin/configuration/tax-rates', icon: Percent },
      { label: 'Shipping Zones', href: '/admin/configuration/shipping-zones', icon: Globe },
      { label: 'Shipping Methods', href: '/admin/configuration/shipping-methods', icon: Truck },
      { label: 'Currencies', href: '/admin/configuration/currencies', icon: CircleDollarSign },
      { label: 'Audit Logs', href: '/admin/configuration/audit-logs', icon: History },
      { label: 'Settings', href: '/admin/configuration/settings', icon: Settings },
      { label: 'Users', href: '/admin/configuration/users', icon: Users },
    ],
  },
  sales: {
    entries: [
      { label: 'Orders', href: '/admin/sales/orders', icon: ShoppingCart },
      { label: 'Order Lines', href: '/admin/sales/order-lines', icon: ListOrdered },
      { label: 'Invoices', href: '/admin/sales/invoices', icon: FileText },
      { label: 'Payment Trans.', href: '/admin/sales/payment-transactions', icon: CreditCard },
    ],
  },
  customers: {
    entries: [
      { label: 'Customers', href: '/admin/customers/dashboard', icon: Users },
      { label: 'Addresses', href: '/admin/customers/addresses', icon: MapPin },
      { label: 'Wishlist', href: '/admin/customers/wishlist-items', icon: Heart },
      { label: 'Cart Items', href: '/admin/customers/cart-items', icon: ShoppingCart },
    ],
  },
  marketing: {
    entries: [
      { label: 'Announcements', href: '/admin/marketing/announcements', icon: Megaphone },
      { label: 'Coupons', href: '/admin/marketing/coupons', icon: Gift },
      { label: 'Reviews', href: '/admin/marketing/product-reviews', icon: Star },
    ],
  },
  content: {
    entries: [
      { label: 'Pages', href: '/admin/content/pages', icon: FileText },
      { label: 'Menus', href: '/admin/content/menus', icon: Menu },
    ],
  },
  system: {
    entries: [
      { label: 'Policy', href: '/admin/system/policy', icon: Shield },
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
          { label: 'Inventory', href: '/admin/inventory/dashboard', icon: Warehouse, iconColor: 'text-primary/50' },
        ],
      },
      {
        type: 'menu', label: 'Sales', eventKey: 'sales', icon: ShoppingCart, iconColor: 'text-emerald-600/70',
        children: [
          { label: 'Orders', href: '/admin/sales/orders', icon: ShoppingCart, iconColor: 'text-emerald-500/50' },
          { label: 'Invoices', href: '/admin/sales/invoices', icon: FileText, iconColor: 'text-emerald-500/50' },
        ],
      },
      {
        type: 'menu', label: 'Customers', eventKey: 'crm', icon: Users, iconColor: 'text-blue-600/70',
        children: [
          { label: 'Customer Directory', href: '/admin/customers/dashboard', icon: Users, iconColor: 'text-blue-500/50' },
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
          { label: 'Pages', href: '/admin/content/pages', icon: FileText, iconColor: 'text-cyan-500/50' },
          { label: 'Menus', href: '/admin/content/menus', icon: Menu, iconColor: 'text-cyan-500/50' },
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
          { label: 'Announcements', href: '/admin/marketing/announcements', icon: Megaphone, iconColor: 'text-amber-500/50' },
          { label: 'Coupons', href: '/admin/marketing/coupons', icon: Gift, iconColor: 'text-amber-500/50' },
          { label: 'Reviews', href: '/admin/marketing/product-reviews', icon: Star, iconColor: 'text-amber-500/50' },
        ],
      },
    ],
  },
  {
    label: 'Media',
    entries: [
      { type: 'link', label: 'Asset Management', href: '/admin/media/assets', icon: Image, iconColor: 'text-purple-600/70' },
    ],
  },
  {
    label: 'Configuration',
    entries: [
      { type: 'link', label: 'Shops', href: '/admin/configuration/shops', icon: Warehouse, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Payment Methods', href: '/admin/configuration/payment-methods', icon: Wallet, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Tax Rates', href: '/admin/configuration/tax-rates', icon: Percent, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Shipping Zones', href: '/admin/configuration/shipping-zones', icon: Globe, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Shipping Methods', href: '/admin/configuration/shipping-methods', icon: Truck, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Currencies', href: '/admin/configuration/currencies', icon: CircleDollarSign, iconColor: 'text-muted-foreground/70' },
      { type: 'link', label: 'Audit Logs', href: '/admin/configuration/audit-logs', icon: History, iconColor: 'text-muted-foreground/70' },
      {
        type: 'menu', label: 'Settings', eventKey: 'settings', icon: Settings, iconColor: 'text-muted-foreground/70',
        children: [
          { label: 'General', href: '/admin/configuration/settings', icon: Settings, iconColor: 'text-muted-foreground/50' },
        ],
      },
      {
        type: 'menu', label: 'Users', eventKey: 'users', icon: Users, iconColor: 'text-muted-foreground/70',
        children: [
          { label: 'Staff Accounts', href: '/admin/configuration/users', icon: Users, iconColor: 'text-muted-foreground/50' },
          { label: 'Groups', href: '/admin/configuration/users/groups', icon: Users, iconColor: 'text-muted-foreground/50' },
        ],
      },
    ],
  },
  {
    label: 'System',
    entries: [
      { type: 'link', label: 'Policy', href: '/admin/system/policy', icon: Shield, iconColor: 'text-destructive/70' },
    ],
  },
]

// ── Section labels & detection ──

export const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Catalog',
  configuration: 'Configuration',
  sales: 'Sales',
  customers: 'Customers',
  marketing: 'Marketing',
  content: 'Content',
  system: 'System',
}

export function detectSection(pathname: string): string {
  if (pathname === '/admin' || pathname.startsWith('/admin?tab=')) return 'dashboard'
  if (pathname.startsWith('/admin/inventory') || pathname.startsWith('/admin/media')) return 'inventory'
  if (pathname.startsWith('/admin/configuration')) return 'configuration'
  if (pathname.startsWith('/admin/sales')) return 'sales'
  if (pathname.startsWith('/admin/customers')) return 'customers'
  if (pathname.startsWith('/admin/marketing')) return 'marketing'
  if (pathname.startsWith('/admin/content')) return 'content'
  if (pathname.startsWith('/admin/system')) return 'system'
  // Legacy redirects
  if (pathname.startsWith('/admin/products') || pathname.startsWith('/admin/product-variants') || pathname.startsWith('/admin/product-attributes') || pathname.startsWith('/admin/product-attribute-values') || pathname.startsWith('/admin/brands') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/assets')) return 'inventory'
  if (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/configurations') || pathname.startsWith('/admin/currencies') || pathname.startsWith('/admin/payment-methods') || pathname.startsWith('/admin/tax-rates') || pathname.startsWith('/admin/shipping-zones') || pathname.startsWith('/admin/shipping-methods') || pathname.startsWith('/admin/audit')) return 'configuration'
  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/order-lines') || pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/payment-transactions')) return 'sales'
  if (pathname.startsWith('/admin/addresses') || pathname.startsWith('/admin/wishlist-items') || pathname.startsWith('/admin/cart-items')) return 'customers'
  if (pathname.startsWith('/admin/announcements') || pathname.startsWith('/admin/coupons') || pathname.startsWith('/admin/product-reviews')) return 'marketing'
  if (pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/menus')) return 'content'
  return 'dashboard'
}
