import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId, createUser } from '@/lib/drizzle/queries/users'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user already has a profile
    const existing = await getUserByAuthId(user.id)
    if (existing) {
      return NextResponse.json({ success: true, user: existing })
    }

    const username = user.email?.split('@')[0] || 'user'
    console.log('[complete-signup] user_metadata:', user.user_metadata)

    const created = await createUser({
      authUserId: user.id,
      username,
      email: user.email!,
      displayName: user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  username,
      phone: user.user_metadata?.phone || null,
      country: user.user_metadata?.country || null,
      userRole: 'new',
      createdBy: user.id,
      updatedBy: user.id,
    })

    return NextResponse.json({ success: true, user: created })
  } catch (e) {
    console.error('[complete-signup] Error:', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
