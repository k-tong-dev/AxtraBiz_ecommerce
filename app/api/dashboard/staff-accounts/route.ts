import { NextResponse } from 'next/server'
import { fetchStaffAccountsFromDrizzle, resUserService, deleteStaffAccountFromDrizzle } from '@/lib/drizzle/queries/staff-accounts'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { db } from '@/lib/drizzle/client'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const all = await fetchStaffAccountsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff accounts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]
    const results: any[] = []

    for (const item of items) {
      const { password, ...staffData } = item
      const r = await resUserService.upsert(staffData)
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      const created = r.data

      if (password && created?.id) {
        const email = staffData.email
        // Create Supabase auth user for this staff member
        const supabase = createServiceRoleClient()
        const { error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            name: staffData.displayName || staffData.full_name,
            full_name: staffData.displayName || staffData.full_name,
          },
        })

        if (authError) {
          // Cleanup: delete the staff account if auth user creation fails
          await db.delete(resUsers).where(eq(resUsers.id, created.id))
          return NextResponse.json({ success: false, error: `Failed to create auth user: ${authError.message}` }, { status: 400 })
        }

        // Mark staff as active since they have login credentials
        await db.update(resUsers)
          .set({ active: true })
          .where(eq(resUsers.id, created.id))
      }

      results.push(created ?? { ...staffData })
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
    if (!id) return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 })

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
