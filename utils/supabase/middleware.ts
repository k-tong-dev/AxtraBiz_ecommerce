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
  const isAdminRoute = pathname.startsWith('/admin')
  const isProtectedShopRoute =
    pathname.startsWith('/shop/profile') ||
    pathname.startsWith('/shop/orders') ||
    pathname.startsWith('/shop/checkout') ||
    pathname.startsWith('/shop/wishlist')

  if (!user && (isAdminRoute || isProtectedShopRoute)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/shop/login'
    loginUrl.searchParams.set('redirect', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return response
}
