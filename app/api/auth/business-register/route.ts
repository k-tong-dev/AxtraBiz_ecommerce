import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { db } from '@/lib/drizzle/client'
import { staff_accounts } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if email already registered as a business owner
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

    const supabase = await createClient()

    // Try to create Supabase auth user
    // If the user already exists (from customer signup), that's OK
    let authUser = null
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: password || crypto.randomUUID(),
      options: {
        data: { name, full_name: name },
        emailRedirectTo: `${request.headers.get('origin') || ''}/login`,
      },
    })

    if (signUpError && signUpError.message?.includes('already registered')) {
      // User already has a Supabase auth account (e.g. from customer signup)
      // That's fine — we just create the staff_account entry
      console.log('[business-register] auth user already exists for', email)
    } else if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    } else {
      authUser = signUpData.user
    }

    // Create staff_account as shop owner
    const [staff] = await db.insert(staff_accounts)
      .values({
        email,
        full_name: name,
        is_owner: true,
        status: 'active',
        create_uid: email,
        write_uid: email,
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        email: staff.email,
        name: staff.full_name,
        needsVerification: authUser ? !authUser.email_confirmed_at : false,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Registration failed',
    }, { status: 500 })
  }
}
