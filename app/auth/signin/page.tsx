'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Store, ArrowRight, Eye, EyeOff, Shield, Zap, Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect') || ''
  const { user, isLoading: authLoading, login, loginWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(me => {
          window.location.href = redirectParam || me.redirect || '/dashboard'
        })
        .catch(() => {
          window.location.href = redirectParam || '/dashboard'
        })
    }
  }, [authLoading, user, redirectParam])

  const handleSubmit = async () => {
    if (!email.trim() || !password) return

    setIsLoading(true)
    const success = await login(email, password)

    if (success) {
      showToast('success', 'Signed in', 'Welcome back.')
      await new Promise(r => setTimeout(r, 500))
      try {
        const meRes = await fetch('/api/auth/me')
        const me = await meRes.json()
        window.location.href = me.authenticated ? (redirectParam || me.redirect || '/dashboard') : '/dashboard'
      } catch {
        window.location.href = redirectParam || '/dashboard'
      }
    } else {
      showToast('error', 'Sign-in failed', 'Invalid email or password.')
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) {
      showToast('error', 'Google sign-in failed', 'Please try again.')
      setGoogleLoading(false)
    }
  }

  const features = [
    { icon: Shield, title: 'Secure access', desc: 'Enterprise-grade authentication with role-based permissions.' },
    { icon: Zap, title: 'Multi-shop management', desc: 'Manage multiple stores from a single dashboard.' },
    { icon: Globe, title: 'Global payments', desc: 'Accept payments in multiple currencies worldwide.' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-5xl gap-8 xl:gap-12 items-center">
        {/* Left — Features panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Store className="h-3.5 w-3.5" />
              AxtraBiz Dashboard
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to manage your stores, track orders, and grow your business.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sign-in card */}
        <div className="w-full lg:w-[55%]">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            <div className="space-y-5">
              <Button
                className="w-full"
                appearance="default"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  'Connecting...'
                ) : (
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
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or sign in with email</span>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  fullWidth
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      fullWidth
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  appearance="primary"
                  loading={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/business-register" className="font-medium text-primary hover:underline">
                Register your business
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
