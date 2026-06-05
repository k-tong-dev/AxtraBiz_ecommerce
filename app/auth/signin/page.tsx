'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import {
  Store, ArrowRight, Eye, EyeOff, Shield, Zap, Globe, Quote, Sparkles, Award, TrendingUp, Star,
  ShoppingBag, BarChart3, CheckCircle2, Lock, Users, Heart, Crown,
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

const trustedBrands = ['Stripe', 'Shopify', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'GitHub']

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

  const stats = [
    { value: '12K+', label: 'Active stores', icon: Store },
    { value: '180+', label: 'Countries', icon: Globe },
    { value: '99.9%', label: 'Uptime SLA', icon: Shield },
    { value: '4.9★', label: 'User rating', icon: Star },
  ]

  const features = [
    { icon: Zap, title: 'Lightning fast', desc: 'Sub-second page loads globally with edge network.' },
    { icon: Lock, title: 'Bank-grade security', desc: 'SOC 2 compliant with end-to-end encryption.' },
    { icon: BarChart3, title: 'Real-time analytics', desc: 'Track performance with live dashboards.' },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40">
      {/* Layered animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-400/15 to-orange-400/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-500/15 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual panel */}
        <div className="hidden lg:flex flex-col gap-8 max-w-xl">
          {/* Brand wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">AxtraBiz</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wider">
              PRO
            </span>
          </div>

          {/* Hero */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 12,000+ businesses
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                your empire
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Manage your stores, track orders, analyze performance, and scale your business — all from one beautiful dashboard.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <s.icon className="h-4 w-4 text-primary/70 mb-2 group-hover:text-primary transition-colors" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group flex items-start gap-3 rounded-xl p-2.5 -mx-2.5 transition-all duration-500 hover:bg-card/40"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="shrink-0 rounded-lg bg-gradient-to-br from-blue-500/15 to-indigo-500/15 p-2 ring-1 ring-blue-500/10 group-hover:ring-blue-500/30 transition-all">
                  <f.icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground/80">{f.desc}</p>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-blue-500/[0.04] via-card/40 to-purple-500/[0.04] backdrop-blur p-5 overflow-hidden">
            <Quote className="h-12 w-12 text-blue-500/10 absolute -top-2 -right-2" />
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-semibold text-amber-600 ml-1.5">5.0</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic">
              &ldquo;AxtraBiz transformed how we manage our 12 stores across 5 countries. The analytics alone saved us 20 hours a week.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                SK
              </div>
              <div>
                <p className="text-sm font-semibold">Sarah Kim</p>
                <p className="text-[11px] text-muted-foreground">CEO, Modern Retail Co.</p>
              </div>
              <Crown className="h-4 w-4 text-amber-500 ml-auto" />
            </div>
          </div>

          {/* Trust marquee */}
          <div className="relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur py-3">
            <p className="text-[10px] font-semibold text-muted-foreground/70 tracking-widest uppercase text-center mb-2">
              Trusted by industry leaders
            </p>
            <div className="flex overflow-hidden">
              <div className="flex gap-8 animate-marquee whitespace-nowrap px-4">
                {[...trustedBrands, ...trustedBrands].map((b, i) => (
                  <span
                    key={`${b}-${i}`}
                    className="text-sm font-bold text-muted-foreground/60 hover:text-foreground/90 transition-colors cursor-default tracking-wide"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md mx-auto lg:ml-auto">
          {/* Mobile-only brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">AxtraBiz</span>
          </div>

          <div className="relative rounded-3xl border border-border/40 bg-card/80 p-7 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-7">
              <h2 className="text-2xl font-bold">Sign in to your account</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
            </div>

            <div className="space-y-4">
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
                    <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
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
                  className="w-full h-11 mt-5 relative overflow-hidden group"
                  appearance="primary"
                  loading={submitting}
                >
                  <span className="relative z-10 flex items-center">
                    {submitting ? 'Signing in...' : 'Sign in'}
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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

          {/* Security badges under form */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SOC 2 Type II</span>
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><Award className="h-3 w-3" /> GDPR ready</span>
          </div>
        </div>
      </div>

      {/* Tailwind animation for marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
