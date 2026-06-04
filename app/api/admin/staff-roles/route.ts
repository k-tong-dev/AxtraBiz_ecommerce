import { NextResponse } from 'next/server'
import { fetchStaffRolesFromDrizzle, deleteStaffRoleFromDrizzle } from '@/lib/drizzle/staff-roles'
import { assignStaffRole, removeStaffRole } from '@/lib/drizzle/m2m/staff-roles'

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
      const r = await assignStaffRole({ staffId: item.staff_id, roleId: item.role_id })
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      results.push({ staff_id: item.staff_id, role_id: item.role_id })
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
    const staffId = new URL(request.url).searchParams.get('staff_id')
    const roleId = new URL(request.url).searchParams.get('role_id')

    if (!staffId || !roleId) {
      return NextResponse.json({ error: 'staff_id and role_id are required' }, { status: 400 })
    }

    const result = await removeStaffRole(Number(staffId), Number(roleId))
    return result.success
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
