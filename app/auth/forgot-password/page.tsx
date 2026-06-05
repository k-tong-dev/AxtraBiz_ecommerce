'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Schema } from 'rsuite'
import {
  Mail, ArrowLeft, CheckCircle2, Lock, RefreshCw, Quote, Sparkles, Star, Crown, ShoppingBag, Award, Shield, Globe, Zap, Send, KeyRound, Inbox, MousePointerClick,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
})

const trustedBrands = ['Stripe', 'Shopify', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'GitHub']

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const { email } = formRef.current.value
    if (!email?.trim()) return

    setSubmitting(true)
    const ok = await sendPasswordReset(email.trim())
    setSubmitting(false)

    if (ok) {
      setSentEmail(email)
      setIsSuccess(true)
      showToast('success', 'Email sent', 'Check your inbox.')
    } else {
      showToast('error', 'Failed', 'Could not send password reset email.')
    }
  }

  const steps = [
    { icon: Inbox, title: 'Check your inbox', desc: 'Reset link sent to your email.' },
    { icon: MousePointerClick, title: 'Click the link', desc: 'Opens a secure page to set a new password.' },
    { icon: RefreshCw, title: 'All set', desc: 'Sign in with your new password.' },
  ]

  const stats = [
    { value: '< 30s', label: 'Email delivery', icon: Send },
    { value: '256-bit', label: 'Encryption', icon: Lock },
    { value: '24h', label: 'Link expiry', icon: KeyRound },
    { value: '99.9%', label: 'Delivery rate', icon: Shield },
  ]

  if (isSuccess) {
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
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-sm text-muted-foreground">We sent a reset link to <span className="font-medium text-foreground">{sentEmail}</span></p>
          </div>
          <Button className="w-full h-11" appearance="primary" onClick={() => { setIsSuccess(false); formRef.current?.reset() }}>
            <Mail className="w-4 h-4 mr-1.5" />
            Resend email
          </Button>
          <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-yellow-400/15 to-rose-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">AxtraBiz</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wider">PRO</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Password recovery
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
              No worries,{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
                we&apos;ve got you
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Enter your email and we&apos;ll send you a secure link to reset your password. Quick and painless.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-amber-500/40 hover:bg-card/80 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                <s.icon className="h-4 w-4 text-amber-500/70 mb-2 group-hover:text-amber-500 transition-colors" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {steps.map((s, i) => (
              <div key={s.title} className="group flex items-start gap-3 rounded-xl p-2.5 -mx-2.5 transition-all duration-500 hover:bg-card/40">
                <div className="shrink-0 relative">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
                    {i + 1}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-1">
                  <s.icon className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground/80">{s.desc}</p>
                  </div>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-amber-500/[0.04] via-card/40 to-rose-500/[0.04] backdrop-blur p-5 overflow-hidden">
            <Quote className="h-12 w-12 text-amber-500/10 absolute -top-2 -right-2" />
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-semibold text-amber-600 ml-1.5">5.0</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic">&ldquo;Their support team resolved my account issue in under 5 minutes. Exceptional service.&rdquo;</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white shadow-md">AL</div>
              <div>
                <p className="text-sm font-semibold">Alex Liu</p>
                <p className="text-[11px] text-muted-foreground">Store Owner</p>
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <KeyRound className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">AxtraBiz</span>
          </div>

          <div className="relative rounded-3xl border border-border/40 bg-card/80 p-7 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl overflow-hidden">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="mb-7 lg:hidden">
              <Link href="/auth/signin" className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary mb-3">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-sm text-muted-foreground">Enter your email for a reset link.</p>
            </div>

            <div className="hidden lg:block mb-7">
              <h2 className="text-2xl font-bold">Reset your password</h2>
              <p className="text-sm text-muted-foreground mt-1">We&apos;ll email you a secure link to reset it</p>
            </div>

            <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ email: '' }}>
              <FormField name="email" label="Email address" type="email" placeholder="you@example.com" />

              <Button type="submit" className="w-full h-11 mt-5 relative overflow-hidden group" appearance="primary" loading={submitting}>
                <span className="relative z-10 flex items-center">
                  {submitting ? 'Sending...' : 'Send reset link'}
                  <Send className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Form>

            <div className="hidden lg:flex mt-6 justify-center">
              <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
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
