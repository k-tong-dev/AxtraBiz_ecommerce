'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Store, ArrowRight, Eye, EyeOff, Shield, Zap, Globe, Quote } from 'lucide-react'
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
    if (!values?.email || !values?.password) return

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

  const features = [
    { icon: Shield, title: 'Enterprise security', desc: 'Role-based access control & SSO.' },
    { icon: Zap, title: 'Multi-store hub', desc: 'Manage all your stores in one place.' },
    { icon: Globe, title: 'Global commerce', desc: 'Multi-currency & multi-language.' },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-4 lg:px-8 gap-8 xl:gap-16 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary tracking-wide uppercase">
              <Store className="h-3.5 w-3.5" />
              AxtraBiz Dashboard
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]">
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                your empire
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Sign in to manage your stores, track orders, analyze performance, and grow your business across the globe.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 p-2.5 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-primary/[0.03] to-blue-500/[0.03] p-5">
            <Quote className="h-6 w-6 text-primary/30 absolute top-3 right-3" />
            <p className="text-sm text-muted-foreground/90 italic leading-relaxed">
              &ldquo;AxtraBiz transformed how we manage our 12 stores across 5 countries. The analytics alone saved us 20 hours a week.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">SK</div>
              <div>
                <p className="text-xs font-medium">Sarah Kim</p>
                <p className="text-[10px] text-muted-foreground/70">CEO, Modern Retail Co.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] max-w-md mx-auto lg:mx-0">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl">
            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            <div className="space-y-5">
              <Button
                className="w-full h-11"
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
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground/60 tracking-wider">or email</span>
                </div>
              </div>

              <Form
                ref={formRef}
                model={model}
                onSubmit={handleSubmit}
                fluid
                formDefaultValue={{ email: '', password: '' }}
              >
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[11px] text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <FormField
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-muted-foreground/50 hover:text-foreground transition-colors p-1 z-10"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 mt-5"
                  appearance="primary"
                  loading={submitting}
                >
                  {submitting ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground/70">
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
