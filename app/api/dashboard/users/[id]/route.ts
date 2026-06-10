import { NextResponse } from 'next/server'
import { fetchUserFromDrizzle, userService, deleteUserFromDrizzle } from '@/lib/drizzle/queries/users'
import { syncUserShops, syncUserGroups } from '@/lib/drizzle/m2m'
import { db } from '@/lib/drizzle/server'
import { resShops, resGroups, m2mUsersShops, m2mUsersGroups } from '@/lib/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

async function enrichWithM2M(user: any, id: string) {
  const result: any = { ...user }

  const shopRecords = await db.select()
    .from(m2mUsersShops)
    .where(eq(m2mUsersShops.userId, id))
  if (shopRecords.length > 0) {
    const shopIds = shopRecords.map(r => r.shopId)
    const shops = await db.select({ id: resShops.id, name: resShops.name })
      .from(resShops)
      .where(inArray(resShops.id, shopIds))
    result.shop_ids = shops
  } else {
    result.shop_ids = []
  }

  const groupRecords = await db.select()
    .from(m2mUsersGroups)
    .where(eq(m2mUsersGroups.userId, id))
  if (groupRecords.length > 0) {
    const groupIds = groupRecords.map(r => r.groupId)
    const groups = await db.select({ id: resGroups.id, name: resGroups.name })
      .from(resGroups)
      .where(inArray(resGroups.id, groupIds))
    result.group_ids = groups
  } else {
    result.group_ids = []
  }

  return result
}

function extractM2MIds(body: any, key: string): number[] {
  const raw = body[key]
  delete body[key]
  if (!Array.isArray(raw)) return []
  return raw.map((s: any) => (typeof s === 'object' ? Number(s.id) : Number(s))).filter(Boolean)
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await fetchUserFromDrizzle(id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(await enrichWithM2M(user, id))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const shopIds = extractM2MIds(body, 'shop_ids')
    const groupIds = extractM2MIds(body, 'group_ids')

    const result = await userService.write(id, body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    await syncUserShops({ userId: id, shopIds })
    await syncUserGroups({ userId: id, groupIds })

    const user = await fetchUserFromDrizzle(id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: await enrichWithM2M(user, id) })
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
