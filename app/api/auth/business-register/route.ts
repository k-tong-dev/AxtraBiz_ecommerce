import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { resUsers, resShops, m2mUsersShops } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { name, company, phone, currency } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Shop name is required' }, { status: 400 })
    }

    const slug = name
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      .slice(0, 60)

    const [existingUser] = await db.select()
      .from(resUsers)
      .where(eq(resUsers.authUserId, user.id))
      .limit(1)

    if (!existingUser) {
      return NextResponse.json({ error: 'User profile not found. Please sign out and sign in again.' }, { status: 400 })
    }

    const [shop] = await db.insert(resShops)
      .values({
        name: name.trim(),
        slug,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        email: user.email!,
        defaultCurrency: currency || 'USD',
      })
      .returning()

    await db.update(resUsers)
      .set({
        userRole: 'business',
        isShopOwner: true,
        shopId: shop.id,
        isVerified: true,
        updatedBy: user.id,
      })
      .where(eq(resUsers.id, existingUser.id))

    await db.insert(m2mUsersShops)
      .values({ userId: existingUser.id, shopId: shop.id, isDefault: true })
      .onConflictDoNothing()

    return NextResponse.json({
      success: true,
      data: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.displayName,
        shopId: shop.id,
        shopName: shop.name,
      },
    })
  } catch (error) {
    console.error('[business-register] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Registration failed',
    }, { status: 500 })
  }
}