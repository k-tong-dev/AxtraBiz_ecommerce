import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseUrl, supabaseAnonKey, requireEnv } from './config'

export const updateSession = async (request: NextRequest) => {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl)
  const key = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey)

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl

  // ── Legacy route redirects ──
  const legacyMap: Record<string, string> = {
    '/admin/settings': '/admin/configuration/settings',
    '/admin/configurations': '/admin/configuration/configurations',
    '/admin/currencies': '/admin/configuration/currencies',
    '/admin/payment-methods': '/admin/configuration/payment-methods',
    '/admin/tax-rates': '/admin/configuration/tax-rates',
    '/admin/shipping-zones': '/admin/configuration/shipping-zones',
    '/admin/shipping-methods': '/admin/configuration/shipping-methods',
    '/admin/audit': '/admin/configuration/audit-logs',
    '/admin/products': '/admin/inventory/products',
    '/admin/product-variants': '/admin/inventory/product-variants',
    '/admin/brands': '/admin/inventory/brands',
    '/admin/categories': '/admin/inventory/categories',
    '/admin/product-attributes': '/admin/inventory/product-attributes',
    '/admin/product-attribute-values': '/admin/inventory/product-attribute-values',
    '/admin/orders': '/admin/sales/orders',
    '/admin/order-lines': '/admin/sales/order-lines',
    '/admin/invoices': '/admin/sales/invoices',
    '/admin/payment-transactions': '/admin/sales/payment-transactions',
    '/admin/addresses': '/admin/customers/addresses',
    '/admin/wishlist-items': '/admin/customers/wishlist-items',
    '/admin/cart-items': '/admin/customers/cart-items',
    '/admin/announcements': '/admin/marketing/announcements',
    '/admin/coupons': '/admin/marketing/coupons',
    '/admin/product-reviews': '/admin/marketing/product-reviews',
    '/admin/pages': '/admin/content/pages',
    '/admin/menus': '/admin/content/menus',
    '/admin/assets': '/admin/media/assets',
  }

  for (const [oldPrefix, newPath] of Object.entries(legacyMap)) {
    if (pathname === oldPrefix || pathname.startsWith(oldPrefix + '/')) {
      const suffix = pathname.startsWith(oldPrefix + '/') ? pathname.slice(oldPrefix.length) : ''
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `${newPath}${suffix}`
      redirectUrl.search = search
      return NextResponse.redirect(redirectUrl, { status: 301 })
    }
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApiRoute = pathname.startsWith('/api/admin')
  const isProtectedShopRoute =
    pathname.startsWith('/shop/profile') ||
    pathname.startsWith('/shop/orders') ||
    pathname.startsWith('/shop/checkout') ||
    pathname.startsWith('/shop/wishlist')

  if (!user && isAdminApiRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!user && (isAdminRoute || isProtectedShopRoute)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/shop/login'
    loginUrl.searchParams.set('redirect', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return response
}
