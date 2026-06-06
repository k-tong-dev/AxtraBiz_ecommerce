import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/server'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/website'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        const [existing] = await db.select({ id: resUsers.id })
          .from(resUsers)
          .where(eq(resUsers.authUserId, data.user.id))
          .limit(1)

        if (!existing) {
          const username = data.user.email?.split('@')[0] || 'user'
          await db.insert(resUsers).values({
            authUserId: data.user.id,
            username,
            email: data.user.email!,
            displayName: data.user.user_metadata?.full_name ||
                        data.user.user_metadata?.name ||
                        username,
            phone: data.user.user_metadata?.phone || null,
            country: data.user.user_metadata?.country || null,
            userRole: 'new',
          })
        }
      } catch (profileError) {
        console.error('Profile creation error in callback:', profileError)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
