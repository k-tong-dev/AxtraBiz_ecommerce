import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createShopWithOwner } from '@/lib/drizzle/queries/shops'

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

    const result = await createShopWithOwner(
      { name, company, phone, currency },
      user.id,
      user.email!,
    )

    return NextResponse.json({
      success: true,
      data: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        shopId: result.shop.id,
        shopName: result.shop.name,
      },
    })
  } catch (error) {
    console.error('[business-register] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Registration failed',
    }, { status: 500 })
  }
}