'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required'),
})

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect') || ''
  const { user, isLoading: authLoading, login, loginWithGoogle } = useAuth()
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(me => { window.location.href = redirectParam || me.redirect || '/dashboard' })
        .catch(() => { window.location.href = redirectParam || '/dashboard' })
    }
  }, [authLoading, user, redirectParam])

  const handleSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const success = await login(values.email, values.password)
    if (success) {
      showToast('success', 'Signed in', 'Welcome back.')
      await new Promise(r => setTimeout(r, 500))
      try {
        const me = await (await fetch('/api/auth/me')).json()
        window.location.href = me.authenticated
          ? (redirectParam || me.redirect || '/dashboard')
          : '/dashboard'
      } catch {
        window.location.href = redirectParam || '/dashboard'
      }
    } else {
      showToast('error', 'Sign-in failed', 'Invalid email or password.')
    }
    setSubmitting(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) { showToast('error', 'Google sign-in failed', 'Please try again.') }
    setGoogleLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
      {/* Soft background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300/30 to-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-violet-300/25 to-pink-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — minimal */}
        <div className="hidden lg:flex flex-col gap-8 max-w-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              The home for{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                modern commerce
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Manage your stores, track orders, and grow your business — all from one beautiful dashboard.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">★★★★★ <span className="text-foreground/80">4.9/5</span></span>
            <span>·</span>
            <span>12,000+ stores</span>
            <span>·</span>
            <span>180 countries</span>
          </div>
        </div>

        {/* Right — auth card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl shadow-black/[0.04] backdrop-blur-xl">
            <div className="lg:hidden mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold">AxtraBiz</span>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full h-11"
                appearance="default"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? 'Connecting...' : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or sign in with email</span>
                </div>
              </div>

              <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ email: '', password: '' }}>
                <div className="space-y-3.5">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <FormField name="email" type="email" placeholder="Email address" />
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 mt-5" appearance="primary" loading={submitting}>
                  {submitting ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/business-register" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
