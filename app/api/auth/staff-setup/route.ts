import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { db } from '@/lib/drizzle/client'
import { staff_accounts } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check staff account exists and is invited/active
    const [staff] = await db.select().from(staff_accounts)
      .where(eq(staff_accounts.email, email))
      .limit(1)

    if (!staff) {
      return NextResponse.json({ error: 'Staff account not found' }, { status: 404 })
    }

    if (staff.status === 'disabled') {
      return NextResponse.json({ error: 'Staff account is disabled' }, { status: 403 })
    }

    // Create Supabase auth user with service role (bypasses email verification)
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: staff.full_name,
        full_name: staff.full_name,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({
          error: 'A user with this email already exists. They may already have an account.',
        }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update staff account status to active
    await db.update(staff_accounts)
      .set({ status: 'active' })
      .where(eq(staff_accounts.id, staff.id))

    return NextResponse.json({
      success: true,
      data: {
        email,
        userId: data.user?.id,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create staff user',
    }, { status: 500 })
  }
}
