import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { message: 'Email and verification token are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify OTP token with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    })

    if (error) {
      console.error('OTP verification error:', error)
      return NextResponse.json(
        { message: error.message || 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { message: 'Verification failed - no session created' },
        { status: 400 }
      )
    }

    // Create user profile in our users table
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
      console.error('Profile creation error:', profileError)
      // Don't fail the request if profile creation fails, just log it
    }

    // Set the session cookie
    const cookieStore = await cookies()
    const { access_token, refresh_token } = data.session
    
    cookieStore.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    cookieStore.set('sb-refresh-token', refresh_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({ 
      message: 'Email verified successfully',
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || 
              data.user.user_metadata?.name || 
              data.user.email?.split('@')[0] || 'User'
      }
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
