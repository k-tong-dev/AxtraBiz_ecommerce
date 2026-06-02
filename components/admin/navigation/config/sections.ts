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
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/admin', section: 'dashboard' },
    ],
  },
  {
    label: 'Commerce',
    entries: [
      {
        label: 'Catalog', icon: 'Package',
        children: [
          { label: 'Inventory', icon: 'Warehouse', href: '/admin/inventory/dashboard', section: 'inventory' },
        ],
      },
      {
        label: 'Sales', icon: 'ShoppingCart',
        children: [
          { label: 'Orders', icon: 'ShoppingCart', href: '/admin/sales/orders', section: 'sales' },
          { label: 'Invoices', icon: 'FileText', href: '/admin/sales/invoices', section: 'sales' },
        ],
      },
      {
        label: 'Customers', icon: 'Users',
        children: [
          { label: 'Customer Directory', icon: 'Users', href: '/admin/customers', section: 'customers' },
        ],
      },
    ],
  },
  {
    label: 'Content',
    entries: [
      { label: 'Pages', icon: 'FileText', href: '/admin/content/pages', section: 'content' },
      { label: 'Menus', icon: 'Menu', href: '/admin/content/menus', section: 'content' },
    ],
  },
  {
    label: 'Marketing',
    entries: [
      { label: 'Announcements', icon: 'Megaphone', href: '/admin/marketing/announcements', section: 'marketing' },
      { label: 'Coupons', icon: 'Gift', href: '/admin/marketing/coupons', section: 'marketing' },
      { label: 'Reviews', icon: 'Star', href: '/admin/marketing/product-reviews', section: 'marketing' },
    ],
  },
  {
    label: 'Media',
    entries: [
      { label: 'Asset Management', icon: 'Image', href: '/admin/media/assets', section: 'media' },
    ],
  },
  {
    label: 'Configuration',
    entries: [
      { label: 'Shops', icon: 'Warehouse', href: '/admin/configuration/shops', section: 'shops' },
      { label: 'Payment Methods', icon: 'Wallet', href: '/admin/configuration/payment-methods', section: 'payments' },
      { label: 'Tax Rates', icon: 'Percent', href: '/admin/configuration/tax-rates', section: 'taxes' },
      {
        label: 'Shipping', icon: 'Truck',
        children: [
          { label: 'Shipping Zones', icon: 'Globe', href: '/admin/configuration/shipping-zones', section: 'shipping_zones' },
          { label: 'Shipping Methods', icon: 'Truck', href: '/admin/configuration/shipping-methods', section: 'shipping_methods' },
        ],
      },
      { label: 'Currencies', icon: 'CircleDollarSign', href: '/admin/configuration/currencies', section: 'currencies' },
      { label: 'Audit Logs', icon: 'History', href: '/admin/configuration/audit-logs', section: 'audit' },
      {
        label: 'Settings', icon: 'Settings',
        children: [
          { label: 'General', icon: 'Settings', href: '/admin/configuration/settings', section: 'settings_general' },
          { label: 'Location', icon: 'MapPin', href: '/admin/configuration/settings/location', section: 'settings_location' },
          { label: 'eCommerce', icon: 'ShoppingCart', href: '/admin/configuration/settings/ecommerce', section: 'settings_ecommerce' },
          { label: 'Telegram Bot', icon: 'MessageSquare', href: '/admin/configuration/settings/telegram', section: 'settings_telegram' },
          { label: 'Global Phone', icon: 'Phone', href: '/admin/configuration/settings/phone', section: 'settings_phone' },
          { label: 'Notifications', icon: 'Bell', href: '/admin/configuration/settings/notifications', section: 'settings_notifications' },
        ],
      },
      {
        label: 'Users', icon: 'Users',
        children: [
          { label: 'Staff Accounts', icon: 'Users', href: '/admin/configuration/users', section: 'users_staff' },
          { label: 'Groups', icon: 'Users', href: '/admin/configuration/users/groups', section: 'users_groups' },
        ],
      },
    ],
  },
  {
    label: 'System',
    entries: [
      { label: 'Policy', icon: 'Shield', href: '/admin/system/policy', section: 'system' },
    ],
  },
]

// ─── Module-bar section data ──────────────────────────────────

