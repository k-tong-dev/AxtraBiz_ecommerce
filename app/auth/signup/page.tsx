'use client'

import { Suspense, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Schema } from 'rsuite'
import {
  ArrowRight, UserPlus, Store, BarChart3, ShieldCheck, Quote, Sparkles, Star, Crown, ShoppingBag, Award, Lock, Globe, Zap, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

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

function SignupPageContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/website'
  const { signup, loginWithGoogle } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const created = await signup(values.name, values.email, values.password)
    setSubmitting(false)

    if (!created) {
      showToast('error', 'Could not create account', 'Please try again.')
      return
    }
    showToast('success', 'Check your email',
      created.needsVerification ? 'Verification code sent.' : 'Account created successfully.')
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) { showToast('error', 'Google sign-up failed', 'Please try again.') }
    setGoogleLoading(false)
  }

  const stats = [
    { value: '12K+', label: 'Active stores', icon: Store },
    { value: '180+', label: 'Countries', icon: Globe },
    { value: '99.9%', label: 'Uptime SLA', icon: ShieldCheck },
    { value: '4.9★', label: 'User rating', icon: Star },
  ]

  const perks = [
    { icon: Zap, title: 'Lightning setup', desc: 'Launch your store in under 5 minutes.' },
    { icon: BarChart3, title: 'Real-time analytics', desc: 'Track sales & growth live.' },
    { icon: Lock, title: 'Secure by default', desc: 'SOC 2 compliant & encrypted.' },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50/40 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-400/20 to-rose-500/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-br from-violet-400/15 to-fuchsia-500/15 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">AxtraBiz</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wider">PRO</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Join 12,000+ growing brands
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
              Start your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                e-commerce journey
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Create your account and launch your online store in minutes. No technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-indigo-500/40 hover:bg-card/80 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                <s.icon className="h-4 w-4 text-indigo-500/70 mb-2 group-hover:text-indigo-500 transition-colors" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {perks.map((p, i) => (
              <div key={p.title} className="group flex items-start gap-3 rounded-xl p-2.5 -mx-2.5 transition-all duration-500 hover:bg-card/40">
                <div className="shrink-0 rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 p-2 ring-1 ring-indigo-500/10 group-hover:ring-indigo-500/30 transition-all">
                  <p.icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground/80">{p.desc}</p>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-indigo-500/[0.04] via-card/40 to-pink-500/[0.04] backdrop-blur p-5 overflow-hidden">
            <Quote className="h-12 w-12 text-indigo-500/10 absolute -top-2 -right-2" />
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-semibold text-amber-600 ml-1.5">5.0</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic">&ldquo;We went from idea to first sale in under 48 hours. The setup process is incredibly smooth.&rdquo;</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white shadow-md">MJ</div>
              <div>
                <p className="text-sm font-semibold">Marcus Johnson</p>
                <p className="text-[11px] text-muted-foreground">Founder, Urban Threads</p>
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">AxtraBiz</span>
          </div>

          <div className="relative rounded-3xl border border-border/40 bg-card/80 p-7 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl overflow-hidden">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Join AxtraBiz</h1>
              <p className="text-sm text-muted-foreground">Create your account</p>
            </div>

            <div className="hidden lg:block mb-7">
              <h2 className="text-2xl font-bold">Create your account</h2>
              <p className="text-sm text-muted-foreground mt-1">Get started in less than 60 seconds</p>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-11" appearance="default" onClick={handleGoogleSignup} disabled={googleLoading || submitting}>
                {googleLoading ? 'Connecting...' : (
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
                  <span className="bg-card px-3 text-muted-foreground/60 tracking-wider">or sign up with email</span>
                </div>
              </div>

              <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
                <FormField name="name" label="Full name" placeholder="John Doe" />
                <FormField name="email" label="Email" type="email" placeholder="you@example.com" />
                <FormField name="password" label="Password" type="password" placeholder="Min. 8 characters" />

                <Button type="submit" className="w-full h-11 mt-5 relative overflow-hidden group" appearance="primary" loading={submitting}>
                  <span className="relative z-10 flex items-center">
                    {submitting ? 'Creating...' : 'Create account'}
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              Already have an account?{' '}
              <Link href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> SOC 2 Type II</span>
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-full max-w-md h-[540px] rounded-3xl border border-border/40 bg-card/70 animate-pulse" /></div>}>
      <SignupPageContent />
    </Suspense>
  )
}
