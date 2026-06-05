import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Percent, FolderTree,
  Truck, SlidersHorizontal, FileText, Megaphone, Settings, Gift, Star,
  MapPin, Wallet, CreditCard, Heart, ListOrdered, Menu, Warehouse,
  DollarSign, BarChart3, LineChart, Globe, History, Clock,
  Image, CircleDollarSign, Shield, MessageSquare, Phone, Bell, Activity,
} from 'lucide-react'

// ─── Icon registry ────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Percent, FolderTree,
  Truck, SlidersHorizontal, FileText, Megaphone, Settings, Gift, Star,
  MapPin, Wallet, CreditCard, Heart, ListOrdered, Menu, Warehouse,
  DollarSign, BarChart3, LineChart, Globe, History, Clock,
  Image, CircleDollarSign, Shield, MessageSquare, Phone, Bell, Activity,
}

function icon(name: string): LucideIcon {
  return iconMap[name] || Package
}

// ─── Types ────────────────────────────────────────────────────

export interface SidebarLeaf {
  label: string
  icon: string
  href: string
  section: string
  badge?: string | number
}

export interface SidebarMenu {
  label: string
  icon: string
  children: SidebarLeaf[]
}

export type SidebarEntry = SidebarLeaf | SidebarMenu

export interface SidebarGroup {
  label: string
  entries: SidebarEntry[]
}

export interface ModuleLink {
  label: string
  icon: string
  href: string
}

export interface ModuleGroup {
  label: string
  icon: string
  children: { label: string; icon: string; href: string }[]
}

export type ModuleEntry = ModuleLink | ModuleGroup

export interface ModuleSection {
  label: string
  entries: ModuleEntry[]
}

export type SectionModules = Record<string, ModuleSection>

// ─── Sidebar menu data (pure JSON) ────────────────────────────

export const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Overview',
    entries: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard', section: 'dashboard' },
    ],
  },
  {
    label: 'Commerce',
    entries: [
      {
        label: 'Catalog', icon: 'Package',
        children: [
          { label: 'Inventory', icon: 'Warehouse', href: '/dashboard/inventory/dashboard', section: 'inventory' },
        ],
      },
      {
        label: 'Sales', icon: 'ShoppingCart',
        children: [
          { label: 'Orders', icon: 'ShoppingCart', href: '/dashboard/sales/orders', section: 'sales' },
          { label: 'Invoices', icon: 'FileText', href: '/dashboard/sales/invoices', section: 'sales' },
        ],
      },
      {
        label: 'Customers', icon: 'Users',
        children: [
          { label: 'Customer Directory', icon: 'Users', href: '/dashboard/customers', section: 'customers' },
        ],
      },
    ],
  },
  {
    label: 'Content',
    entries: [
      { label: 'Pages', icon: 'FileText', href: '/dashboard/content/pages', section: 'content' },
      { label: 'Menus', icon: 'Menu', href: '/dashboard/content/menus', section: 'content' },
    ],
  },
  {
    label: 'Marketing',
    entries: [
      { label: 'Announcements', icon: 'Megaphone', href: '/dashboard/marketing/announcements', section: 'marketing' },
      { label: 'Coupons', icon: 'Gift', href: '/dashboard/marketing/coupons', section: 'marketing' },
      { label: 'Reviews', icon: 'Star', href: '/dashboard/marketing/product-reviews', section: 'marketing' },
    ],
  },
  {
    label: 'Media',
    entries: [
      { label: 'Asset Management', icon: 'Image', href: '/dashboard/media/assets', section: 'media' },
    ],
  },
  {
    label: 'Configuration',
    entries: [
      { label: 'Shops', icon: 'Warehouse', href: '/dashboard/configuration/shops', section: 'shops' },
      { label: 'Payment Methods', icon: 'Wallet', href: '/dashboard/configuration/payment-methods', section: 'payments' },
      { label: 'Tax Rates', icon: 'Percent', href: '/dashboard/configuration/tax-rates', section: 'taxes' },
      {
        label: 'Shipping', icon: 'Truck',
        children: [
          { label: 'Shipping Zones', icon: 'Globe', href: '/dashboard/configuration/shipping-zones', section: 'shipping_zones' },
          { label: 'Shipping Methods', icon: 'Truck', href: '/dashboard/configuration/shipping-methods', section: 'shipping_methods' },
        ],
      },
      { label: 'Currencies', icon: 'CircleDollarSign', href: '/dashboard/configuration/currencies', section: 'currencies' },
      { label: 'Audit Logs', icon: 'History', href: '/dashboard/configuration/audit-logs', section: 'audit' },
      {
        label: 'Settings', icon: 'Settings',
        children: [
          { label: 'General', icon: 'Settings', href: '/dashboard/configuration/settings', section: 'settings_general' },
          { label: 'Location', icon: 'MapPin', href: '/dashboard/configuration/settings/location', section: 'settings_location' },
          { label: 'eCommerce', icon: 'ShoppingCart', href: '/dashboard/configuration/settings/ecommerce', section: 'settings_ecommerce' },
          { label: 'Telegram Bot', icon: 'MessageSquare', href: '/dashboard/configuration/settings/telegram', section: 'settings_telegram' },
          { label: 'Global Phone', icon: 'Phone', href: '/dashboard/configuration/settings/phone', section: 'settings_phone' },
          { label: 'Notifications', icon: 'Bell', href: '/dashboard/configuration/settings/notifications', section: 'settings_notifications' },
        ],
      },
      {
        label: 'Users', icon: 'Users',
        children: [
          { label: 'Users', icon: 'Users', href: '/dashboard/configuration/users', section: 'users_staff' },
          { label: 'Groups', icon: 'Users', href: '/dashboard/configuration/users/groups', section: 'users_groups' },
        ],
      },
    ],
  },
  {
    label: 'System',
    entries: [
      { label: 'Policy', icon: 'Shield', href: '/dashboard/system/policy', section: 'system' },
    ],
  },
]

