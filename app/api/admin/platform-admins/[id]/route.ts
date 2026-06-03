import { NextResponse } from 'next/server'
import {
  fetchPlatformAdminFromDrizzle,
  updatePlatformAdminFromDrizzle,
  deletePlatformAdminFromDrizzle,
} from '@/lib/drizzle/platform-admins'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const result = await fetchPlatformAdminFromDrizzle(Number(id))
    return result
      ? NextResponse.json(result)
      : NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch platform admin' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const body = await request.json()
    const result = await updatePlatformAdminFromDrizzle(Number(id), body)
    return result
      ? NextResponse.json({ success: true, data: result })
      : NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const result = await deletePlatformAdminFromDrizzle(Number(id))
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
