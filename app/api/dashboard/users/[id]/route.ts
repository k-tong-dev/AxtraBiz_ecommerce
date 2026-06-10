import { NextResponse } from 'next/server'
import { fetchUserFromDrizzle, userService, deleteUserFromDrizzle, enrichUserWithM2M } from '@/lib/drizzle/queries/users'
import { syncUserShops, syncUserGroups } from '@/lib/drizzle/m2m'

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
    return NextResponse.json(await enrichUserWithM2M(user, id))
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

    return NextResponse.json({ success: true, data: await enrichUserWithM2M(user, id) })
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
