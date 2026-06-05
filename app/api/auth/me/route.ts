import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { resUsers, m2mUsersShops, resShops } from '@/lib/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[auth/me] supabase user:', user?.email, !!user)

    if (!user?.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Query resUsers by email
    try {
      const [resUser] = await db.select().from(resUsers)
        .where(eq(resUsers.email, user.email))
        .limit(1)

      if (resUser) {
        // Role: _admin_system_ → platform admin
        if (resUser.userRole === '_admin_system_') {
          return NextResponse.json({
            authenticated: true,
            role: 'platform_admin',
            redirect: '/dashboard',
            user: { id: resUser.id, email: resUser.email, name: resUser.displayName },
            shopId: null,
            isOwner: false,
            needsShop: false,
            shops: [],
          })
        }

        // Role: new → needs business registration
        if (resUser.userRole === 'new') {
          return NextResponse.json({
            authenticated: true,
            role: 'new',
            redirect: '/business-register',
            user: { id: resUser.id, email: resUser.email, name: resUser.displayName },
            shopId: null,
            isOwner: false,
            needsShop: true,
            shops: [],
          })
        }

        // Fetch shops from m2mUsersShops
        let userShops: { id: string; name: string }[] = []
        try {
          const shopRows = await db.select({ id: resShops.id, name: resShops.name })
            .from(m2mUsersShops)
            .innerJoin(resShops, eq(m2mUsersShops.shopId, resShops.id))
            .where(eq(m2mUsersShops.userId, resUser.id))
          userShops = shopRows
        } catch (e) {
          console.log('[auth/me] m2mUsersShops query failed:', (e as Error).message)
        }

        // isShopOwner → business owner (with or without shop)
        if (resUser.isShopOwner) {
          const needsShop = !resUser.shopId
          return NextResponse.json({
            authenticated: true,
            role: 'business_owner',
            redirect: needsShop ? '/auth/setup' : '/dashboard',
            user: { id: resUser.id, email: resUser.email, name: resUser.displayName },
            shopId: resUser.shopId,
            isOwner: true,
            needsShop,
            shops: userShops,
          })
        }

        // Employee
        if (resUser.userRole === 'employee') {
          return NextResponse.json({
            authenticated: true,
            role: 'employee',
            redirect: '/dashboard',
            user: { id: resUser.id, email: resUser.email, name: resUser.displayName },
            shopId: resUser.shopId,
            isOwner: false,
            needsShop: false,
            shops: userShops,
          })
        }

        // Fallback for other roles
        return NextResponse.json({
          authenticated: true,
          role: resUser.userRole,
          redirect: resUser.shopId ? '/dashboard' : '/auth/setup',
          user: { id: resUser.id, email: resUser.email, name: resUser.displayName },
          shopId: resUser.shopId,
          isOwner: resUser.isShopOwner,
          needsShop: !resUser.shopId,
          shops: userShops,
        })
      }
    } catch (e) {
      console.log('[auth/me] resUsers query failed:', (e as Error).message)
    }

    // Authenticated but no profile found
    return NextResponse.json({
      authenticated: true,
      role: 'unknown',
      redirect: '/auth/signin',
      user: { email: user.email },
    })
  } catch (error) {
    console.error('[auth/me] UNCAUGHT ERROR:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '')
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 })
  }
}
