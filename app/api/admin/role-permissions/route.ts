import { NextResponse } from 'next/server'
import { fetchRolePermissionsFromDrizzle, rolePermissionService, deleteRolePermissionFromDrizzle } from '@/lib/drizzle/role-permissions'

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
      const r = await rolePermissionService.upsert(item)
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      results.push(r.data ?? item)
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
    if (!id) return NextResponse.json({ error: 'RolePermission ID is required' }, { status: 400 })

    const result = await deleteRolePermissionFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete role permission' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
