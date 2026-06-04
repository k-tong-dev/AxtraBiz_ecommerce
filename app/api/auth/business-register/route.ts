import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { resUsers, resShops, m2mUsersShops } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if email already registered
    const existingUser = await db.select()
      .from(resUsers)
      .where(eq(resUsers.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 },
      )
    }

    const supabase = await createClient()

    // Try to create Supabase auth user
    let authUser = null
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: password || crypto.randomUUID(),
      options: {
        data: { name, full_name: name },
        emailRedirectTo: `${request.headers.get('origin') || ''}/auth/signin`,
      },
    })

    if (signUpError && signUpError.message?.includes('already registered')) {
      console.log('[business-register] auth user already exists for', email)
    } else if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    } else {
      authUser = signUpData.user
    }

    // Get authUserId from session if not returned by signUp
    let authUserId = authUser?.id
    if (!authUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      authUserId = user?.id
    }

    // Create the shop
    const slug = (name || email.split('@')[0])
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const [shop] = await db.insert(resShops)
      .values({
        name: name || email.split('@')[0],
        slug,
        email,
      })
      .returning()

    // Create resUsers entry as business owner
    const username = email.split('@')[0]
    if (!authUserId) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
    const [resUser] = await db.insert(resUsers)
      .values({
        authUserId,
        username,
        email,
        displayName: name,
        userRole: 'business',
        isShopOwner: true,
        shopId: shop.id,
      })
      .returning()

    // Link user to shop in m2m
    await db.insert(m2mUsersShops)
      .values({
        userId: resUser.id,
        shopId: shop.id,
        isDefault: true,
      })
      .onConflictDoNothing()

    return NextResponse.json({
      success: true,
      data: {
        id: resUser.id,
        email: resUser.email,
        name: resUser.displayName,
        shopId: shop.id,
        needsVerification: authUser ? !authUser.email_confirmed_at : false,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Registration failed',
    }, { status: 500 })
  }
}
