import { NextResponse } from 'next/server'
import { createClient } from '@/lib/utils/supabase-server'
import { checkCreateUserIfNotExit } from '@/lib/drizzle/queries/users'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { user: profile, created } = await checkCreateUserIfNotExit(user.email!, user.user_metadata)
    console.log('[complete-signup] profile:', created ? 'created' : 'existing', profile.id)

    return NextResponse.json({ success: true, user: profile })
  } catch (e) {
    console.error('[complete-signup] Error:', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
