import { NextResponse } from 'next/server'
import { fetchRolePermissionsFromDrizzle } from '@/lib/drizzle/role-permissions'
import { assignRolePermission, removeRolePermission } from '@/lib/drizzle/m2m/roles-permissions'

export async function GET() {
  try {
    const all = await fetchRolePermissionsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch role permissions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]
    const results: any[] = []

    for (const item of items) {
      const r = await assignRolePermission({ groupId: item.group_id || item.role_id, permissionId: item.permission_id })
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      results.push({ group_id: item.group_id || item.role_id, permission_id: item.permission_id })
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
    const groupId = new URL(request.url).searchParams.get('group_id') || new URL(request.url).searchParams.get('role_id')
    const permissionId = new URL(request.url).searchParams.get('permission_id')

    if (!groupId || !permissionId) {
      return NextResponse.json({ error: 'group_id and permission_id are required' }, { status: 400 })
    }

    const result = await removeRolePermission(groupId, permissionId)
    return result.success
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
