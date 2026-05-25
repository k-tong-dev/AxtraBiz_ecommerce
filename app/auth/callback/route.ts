import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/server'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/shop'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        await db.insert(users).values({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name ||
                data.user.user_metadata?.name ||
                data.user.email?.split('@')[0] || 'User',
          role: 'customer',
        }).onConflictDoUpdate({
          target: users.id,
          set: {
            email: data.user.email!,
            name: data.user.user_metadata?.full_name ||
                  data.user.user_metadata?.name ||
                  data.user.email?.split('@')[0] || 'User',
          },
        })
      } catch (profileError) {
        console.error('Profile creation error in callback:', profileError)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}

