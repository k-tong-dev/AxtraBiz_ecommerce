import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { platform_admins, staff_accounts, users, shops } from '@/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[auth/me] supabase user:', user?.email, !!user)

    if (!user?.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // 1. Check platform admin (wrap in try-catch in case table doesn't exist)
    try {
      const [platformAdmin] = await db.select().from(platform_admins)
        .where(eq(platform_admins.email, user.email))
        .limit(1)

      if (platformAdmin) {
        return NextResponse.json({
          authenticated: true,
          role: 'platform_admin',
          redirect: '/admin',
          user: { id: platformAdmin.id, email: user.email, name: platformAdmin.full_name },
        })
      }
    } catch (e) {
      console.log('[auth/me] platform_admins query failed, skipping:', (e as Error).message)
    }

    // 2. Check staff account (wrap in try-catch in case table doesn't exist)
    try {
      const staffAccounts = await db.select().from(staff_accounts)
        .where(eq(staff_accounts.email, user.email))

      console.log('[auth/me] staffAccounts count:', staffAccounts.length, 'for email:', user.email)
      if (staffAccounts.length > 0) {
        staffAccounts.forEach(s => console.log('[auth/me] staff:', { id: s.id, shop_id: s.shop_id, is_owner: s.is_owner }))

        const primary = staffAccounts.find(s => s.shop_id !== null) || staffAccounts[0]

        let userShops: { id: number; name: string }[] = []
        if (primary.is_owner) {
          const ownerAccounts = staffAccounts.filter(s => s.is_owner)
          const shopIds = ownerAccounts.map(s => s.shop_id).filter((id): id is number => id !== null)
          if (shopIds.length > 0) {
            try {
              const shopRows = await db.select({ id: shops.id, name: shops.name })
                .from(shops)
                .where(inArray(shops.id, shopIds))
              userShops = shopRows
            } catch (e) {
              console.log('[auth/me] shops query failed:', (e as Error).message)
            }
          }
        }

      const needsShop = primary.is_owner && !primary.shop_id
      const hasMultipleShops = userShops.length > 1

      console.log('[auth/me] needsShop:', needsShop, 'hasMultipleShops:', hasMultipleShops, 'redirect:', needsShop || hasMultipleShops ? '/auth/setup' : '/admin')

      return NextResponse.json({
        authenticated: true,
        role: 'staff',
        redirect: needsShop || hasMultipleShops ? '/auth/setup' : '/admin',
          user: { id: primary.id, email: primary.email, name: primary.full_name },
          shopId: primary.shop_id,
          isOwner: primary.is_owner,
          needsShop,
          shops: userShops,
        })
      }
    } catch (e) {
      console.log('[auth/me] staff_accounts query failed, skipping:', (e as Error).message)
    }

    // 3. Check customer (wrap in try-catch in case table doesn't exist)
    try {
      const [customer] = await db.select().from(users)
        .where(eq(users.email, user.email))
        .limit(1)

      if (customer) {
        return NextResponse.json({
          authenticated: true,
          role: 'customer',
          redirect: '/shop',
          user: { id: customer.id, email: user.email, name: customer.name },
        })
      }
    } catch (e) {
      console.log('[auth/me] users query failed, skipping:', (e as Error).message)
    }

    // Authenticated but no profile found
    return NextResponse.json({
      authenticated: true,
      role: 'unknown',
      redirect: '/login',
      user: { email: user.email },
    })
  } catch (error) {
    console.error('[auth/me] UNCAUGHT ERROR:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '')
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 })
  }
}
