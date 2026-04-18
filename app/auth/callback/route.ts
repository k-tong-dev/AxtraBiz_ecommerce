import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/shop'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Create user profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || 
                data.user.user_metadata?.name || 
                data.user.email?.split('@')[0] || 'User',
          role: 'customer'
        })

      if (profileError) {
        console.error('Profile creation error in callback:', profileError)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}

