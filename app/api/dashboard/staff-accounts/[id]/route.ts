import { NextResponse } from 'next/server'
import { fetchStaffAccountFromDrizzle, resUserService, deleteStaffAccountFromDrizzle } from '@/lib/drizzle/staff-accounts'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const account = await fetchStaffAccountFromDrizzle(id)
    if (!account) return NextResponse.json({ error: 'Staff account not found' }, { status: 404 })
    return NextResponse.json(account)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff account' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = await resUserService.write(id, body)
    if (result.success) {
      const updated = await fetchStaffAccountFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
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
    const result = await deleteStaffAccountFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete staff account' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