export const sectionModules: SectionModules = {
  dashboard: {
    label: 'Dashboard',
    entries: [
      { label: 'Overview', icon: 'LayoutDashboard', href: '/admin' },
      { label: 'Revenue', icon: 'DollarSign', href: '/admin?tab=revenue' },
      { label: 'Analytics', icon: 'BarChart3', href: '/admin?tab=analytics' },
      { label: 'Reports', icon: 'LineChart', href: '/admin?tab=reports' },
    ],
  },
  inventory: {
    label: 'Catalog',
    entries: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/admin/inventory/dashboard' },
      {
        label: 'Products', icon: 'Package',
        children: [
          { label: 'Products', icon: 'Package', href: '/admin/inventory/products' },
          { label: 'Product Variants', icon: 'Package', href: '/admin/inventory/product-variants' },
        ],
      },
      {
        label: 'Configuration', icon: 'SlidersHorizontal',
        children: [
          { label: 'Brand', icon: 'Tag', href: '/admin/inventory/brands' },
          { label: 'Category', icon: 'FolderTree', href: '/admin/inventory/categories' },
          { label: 'Attribute', icon: 'SlidersHorizontal', href: '/admin/inventory/product-attributes' },
          { label: 'Attribute Values', icon: 'SlidersHorizontal', href: '/admin/inventory/product-attribute-values' },
        ],
      },
    ],
  },
  sales: {
    label: 'Sales',
    entries: [
      { label: 'Orders', icon: 'ShoppingCart', href: '/admin/sales/orders' },
      { label: 'Order Lines', icon: 'ListOrdered', href: '/admin/sales/order-lines' },
      { label: 'Invoices', icon: 'FileText', href: '/admin/sales/invoices' },
      { label: 'Payment Trans.', icon: 'CreditCard', href: '/admin/sales/payment-transactions' },
    ],
  },
  customers: {
    label: 'Customers',
    entries: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/admin/customers/dashboard' },
      { label: 'Customers', icon: 'Users', href: '/admin/customers' },
      { label: 'Addresses', icon: 'MapPin', href: '/admin/customers/addresses' },
      { label: 'Wishlist', icon: 'Heart', href: '/admin/customers/wishlist-items' },
      { label: 'Cart Items', icon: 'ShoppingCart', href: '/admin/customers/cart-items' },
    ],
  },
  marketing: {
    label: 'Marketing',
    entries: [
      { label: 'Announcements', icon: 'Megaphone', href: '/admin/marketing/announcements' },
      { label: 'Coupons', icon: 'Gift', href: '/admin/marketing/coupons' },
      { label: 'Reviews', icon: 'Star', href: '/admin/marketing/product-reviews' },
    ],
  },
  content: {
    label: 'Content',
    entries: [
      { label: 'Pages', icon: 'FileText', href: '/admin/content/pages' },
      { label: 'Menus', icon: 'Menu', href: '/admin/content/menus' },
    ],
  },
  media: {
    label: 'Media',
    entries: [
      { label: 'Assets', icon: 'Image', href: '/admin/media/assets' },
    ],
  },
  shops: {
    label: 'Shop',
    entries: [
      { label: 'Shops', icon: 'Warehouse', href: '/admin/configuration/shops' },
    ],
  },
  payments: {
    label: 'Payments',
    entries: [
      { label: 'Payment Methods', icon: 'Wallet', href: '/admin/configuration/payment-methods' },
    ],
  },
  taxes: {
    label: 'Taxes',
    entries: [
      { label: 'Tax Rates', icon: 'Percent', href: '/admin/configuration/tax-rates' },
    ],
  },
  shipping_zones: {
    label: 'Shipping Zones',
    entries: [
      { label: 'Shipping Zones', icon: 'Globe', href: '/admin/configuration/shipping-zones' },
    ],
  },
  shipping_methods: {
    label: 'Shipping Methods',
    entries: [
      { label: 'Shipping Methods', icon: 'Truck', href: '/admin/configuration/shipping-methods' },
    ],
  },
  currencies: {
    label: 'Currencies',
    entries: [
      { label: 'Currencies', icon: 'CircleDollarSign', href: '/admin/configuration/currencies' },
    ],
  },
  audit: {
    label: 'Audit',
    entries: [
      { label: 'Audit Logs', icon: 'History', href: '/admin/configuration/audit-logs' },
      { label: 'Cron', icon: 'Clock', href: '/admin/configuration/audit-logs/cron' },
      { label: 'Activity', icon: 'Activity', href: '/admin/configuration/audit-logs/activity' },
    ],
  },
  settings_general: {
    label: 'Settings',
    entries: [
      { label: 'General', icon: 'Settings', href: '/admin/configuration/settings' },
    ],
  },
  settings_location: {
    label: 'Settings',
    entries: [
      { label: 'Location', icon: 'MapPin', href: '/admin/configuration/settings/location' },
    ],
  },
  settings_ecommerce: {
    label: 'Settings',
    entries: [
      { label: 'eCommerce', icon: 'ShoppingCart', href: '/admin/configuration/settings/ecommerce' },
    ],
  },
  settings_telegram: {
    label: 'Settings',
    entries: [
      { label: 'Telegram Bot', icon: 'MessageSquare', href: '/admin/configuration/settings/telegram' },
    ],
  },
  settings_phone: {
    label: 'Settings',
    entries: [
      { label: 'Global Phone', icon: 'Phone', href: '/admin/configuration/settings/phone' },
    ],
  },
  settings_notifications: {
    label: 'Settings',
    entries: [
      { label: 'Notifications', icon: 'Bell', href: '/admin/configuration/settings/notifications' },
    ],
  },
  users_staff: {
    label: 'Users',
    entries: [
      { label: 'Staff Accounts', icon: 'Users', href: '/admin/configuration/users' },
    ],
  },
  users_groups: {
    label: 'Users',
    entries: [
      { label: 'Groups', icon: 'Users', href: '/admin/configuration/users/groups' },
    ],
  },
  system: {
    label: 'System',
    entries: [
      { label: 'Policy', icon: 'Shield', href: '/admin/system/policy' },
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
  if (pathname === '/admin' || pathname.startsWith('/admin?tab=')) return 'dashboard'

  if (pathname.startsWith('/admin/inventory')) return 'inventory'
  if (pathname.startsWith('/admin/media')) return 'media'
  if (pathname.startsWith('/admin/sales')) return 'sales'
  if (pathname.startsWith('/admin/customers')) return 'customers'
  if (pathname.startsWith('/admin/marketing')) return 'marketing'
  if (pathname.startsWith('/admin/content')) return 'content'
  if (pathname.startsWith('/admin/system')) return 'system'

  // Configuration sub-sections (most specific first)
  if (pathname.startsWith('/admin/configuration/shipping-zones')) return 'shipping_zones'
  if (pathname.startsWith('/admin/configuration/shipping-methods')) return 'shipping_methods'
  if (pathname.startsWith('/admin/configuration/shops')) return 'shops'
  if (pathname.startsWith('/admin/configuration/payment-methods')) return 'payments'
  if (pathname.startsWith('/admin/configuration/tax-rates')) return 'taxes'
  if (pathname.startsWith('/admin/configuration/currencies')) return 'currencies'
  if (pathname.startsWith('/admin/configuration/audit-logs')) return 'audit'
  if (pathname === '/admin/configuration/settings/notifications') return 'settings_notifications'
  if (pathname === '/admin/configuration/settings/phone') return 'settings_phone'
  if (pathname === '/admin/configuration/settings/telegram') return 'settings_telegram'
  if (pathname === '/admin/configuration/settings/ecommerce') return 'settings_ecommerce'
  if (pathname === '/admin/configuration/settings/location') return 'settings_location'
  if (pathname.startsWith('/admin/configuration/settings')) return 'settings_general'
  if (pathname === '/admin/configuration/users/groups') return 'users_groups'
  if (pathname.startsWith('/admin/configuration/users')) return 'users_staff'

  // Generic configuration fallback
  if (pathname.startsWith('/admin/configuration')) return 'settings_general'

  // Legacy flat routes
  if (
    pathname.startsWith('/admin/products') ||
    pathname.startsWith('/admin/product-variants') ||
    pathname.startsWith('/admin/product-attributes') ||
    pathname.startsWith('/admin/product-attribute-values') ||
    pathname.startsWith('/admin/brands') ||
    pathname.startsWith('/admin/categories') ||
    pathname.startsWith('/admin/assets')
  ) return 'inventory'

  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/order-lines') || pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/payment-transactions')) return 'sales'
  if (pathname.startsWith('/admin/addresses') || pathname.startsWith('/admin/wishlist-items') || pathname.startsWith('/admin/cart-items')) return 'customers'
  if (pathname.startsWith('/admin/announcements') || pathname.startsWith('/admin/coupons') || pathname.startsWith('/admin/product-reviews')) return 'marketing'
  if (pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/menus')) return 'content'

  // Legacy config flat routes
  if (pathname.startsWith('/admin/shipping-zones')) return 'shipping_zones'
  if (pathname.startsWith('/admin/shipping-methods')) return 'shipping_methods'
  if (pathname.startsWith('/admin/shops')) return 'shops'
  if (pathname.startsWith('/admin/payment-methods')) return 'payments'
  if (pathname.startsWith('/admin/tax-rates')) return 'taxes'
  if (pathname.startsWith('/admin/currencies')) return 'currencies'
  if (pathname.startsWith('/admin/audit')) return 'audit'
  if (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/configurations')) return 'settings_general'

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
