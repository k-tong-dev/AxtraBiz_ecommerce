import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { staff_accounts } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // 1. Check if email already exists as Supabase auth user
    // We do this by trying to create the user — Supabase will reject duplicates
    const supabase = await createClient()

    // 1b. Check if email already registered as a business owner
    const existingStaff = await db.select()
      .from(staff_accounts)
      .where(eq(staff_accounts.email, email))
      .limit(1)

    if (existingStaff.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 },
      )
    }

    // 2. Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, full_name: name },
        emailRedirectTo: `${request.headers.get('origin') || ''}/login`,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // 3. Create staff_account as shop owner (no shop_id yet — will be set after shop creation)
    const [staff] = await db.insert(staff_accounts)
      .values({
        email,
        full_name: name,
        is_owner: true,
        status: 'active',
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        email: staff.email,
        name: staff.full_name,
        needsVerification: !authData.user.email_confirmed_at,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Registration failed',
    }, { status: 500 })
  }
}
