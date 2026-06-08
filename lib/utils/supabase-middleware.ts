import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseUrl, supabaseAnonKey, requireEnv } from './supabase-config'

const AUTH_COOKIE_NAMES = [
  'sb-access-token',
  'sb-refresh-token',
  'sb-auth-token',
  'supabase-auth-token',
]

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

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error && !user) {
    AUTH_COOKIE_NAMES.forEach(name => {
      response.cookies.set(name, '', { maxAge: 0, path: '/' })
    })
  }

  const { pathname, search } = request.nextUrl

  const legacyMap: Record<string, string> = {
    '/dashboard/settings': '/dashboard/configuration/settings',
    '/dashboard/configurations': '/dashboard/configuration/configurations',
    '/dashboard/currencies': '/dashboard/configuration/currencies',
    '/dashboard/payment-methods': '/dashboard/configuration/payment-methods',
    '/dashboard/tax-rates': '/dashboard/configuration/tax-rates',
    '/dashboard/shipping-zones': '/dashboard/configuration/shipping-zones',
    '/dashboard/shipping-methods': '/dashboard/configuration/shipping-methods',
    '/dashboard/audit': '/dashboard/configuration/audit-logs',
    '/dashboard/products': '/dashboard/inventory/products',
    '/dashboard/product-variants': '/dashboard/inventory/product-variants',
    '/dashboard/brands': '/dashboard/inventory/brands',
    '/dashboard/categories': '/dashboard/inventory/categories',
    '/dashboard/product-attributes': '/dashboard/inventory/product-attributes',
    '/dashboard/product-attribute-values': '/dashboard/inventory/product-attribute-values',
    '/dashboard/orders': '/dashboard/sales/orders',
    '/dashboard/order-lines': '/dashboard/sales/order-lines',
    '/dashboard/invoices': '/dashboard/sales/invoices',
    '/dashboard/payment-transactions': '/dashboard/sales/payment-transactions',
    '/dashboard/addresses': '/dashboard/customers/addresses',
    '/dashboard/wishlist-items': '/dashboard/customers/wishlist-items',
    '/dashboard/cart-items': '/dashboard/customers/cart-items',
    '/dashboard/announcements': '/dashboard/marketing/announcements',
    '/dashboard/coupons': '/dashboard/marketing/coupons',
    '/dashboard/product-reviews': '/dashboard/marketing/product-reviews',
    '/dashboard/pages': '/dashboard/content/pages',
    '/dashboard/menus': '/dashboard/content/menus',
    '/dashboard/assets': '/dashboard/media/assets',
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

  const isAdminRoute = pathname.startsWith('/dashboard')
  const isAdminApiRoute = pathname.startsWith('/api/dashboard')
  const isProtectedShopRoute =
    pathname.startsWith('/website/profile') ||
    pathname.startsWith('/website/orders') ||
    pathname.startsWith('/website/checkout') ||
    pathname.startsWith('/website/wishlist')
  const isAppRoute = pathname.startsWith('/shop')

  const isLoginPage = pathname === '/auth/signin'

  if (user && isLoginPage) {
    const dest = request.nextUrl.clone()
    dest.pathname = '/dashboard'
    return NextResponse.redirect(dest)
  }

  if (!user) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((isAdminRoute || isProtectedShopRoute || isAppRoute) && !isLoginPage) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/signin'
      loginUrl.searchParams.set('redirect', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}
