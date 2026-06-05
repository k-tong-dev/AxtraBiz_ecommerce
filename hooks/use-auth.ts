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

  const signup = async (name: string, email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/website`,
      },
    })
    if (error) return null

    if (data.user) {
      return {
        id: data.user.id,
        name,
        email,
        role: 'customer' as const,
        createdAt: data.user.created_at ?? new Date().toISOString(),
        needsVerification: !data.user.email_confirmed_at,
      }
    }

    return null
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
      redirectTo: `${window.location.origin}/website/reset-password`,
    })
    return !error
  }

  const updatePassword = async (password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    return !error
  }

  return {
    user: sharedUser,
    isLoading: sharedLoading,
    isAuthenticated: !!sharedUser,
    isAdmin: sharedUser?.role === 'admin',
    login,
    logout,
    signup,
    loginWithGoogle,
    sendPasswordReset,
    updatePassword,
  }
}