// ─── Module-bar section data ──────────────────────────────────

export const sectionModules: SectionModules = {
  dashboard: {
    label: 'Dashboard',
    entries: [
      { label: 'Overview', icon: 'LayoutDashboard', href: '/dashboard' },
      { label: 'Revenue', icon: 'DollarSign', href: '/dashboard?tab=revenue' },
      { label: 'Analytics', icon: 'BarChart3', href: '/dashboard?tab=analytics' },
      { label: 'Reports', icon: 'LineChart', href: '/dashboard?tab=reports' },
    ],
  },
  inventory: {
    label: 'Catalog',
    entries: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard/inventory/dashboard' },
      {
        label: 'Products', icon: 'Package',
        children: [
          { label: 'Products', icon: 'Package', href: '/dashboard/inventory/products' },
          { label: 'Product Variants', icon: 'Package', href: '/dashboard/inventory/product-variants' },
        ],
      },
      {
        label: 'Configuration', icon: 'SlidersHorizontal',
        children: [
          { label: 'Brand', icon: 'Tag', href: '/dashboard/inventory/brands' },
          { label: 'Category', icon: 'FolderTree', href: '/dashboard/inventory/categories' },
          { label: 'Attribute', icon: 'SlidersHorizontal', href: '/dashboard/inventory/product-attributes' },
          { label: 'Attribute Values', icon: 'SlidersHorizontal', href: '/dashboard/inventory/product-attribute-values' },
        ],
      },
    ],
  },
  sales: {
    label: 'Sales',
    entries: [
      { label: 'Orders', icon: 'ShoppingCart', href: '/dashboard/sales/orders' },
      { label: 'Order Lines', icon: 'ListOrdered', href: '/dashboard/sales/order-lines' },
      { label: 'Invoices', icon: 'FileText', href: '/dashboard/sales/invoices' },
      { label: 'Payment Trans.', icon: 'CreditCard', href: '/dashboard/sales/payment-transactions' },
    ],
  },
  customers: {
    label: 'Customers',
    entries: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard/customers/dashboard' },
      { label: 'Customers', icon: 'Users', href: '/dashboard/customers' },
      { label: 'Addresses', icon: 'MapPin', href: '/dashboard/customers/addresses' },
      { label: 'Wishlist', icon: 'Heart', href: '/dashboard/customers/wishlist-items' },
      { label: 'Cart Items', icon: 'ShoppingCart', href: '/dashboard/customers/cart-items' },
    ],
  },
  marketing: {
    label: 'Marketing',
    entries: [
      { label: 'Announcements', icon: 'Megaphone', href: '/dashboard/marketing/announcements' },
      { label: 'Coupons', icon: 'Gift', href: '/dashboard/marketing/coupons' },
      { label: 'Reviews', icon: 'Star', href: '/dashboard/marketing/product-reviews' },
    ],
  },
  content: {
    label: 'Content',
    entries: [
      { label: 'Pages', icon: 'FileText', href: '/dashboard/content/pages' },
      { label: 'Menus', icon: 'Menu', href: '/dashboard/content/menus' },
    ],
  },
  media: {
    label: 'Media',
    entries: [
      { label: 'Assets', icon: 'Image', href: '/dashboard/media/assets' },
    ],
  },
  shops: {
    label: 'Shop',
    entries: [
      { label: 'Shops', icon: 'Warehouse', href: '/dashboard/configuration/shops' },
    ],
  },
  payments: {
    label: 'Payments',
    entries: [
      { label: 'Payment Methods', icon: 'Wallet', href: '/dashboard/configuration/payment-methods' },
    ],
  },
  taxes: {
    label: 'Taxes',
    entries: [
      { label: 'Tax Rates', icon: 'Percent', href: '/dashboard/configuration/tax-rates' },
    ],
  },
  shipping_zones: {
    label: 'Shipping Zones',
    entries: [
      { label: 'Shipping Zones', icon: 'Globe', href: '/dashboard/configuration/shipping-zones' },
    ],
  },
  shipping_methods: {
    label: 'Shipping Methods',
    entries: [
      { label: 'Shipping Methods', icon: 'Truck', href: '/dashboard/configuration/shipping-methods' },
    ],
  },
  currencies: {
    label: 'Currencies',
    entries: [
      { label: 'Currencies', icon: 'CircleDollarSign', href: '/dashboard/configuration/currencies' },
    ],
  },
  audit: {
    label: 'Audit',
    entries: [
      { label: 'Audit Logs', icon: 'History', href: '/dashboard/configuration/audit-logs' },
      { label: 'Cron', icon: 'Clock', href: '/dashboard/configuration/audit-logs/cron' },
      { label: 'Activity', icon: 'Activity', href: '/dashboard/configuration/audit-logs/activity' },
    ],
  },
  settings_general: {
    label: 'Settings',
    entries: [
      { label: 'General', icon: 'Settings', href: '/dashboard/configuration/settings' },
    ],
  },
  settings_location: {
    label: 'Settings',
    entries: [
      { label: 'Location', icon: 'MapPin', href: '/dashboard/configuration/settings/location' },
    ],
  },
  settings_ecommerce: {
    label: 'Settings',
    entries: [
      { label: 'eCommerce', icon: 'ShoppingCart', href: '/dashboard/configuration/settings/ecommerce' },
    ],
  },
  settings_telegram: {
    label: 'Settings',
    entries: [
      { label: 'Telegram Bot', icon: 'MessageSquare', href: '/dashboard/configuration/settings/telegram' },
    ],
  },
  settings_phone: {
    label: 'Settings',
    entries: [
      { label: 'Global Phone', icon: 'Phone', href: '/dashboard/configuration/settings/phone' },
    ],
  },
  settings_notifications: {
    label: 'Settings',
    entries: [
      { label: 'Notifications', icon: 'Bell', href: '/dashboard/configuration/settings/notifications' },
    ],
  },
  users_staff: {
    label: 'Users',
    entries: [
      { label: 'Users', icon: 'Users', href: '/dashboard/configuration/users' },
    ],
  },
  users_groups: {
    label: 'Users',
    entries: [
      { label: 'Groups', icon: 'Users', href: '/dashboard/configuration/users/groups' },
    ],
  },
  system: {
    label: 'System',
    entries: [
      { label: 'Policy', icon: 'Shield', href: '/dashboard/system/policy' },
    ],
  },
}

