'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/types'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

function mapUser(authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown>; created_at?: string | null }): User {
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name:
      (authUser.user_metadata?.full_name as string | undefined) ??
      (authUser.user_metadata?.name as string | undefined) ??
      authUser.email?.split('@')[0] ??
      'User',
    role: 'customer',
    createdAt: authUser.created_at ?? new Date().toISOString(),
  }
}

let sharedUser: User | null = null
let sharedLoading = true
let sharedInitialized = false
const sharedListeners = new Set<() => void>()

function notifyListeners() {
  for (const fn of sharedListeners) fn()
}

function initSharedAuth() {
  if (sharedInitialized) return
  sharedInitialized = true

  const supabase = createClient()

  supabase.auth.getUser().then(({ data } : { data : any}) => {
    sharedUser = data.user ? mapUser(data.user) : null
    sharedLoading = false
    notifyListeners()
  }).catch(() => {
    sharedUser = null
    sharedLoading = false
    notifyListeners()
  })

  supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    sharedUser = session?.user ? mapUser(session.user) : null
    sharedLoading = false
    notifyListeners()
  })
}

export function useAuth() {
  const [, forceRender] = useState(0)

  useEffect(() => {
    initSharedAuth()
    const listener = () => forceRender(n => n + 1)
    sharedListeners.add(listener)
    if (sharedInitialized && !sharedLoading) {
      forceRender(n => n + 1)
    }
    return () => {
      sharedListeners.delete(listener)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const signup = async (name: string, email: string, password: string, phone?: string, country?: string) => {
    const supabase = createClient()

    // Check if email already exists in our system
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const { exists } = await res.json()
      if (exists) {
        return { success: false, error: 'Email already registered' } as const
      }
    } catch {
      // fall through — Supabase check is the fallback
    }

    console.log('[signup] Sending confirmation email →', {
      email,
      name,
      phone,
      country,
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    })
    const { data, error } = await supabase.auth.signUp({
      phone,
      email,
      password,
      options: {
        data: { name, full_name: name, phone, country },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    console.log('[signup] Supabase response:', {
      userId: data.user?.id,
      identities: data.user?.identities?.length ?? 0,
      hasSession: !!data.session,
      needsVerification: !data.session,
      error: error?.message ?? null,
    })

    if (error) {
      // Detect "already registered" even if our DB check missed it (race / config)
      if (error.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'Email already registered' } as const
      }
      return { success: false, error: error.message } as const
    }

    if (data.user) {
      // Newly created users always have >=1 identity in the identities array.
      // Empty identities means Supabase touched an existing user but didn't create one.
      const isNewUser = (data.user.identities?.length ?? 0) > 0

      if (!isNewUser) {
        console.log('[signup] Existing auth user detected (identities empty) — rejecting')
        return { success: false, error: 'Email already registered' } as const
      }

      return {
        success: true as const,
        id: data.user.id,
        name,
        email,
        role: 'customer' as const,
        createdAt: data.user.created_at ?? new Date().toISOString(),
        needsVerification: !data.session,
      }
    }

    return { success: false, error: 'Signup failed' } as const
  }

  const verifyOtp = async (email: string, token: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })
    return { success: !error, error: error?.message }
  }

  const resendOtp = async (email: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    return { success: !error, error: error?.message }
  }

  const loginWithGoogle = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/website`,
      },
    })
    return !error
  }

  const sendPasswordReset = async (email: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return !error
  }

  const updatePassword = async (password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    return !error
  }

  const clearAuth = () => {
    sharedUser = null
    sharedLoading = false
    notifyListeners()
  }

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.deleted || !data.authenticated) {
        clearAuth()
        return { authenticated: false, deleted: data.deleted }
      }
      return { authenticated: true, user: data.user }
    } catch {
      clearAuth()
      return { authenticated: false, deleted: false }
    }
  }

  return {
    user: sharedUser,
    isLoading: sharedLoading,
    isAuthenticated: !!sharedUser,
    isAdmin: sharedUser?.role === 'admin',
    login,
    logout,
    signup,
    verifyOtp,
    resendOtp,
    loginWithGoogle,
    sendPasswordReset,
    updatePassword,
    clearAuth,
    checkAuth,
  }
}
