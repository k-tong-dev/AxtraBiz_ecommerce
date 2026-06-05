import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the site URL from environment or use localhost fallback
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.VERCEL_URL || 
                   'http://localhost:3001'

    // Resend OTP for signup
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/website`
      }
    })

    if (error) {
      console.error('Resend OTP error:', error)
      return NextResponse.json(
        { message: error.message || 'Failed to resend verification code' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'Verification code sent successfully',
      success: true
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
