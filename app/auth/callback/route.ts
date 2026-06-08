import { NextResponse } from 'next/server'
import { createClient } from '@/lib/utils/supabase-server'
import { checkCreateUserIfNotExit } from '@/lib/drizzle/queries/users'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/website'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        const { created } = await checkCreateUserIfNotExit(data.user.email!, data.user.user_metadata)
        if (created) console.log('[callback] profile created for:', data.user.email)
      } catch (profileError) {
        console.error('Profile creation error in callback:', profileError)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
