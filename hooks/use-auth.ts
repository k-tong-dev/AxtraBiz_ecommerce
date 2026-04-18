'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/types'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    let mounted = true

    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      const authUser = data.user
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          name:
            (authUser.user_metadata?.full_name as string | undefined) ??
            (authUser.user_metadata?.name as string | undefined) ??
            authUser.email?.split('@')[0] ??
            'User',
          role: 'customer',
          createdAt: authUser.created_at ?? new Date().toISOString(),
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      const authUser = session?.user
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          name:
            (authUser.user_metadata?.full_name as string | undefined) ??
            (authUser.user_metadata?.name as string | undefined) ??
            authUser.email?.split('@')[0] ??
            'User',
          role: 'customer',
          createdAt: authUser.created_at ?? new Date().toISOString(),
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
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
    setUser(null)
  }

  const signup = async (name: string, email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/shop`,
      },
    })
    if (error) return null
    
    // Return user info for successful signup (even if confirmation required)
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
        redirectTo: `${window.location.origin}/auth/callback?next=/shop`,
      },
    })
    return !error
  }

  const sendPasswordReset = async (email: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/shop/reset-password`,
    })
    return !error
  }

  const updatePassword = async (password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    return !error
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    signup,
    loginWithGoogle,
    sendPasswordReset,
    updatePassword,
  }
}
