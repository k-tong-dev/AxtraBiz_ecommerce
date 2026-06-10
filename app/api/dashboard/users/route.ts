import { NextResponse } from 'next/server'
import { userService, deleteUserFromDrizzle, getUserByShop} from '@/lib/drizzle/queries/users'
import { syncUserShops } from '@/lib/drizzle/m2m'
import { createServiceRoleClient } from '@/lib/utils/supabase-service-role'
import { db } from '@/lib/drizzle/client'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { getCurrentShopId } from '@/lib/utils/current-user'

export async function GET() {
  try {
    const shopId = await getCurrentShopId()
    const all = shopId ? await getUserByShop(shopId) : null
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]
    const results: any[] = []

    for (const item of items) {
      const { password, shopId: rawShopId, ...userData } = item

      let shopIdArray: number[] = []
      if (Array.isArray(rawShopId)) {
        shopIdArray = rawShopId.map((s: any) => (typeof s === 'object' ? Number(s.id) : Number(s))).filter(Boolean)
        userData.shopId = shopIdArray[0] || null
      }

      const r = await userService.upsert(userData)
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      const created = r.data

      if (created?.id && shopIdArray.length > 0) {
        await syncUserShops({ userId: created.id, shopIds: shopIdArray })
      }

      if (password && created?.id) {
        const email = userData.email
        const supabase = createServiceRoleClient()
        const { error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            name: userData.displayName || userData.full_name,
            full_name: userData.displayName || userData.full_name,
          },
        })

        if (authError) {
          await db.delete(resUsers).where(eq(resUsers.id, created.id))
          return NextResponse.json({ success: false, error: `Failed to create auth user: ${authError.message}` }, { status: 400 })
        }

        await db.update(resUsers)
          .set({ active: true })
          .where(eq(resUsers.id, created.id))
      }

      results.push(created ?? { ...userData })
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    const result = await deleteUserFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