// ─── Section labels & detection ───────────────────────────────

export const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Catalog',
  sales: 'Sales',
  customers: 'Customers',
  marketing: 'Marketing',
  content: 'Content',
  media: 'Media',
  shops: 'Shop',
  payments: 'Payments',
  taxes: 'Taxes',
  shipping_zones: 'Shipping Zones',
  shipping_methods: 'Shipping Methods',
  currencies: 'Currencies',
  audit: 'Audit',
  settings_general: 'Settings',
  settings_location: 'Settings',
  settings_ecommerce: 'Settings',
  settings_telegram: 'Settings',
  settings_phone: 'Settings',
  settings_notifications: 'Settings',
  users_staff: 'Users',
  users_groups: 'Users',
  system: 'System',
}

export function detectSection(pathname: string): string {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard?tab=')) return 'dashboard'

  if (pathname.startsWith('/dashboard/inventory')) return 'inventory'
  if (pathname.startsWith('/dashboard/media')) return 'media'
  if (pathname.startsWith('/dashboard/sales')) return 'sales'
  if (pathname.startsWith('/dashboard/customers')) return 'customers'
  if (pathname.startsWith('/dashboard/marketing')) return 'marketing'
  if (pathname.startsWith('/dashboard/content')) return 'content'
  if (pathname.startsWith('/dashboard/system')) return 'system'

  // Configuration sub-sections (most specific first)
  if (pathname.startsWith('/dashboard/configuration/shipping-zones')) return 'shipping_zones'
  if (pathname.startsWith('/dashboard/configuration/shipping-methods')) return 'shipping_methods'
  if (pathname.startsWith('/dashboard/configuration/shops')) return 'shops'
  if (pathname.startsWith('/dashboard/configuration/payment-methods')) return 'payments'
  if (pathname.startsWith('/dashboard/configuration/tax-rates')) return 'taxes'
  if (pathname.startsWith('/dashboard/configuration/currencies')) return 'currencies'
  if (pathname.startsWith('/dashboard/configuration/audit-logs')) return 'audit'
  if (pathname === '/dashboard/configuration/settings/notifications') return 'settings_notifications'
  if (pathname === '/dashboard/configuration/settings/phone') return 'settings_phone'
  if (pathname === '/dashboard/configuration/settings/telegram') return 'settings_telegram'
  if (pathname === '/dashboard/configuration/settings/ecommerce') return 'settings_ecommerce'
  if (pathname === '/dashboard/configuration/settings/location') return 'settings_location'
  if (pathname.startsWith('/dashboard/configuration/settings')) return 'settings_general'
  if (pathname === '/dashboard/configuration/users/groups') return 'users_groups'
  if (pathname.startsWith('/dashboard/configuration/users')) return 'users_staff'

  // Generic configuration fallback
  if (pathname.startsWith('/dashboard/configuration')) return 'settings_general'

  // Legacy flat routes
  if (
    pathname.startsWith('/dashboard/products') ||
    pathname.startsWith('/dashboard/product-variants') ||
    pathname.startsWith('/dashboard/product-attributes') ||
    pathname.startsWith('/dashboard/product-attribute-values') ||
    pathname.startsWith('/dashboard/brands') ||
    pathname.startsWith('/dashboard/categories') ||
    pathname.startsWith('/dashboard/assets')
  ) return 'inventory'

  if (pathname.startsWith('/dashboard/orders') || pathname.startsWith('/dashboard/order-lines') || pathname.startsWith('/dashboard/invoices') || pathname.startsWith('/dashboard/payment-transactions')) return 'sales'
  if (pathname.startsWith('/dashboard/addresses') || pathname.startsWith('/dashboard/wishlist-items') || pathname.startsWith('/dashboard/cart-items')) return 'customers'
  if (pathname.startsWith('/dashboard/announcements') || pathname.startsWith('/dashboard/coupons') || pathname.startsWith('/dashboard/product-reviews')) return 'marketing'
  if (pathname.startsWith('/dashboard/pages') || pathname.startsWith('/dashboard/menus')) return 'content'

  // Legacy config flat routes
  if (pathname.startsWith('/dashboard/shipping-zones')) return 'shipping_zones'
  if (pathname.startsWith('/dashboard/shipping-methods')) return 'shipping_methods'
  if (pathname.startsWith('/dashboard/shops')) return 'shops'
  if (pathname.startsWith('/dashboard/payment-methods')) return 'payments'
  if (pathname.startsWith('/dashboard/tax-rates')) return 'taxes'
  if (pathname.startsWith('/dashboard/currencies')) return 'currencies'
  if (pathname.startsWith('/dashboard/audit')) return 'audit'
  if (pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/configurations')) return 'settings_general'

  return 'dashboard'
}

// ─── Helper: resolve icon component from string name ──────────

export { icon as resolveIcon }

// ─── Helper: get section key for a sidebar leaf ───────────────

export function isMenuEntry(entry: SidebarEntry): entry is SidebarMenu {
  return 'children' in entry
}

export function getLeafSection(leaf: SidebarLeaf): string {
  return leaf.section
}
