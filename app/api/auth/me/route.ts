import { NextResponse } from 'next/server'
import { createClient } from '@/lib/utils/supabase-server'
import { db } from '@/lib/drizzle/client'
import { resUsers, resGroups, m2mUsersShops, m2mUsersGroups, resShops } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { checkCreateUserIfNotExit } from '@/lib/drizzle/queries/users'

const AUTH_COOKIE_NAMES = [
  'sb-access-token',
  'sb-refresh-token',
  'sb-auth-token',
  'supabase-auth-token',
]

function buildResponse(resUser: typeof resUsers.$inferSelect, shopCount = 0) {
  const role = resUser.userRole === '_admin_system_' ? 'platform_admin'
    : resUser.userRole === 'new' ? 'new'
    : resUser.isShopOwner ? 'business_owner'
    : resUser.userRole

  const needsShop = resUser.userRole === 'new' || (resUser.isShopOwner && !resUser.shopId)
  const needsVerification = resUser.userRole === 'new' || !resUser.isVerified

  let redirect: string
  if (role === 'platform_admin') {
    redirect = '/dashboard'
  } else if (needsVerification || needsShop) {
    redirect = '/shop/register'
  } else if (shopCount > 1) {
    redirect = '/shop'
  } else {
    redirect = '/dashboard'
  }

  return {
    authenticated: true,
    role,
    redirect,
    user: {
      id: resUser.id,
      email: resUser.email,
      name: resUser.displayName,
      isVerified: resUser.isVerified,
    },
    shopId: resUser.shopId,
    isOwner: resUser.isShopOwner,
    needsShop,
    needsVerification,
    shops: [] as { id: number; name: string; slug: string; isDefault: boolean | null }[],
    groups: [] as { id: number; name: string }[],
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    console.log('[auth/me] supabase user:', user?.email, !!user, error?.message)

    if (error || !user?.email) {
      const response = NextResponse.json({ authenticated: false, deleted: !!error }, { status: 401 })
      AUTH_COOKIE_NAMES.forEach(name => {
        response.cookies.set(name, '', { maxAge: 0, path: '/' })
      })
      return response
    }

    const { user: resUser, created } = await checkCreateUserIfNotExit(user.email, user.user_metadata)
    if (created) {
      console.log('[auth/me] auto-created profile for:', user.email)
    }

    const userShops = await db.select({
        id: resShops.id,
        name: resShops.name,
        slug: resShops.slug,
        isDefault: m2mUsersShops.isDefault,
      })
      .from(m2mUsersShops)
      .innerJoin(resShops, eq(m2mUsersShops.shopId, resShops.id))
      .where(eq(m2mUsersShops.userId, resUser.id))
      .catch(() => [] as { id: number; name: string; slug: string; isDefault: boolean | null }[])

    const userGroups = await db.select({id: resGroups.id, name: resGroups.name})
      .from(m2mUsersGroups)
      .innerJoin(resGroups, eq(m2mUsersGroups.groupId, resGroups.id))
      .where(eq(m2mUsersGroups.userId, resUser.id))
      .catch(() => [] as { id: number; name: string }[])

    const data = buildResponse(resUser, userShops.length)
    data.shops = userShops
    data.groups = userGroups

    return NextResponse.json(data)
  } catch (error) {
    console.error('[auth/me] UNCAUGHT ERROR:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '')
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 })
  }
}
