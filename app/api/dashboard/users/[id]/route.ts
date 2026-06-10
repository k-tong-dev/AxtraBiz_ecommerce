import { NextResponse } from 'next/server'
import { fetchUserFromDrizzle, userService, deleteUserFromDrizzle } from '@/lib/drizzle/queries/users'
import { syncUserShops } from '@/lib/drizzle/m2m'
import { db } from '@/lib/drizzle/server'
import { resShops, m2mUsersShops } from '@/lib/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await fetchUserFromDrizzle(id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const m2mRecords = await db.select()
      .from(m2mUsersShops)
      .where(eq(m2mUsersShops.userId, id))

    const result: any = { ...user }
    if (m2mRecords.length > 0) {
      const shopIds = m2mRecords.map(r => r.shopId)
      const shops = await db.select({ id: resShops.id, name: resShops.name })
        .from(resShops)
        .where(inArray(resShops.id, shopIds))
      result.shopId = shops
    } else {
      result.shopId = []
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    let shopIdArray: number[] = []
    if (Array.isArray(body.shopId)) {
      shopIdArray = body.shopId.map((s: any) => (typeof s === 'object' ? Number(s.id) : Number(s))).filter(Boolean)
      body.shopId = shopIdArray[0] || null
    }

    const result = await userService.write(id, body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    if (shopIdArray.length > 0) {
      await syncUserShops({ userId: id, shopIds: shopIdArray })
    }

    const user = await fetchUserFromDrizzle(id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const resultData: any = { ...user }
    const m2mRecords = await db.select()
      .from(m2mUsersShops)
      .where(eq(m2mUsersShops.userId, id))

    if (m2mRecords.length > 0) {
      const shopIds = m2mRecords.map(r => r.shopId)
      const shops = await db.select({ id: resShops.id, name: resShops.name })
        .from(resShops)
        .where(inArray(resShops.id, shopIds))
      resultData.shopId = shops
    } else {
      resultData.shopId = []
    }

    return NextResponse.json({ success: true, data: resultData })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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
