import { NextResponse } from 'next/server'
import {
  fetchPlatformAdminsFromDrizzle,
  createPlatformAdminFromDrizzle,
  deletePlatformAdminFromDrizzle,
} from '@/lib/drizzle/platform-admins'

export async function GET() {
  try {
    const all = await fetchPlatformAdminsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch platform admins' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createPlatformAdminFromDrizzle({
      email: body.email,
      displayName: body.full_name || body.displayName,
    })
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const result = await deletePlatformAdminFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
