'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Percent,
  FolderTree,
  Truck,
  SlidersHorizontal,
  FileText,
  Megaphone,
  Settings,
  Gift,
  Star,
  MapPin,
  Wallet,
  CreditCard,
  Heart,
  ListOrdered,
  Menu,
  Warehouse,
  DollarSign,
  BarChart3,
  LineChart,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface LinkItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface GroupItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

type NavEntry = LinkItem | GroupItem

type SectionModules = Record<string, { entries: NavEntry[] }>

const sectionModules: SectionModules = {
  dashboard: {
    entries: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Revenue', href: '/admin?tab=revenue', icon: DollarSign },
      { label: 'Analytics', href: '/admin?tab=analytics', icon: BarChart3 },
      { label: 'Reports', href: '/admin?tab=reports', icon: LineChart },
    ],
  },
  catalog: {
    entries: [
      { label: 'Dashboard', href: '/admin/inventory', icon: LayoutDashboard },
      {
        label: 'Products',
        icon: Package,
        children: [
          { label: 'Products', href: '/admin/products', icon: Package },
          { label: 'Product Variants', href: '/admin/product-variants', icon: Package },
        ],
      },
      {
        label: 'Configuration',
        icon: SlidersHorizontal,
        children: [
          { label: 'Brand', href: '/admin/brands', icon: Tag },
          { label: 'Category', href: '/admin/categories', icon: FolderTree },
          { label: 'Attribute', href: '/admin/product-attributes', icon: SlidersHorizontal },
          { label: 'Attribute Values', href: '/admin/product-attribute-values', icon: SlidersHorizontal },
        ],
      },
      { label: 'Tax Rates', href: '/admin/tax-rates', icon: Percent },
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
}

function detectSection(pathname: string): string {
  if (pathname === '/admin' || pathname.startsWith('/admin?tab=')) return 'dashboard'
  if (pathname.startsWith('/admin/inventory') || pathname.startsWith('/admin/products') || pathname.startsWith('/admin/product-variants') || pathname.startsWith('/admin/product-attributes') || pathname.startsWith('/admin/product-attribute-values') || pathname.startsWith('/admin/brands') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/tax-rates') || pathname.startsWith('/admin/shipping-zones') || pathname.startsWith('/admin/shipping-methods')) return 'catalog'
  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/order-lines') || pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/payment-transactions')) return 'sales'
  if (pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/addresses') || pathname.startsWith('/admin/wishlist-items') || pathname.startsWith('/admin/cart-items') || pathname.startsWith('/admin/payment-methods')) return 'customers'
  if (pathname.startsWith('/admin/announcements') || pathname.startsWith('/admin/coupons') || pathname.startsWith('/admin/product-reviews')) return 'marketing'
  if (pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/menus')) return 'content'
  if (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/configurations')) return 'system'
  return 'dashboard'
}

const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  catalog: 'Catalog',
  sales: 'Sales',
  customers: 'Customers',
  marketing: 'Marketing',
  content: 'Content',
  system: 'System',
}

function isLinkItem(entry: NavEntry): entry is LinkItem {
  return 'href' in entry
}

export function ModuleNavBar() {
  const pathname = usePathname()
  const section = detectSection(pathname)
  const { entries } = sectionModules[section] || sectionModules.dashboard

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-1.5 scrollbar-none">
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider mr-1">
          {sectionLabels[section]}
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
