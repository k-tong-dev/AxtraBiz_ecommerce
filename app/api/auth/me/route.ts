import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { platform_admins, staff_accounts, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // 1. Check platform admin
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

    // 2. Check staff account
    const staffAccounts = await db.select().from(staff_accounts)
      .where(eq(staff_accounts.email, user.email))
      .limit(1)

    if (staffAccounts.length > 0) {
      const staff = staffAccounts[0]
      return NextResponse.json({
        authenticated: true,
        role: 'staff',
        redirect: '/admin',
        user: { id: staff.id, email: staff.email, name: staff.full_name },
        shopId: staff.shop_id,
        isOwner: staff.is_owner,
      })
    }

    // 3. Check customer
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

    // Authenticated but no profile found
    return NextResponse.json({
      authenticated: true,
      role: 'unknown',
      redirect: '/',
      user: { email: user.email },
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 })
  }
}
