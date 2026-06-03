import { NextResponse } from 'next/server'
import {
  fetchStaffRolesFromDrizzle,
  staffRoleService,
  deleteStaffRoleFromDrizzle,
} from '@/lib/drizzle/staff-roles'

export async function GET() {
  try {
    const all = await fetchStaffRolesFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff roles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]
    const results: any[] = []

    for (const item of items) {
      const r = await staffRoleService.upsert(item)
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      results.push(r.data ?? item)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 },
    )
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
    if (!id) return NextResponse.json({ error: 'Staff role ID is required' }, { status: 400 })

    const result = await deleteStaffRoleFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete staff role' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
