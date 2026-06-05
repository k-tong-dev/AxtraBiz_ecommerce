'use client'

import { useState, useRef } from 'react'
import { Schema } from 'rsuite'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import Link from 'next/link'
import {
  Store, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Globe, TrendingUp, Users, Quote, Sparkles, Star, Crown, ShoppingBag, Award, Lock, Shield, Zap, BarChart3, Rocket, Heart,
} from 'lucide-react'

const model = Schema.Model({
  name: Schema.Types.StringType().isRequired('Name is required'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
})

const trustedBrands = ['Stripe', 'Shopify', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'GitHub']

export default function RegisterPage() {
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/auth/business-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setSubmitting(false)
        return
      }
      setStep('success')
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  const stats = [
    { value: '12K+', label: 'Active stores', icon: Store },
    { value: '$2B+', label: 'GMV processed', icon: TrendingUp },
    { value: '180+', label: 'Countries', icon: Globe },
    { value: '4.9★', label: 'User rating', icon: Star },
  ]

  const benefits = [
    { icon: Rocket, title: 'Launch fast', desc: 'Go live in 5 minutes, not 5 months.' },
    { icon: Globe, title: 'Sell worldwide', desc: 'Multi-currency & multi-language built in.' },
    { icon: BarChart3, title: 'Grow with data', desc: 'Real-time analytics & actionable insights.' },
    { icon: Users, title: 'Team ready', desc: 'Role-based permissions & collaboration.' },
  ]

  if (step === 'success') {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50/40 dark:from-emerald-950 dark:via-slate-900 dark:to-cyan-950/40 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/40 bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Account created!</h1>
          <p className="text-sm text-muted-foreground">Your business account is ready. Let&apos;s set up your first shop.</p>
          <Button className="w-full h-11" appearance="primary" onClick={() => { window.location.href = '/auth/setup' }}>
            Create your shop
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/auth/signin" className="block text-xs text-muted-foreground/70 hover:text-primary transition-colors">Sign in instead</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50/40 dark:from-violet-950/40 dark:via-slate-900 dark:to-rose-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-rose-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-fuchsia-400/15 to-pink-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-br from-purple-400/15 to-indigo-500/15 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">AxtraBiz</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wider">PRO</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Free 14-day trial
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
              Launch your{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-600 bg-clip-text text-transparent">
                e-commerce empire
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Everything you need to start selling online — beautiful storefronts, payments, analytics, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-violet-500/40 hover:bg-card/80 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                <s.icon className="h-4 w-4 text-violet-500/70 mb-2 group-hover:text-violet-500 transition-colors" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b.title} className="group rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-violet-500/40 hover:bg-card/80 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 p-2.5 w-fit mb-3 ring-1 ring-violet-500/10 group-hover:ring-violet-500/30 transition-all">
                  <b.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-violet-500/[0.04] via-card/40 to-rose-500/[0.04] backdrop-blur p-5 overflow-hidden">
            <Quote className="h-12 w-12 text-violet-500/10 absolute -top-2 -right-2" />
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-semibold text-amber-600 ml-1.5">5.0</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic">&ldquo;AxtraBiz helped us scale from a single shop to 5 locations in under 6 months. Absolute game changer.&rdquo;</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white shadow-md">ER</div>
              <div>
                <p className="text-sm font-semibold">Elena Rodriguez</p>
                <p className="text-[11px] text-muted-foreground">Founder, Bella Home</p>
              </div>
              <Crown className="h-4 w-4 text-amber-500 ml-auto" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur py-3">
            <p className="text-[10px] font-semibold text-muted-foreground/70 tracking-widest uppercase text-center mb-2">Trusted by industry leaders</p>
            <div className="flex overflow-hidden">
              <div className="flex gap-8 animate-marquee whitespace-nowrap px-4">
                {[...trustedBrands, ...trustedBrands].map((b, i) => (
                  <span key={`${b}-${i}`} className="text-sm font-bold text-muted-foreground/60 hover:text-foreground/90 transition-colors cursor-default tracking-wide">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:ml-auto">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">AxtraBiz</span>
          </div>

          <div className="relative rounded-3xl border border-border/40 bg-card/80 p-7 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl overflow-hidden">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Register your business</h1>
              <p className="text-sm text-muted-foreground">Create an account to start selling online</p>
            </div>

            <div className="hidden lg:block mb-7">
              <h2 className="text-2xl font-bold">Create your business account</h2>
              <p className="text-sm text-muted-foreground mt-1">Free 14-day trial, no credit card required</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive mb-4 ring-1 ring-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
              <FormField name="name" label="Full name" placeholder="John Doe" />
              <FormField name="email" label="Email address" type="email" placeholder="you@example.com" />

              <div>
                <FormField name="password" label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="mt-1 text-xs text-muted-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>

              <Button type="submit" className="w-full h-11 mt-5 relative overflow-hidden group" appearance="primary" loading={submitting}>
                <span className="relative z-10 flex items-center">
                  {submitting ? 'Creating...' : 'Create business account'}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Form>

            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SOC 2 Type II</span>
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><Award className="h-3 w-3" /> GDPR ready</span>
          </div>
        </div>
      </div>

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
