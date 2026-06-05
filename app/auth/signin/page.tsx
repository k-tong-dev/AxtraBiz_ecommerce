'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import {
  Mail, Lock, ArrowRight, Eye, EyeOff, ChevronRight, Settings, Star, Shield, Sparkles, Sword, Trophy,
} from 'lucide-react'
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
  const [rememberMe, setRememberMe] = useState(true)

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-400/15 to-orange-400/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Minimal left side */}
        <div className="hidden lg:flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05]">
              Run your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                commerce empire
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              One dashboard. Every store. Real-time insights.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC 2</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" /> 12K+ stores</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5</span>
          </div>
        </div>

        {/* Game-style auth card */}
        <div className="w-full max-w-md mx-auto">
          {/* Card stack shadow */}
          <div className="relative">
            <div className="absolute -bottom-3 left-6 right-6 h-3 rounded-3xl bg-gradient-to-b from-blue-500/20 to-transparent blur-xl" />
            <div className="absolute -bottom-1.5 left-12 right-12 h-1.5 rounded-3xl bg-gradient-to-b from-blue-500/30 to-purple-500/20" />

            <div className="relative rounded-3xl border border-border/40 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4].map(i => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <Star className="h-3 w-3 text-amber-400/40" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider">LVL 99</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/70 tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </div>
              </div>

              {/* Progress meter */}
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider uppercase">Authentication</span>
                  <span className="text-[10px] font-bold text-primary">100%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-6 space-y-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                  <p className="text-sm text-muted-foreground mt-1">Sign in to continue your journey</p>
                </div>

                <Button
                  className="w-full h-11 group"
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
                      Quick play with Google
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase">
                    <span className="bg-card px-3 text-muted-foreground/50 tracking-widest">or sign in</span>
                  </div>
                </div>

                <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ email: '', password: '' }}>
                  <div className="space-y-3.5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <FormField name="email" type="email" placeholder="your@email.com" />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <div className="relative">
                        <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="Your password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1 z-10" tabIndex={-1}>
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                      />
                      <span className="text-muted-foreground/80">Remember me</span>
                    </label>
                    <Link href="/auth/forgot-password" className="text-muted-foreground/70 hover:text-primary transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-5 relative overflow-hidden group"
                    appearance="primary"
                    loading={submitting}
                  >
                    <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                      <Sword className="w-4 h-4 mr-2 -ml-1" />
                      {submitting ? 'Entering...' : 'Sign in to battle'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Form>
              </div>

              {/* Card footer */}
              <div className="px-6 py-4 border-t border-border/30 bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/70">
                  New here?{' '}
                  <Link href="/business-register" className="font-bold text-primary hover:underline">
                    Create account
                  </Link>
                </p>
                <Settings className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
