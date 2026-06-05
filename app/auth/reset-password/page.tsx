'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Schema } from 'rsuite'
import {
  Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, ShieldCheck, RefreshCw, Quote, Sparkles, Star, Crown, ShoppingBag, Award, Shield, Globe, Zap, Eye, EyeOff,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(6, 'At least 6 characters'),
  confirmPassword: Schema.Types.StringType()
    .isRequired('Please confirm your password')
    .addRule((value: string, data: any) => value === data.password, 'Passwords do not match'),
})

const trustedBrands = ['Stripe', 'Shopify', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'GitHub']

export default function ResetPasswordPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, updatePassword } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      if (!window.location.hash.includes('type=recovery')) {
        setTokenError(true)
      }
    }
  }, [authLoading, user])

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const { password } = formRef.current.value
    setSubmitting(true)
    const ok = await updatePassword(password)
    setSubmitting(false)

    if (ok) {
      setIsDone(true)
      showToast('success', 'Password updated', 'Redirecting to sign in...')
      setTimeout(() => router.push('/auth/signin'), 1500)
    } else {
      showToast('error', 'Failed', 'Could not update password. The link may have expired.')
    }
  }

  const guidelines = [
    { icon: KeyRound, text: 'At least 6 characters long' },
    { icon: ShieldCheck, text: 'Mix of letters and numbers recommended' },
    { icon: RefreshCw, text: 'Avoid reusing passwords from other sites' },
  ]

  const stats = [
    { value: '256-bit', label: 'Encryption', icon: Lock },
    { value: 'SOC 2', label: 'Compliant', icon: ShieldCheck },
    { value: '2FA', label: 'Available', icon: Shield },
    { value: '24/7', label: 'Support', icon: Globe },
  ]

  if (tokenError) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50/40 dark:from-rose-950/40 dark:via-slate-900 dark:to-red-950/40 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-rose-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-red-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/40 bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-rose-400/30 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">This reset link is no longer valid. Request a new one.</p>
          <Link href="/auth/forgot-password">
            <Button className="w-full h-11" appearance="primary">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isDone) {
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
          <h1 className="text-xl font-bold">Password updated</h1>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-green-400/15 to-cyan-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">AxtraBiz</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wider">PRO</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Secure password reset
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
              Choose a{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                strong password
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Make it unique and memorable to keep your account secure from threats.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur p-4 transition-all duration-500 hover:border-emerald-500/40 hover:bg-card/80 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
                <s.icon className="h-4 w-4 text-emerald-500/70 mb-2 group-hover:text-emerald-500 transition-colors" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {guidelines.map((g) => (
              <div key={g.text} className="group flex items-start gap-3 rounded-xl p-2.5 -mx-2.5 transition-all duration-500 hover:bg-card/40">
                <div className="shrink-0 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 p-2 ring-1 ring-emerald-500/10 group-hover:ring-emerald-500/30 transition-all">
                  <g.icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center min-h-[36px]">
                  <p className="text-sm">{g.text}</p>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-emerald-500/[0.04] via-card/40 to-cyan-500/[0.04] backdrop-blur p-5 overflow-hidden">
            <Quote className="h-12 w-12 text-emerald-500/10 absolute -top-2 -right-2" />
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-semibold text-amber-600 ml-1.5">5.0</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic">&ldquo;Bank-grade security that just works. I trust AxtraBiz with my business data.&rdquo;</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shadow-md">DM</div>
              <div>
                <p className="text-sm font-semibold">David Martinez</p>
                <p className="text-[11px] text-muted-foreground">CTO, TechCommerce</p>
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">AxtraBiz</span>
          </div>

          <div className="relative rounded-3xl border border-border/40 bg-card/80 p-7 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl overflow-hidden">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Reset password</h1>
              <p className="text-sm text-muted-foreground">Enter your new password below</p>
            </div>

            <div className="hidden lg:block mb-7">
              <h2 className="text-2xl font-bold">Create new password</h2>
              <p className="text-sm text-muted-foreground mt-1">Make it strong and secure</p>
            </div>

            {authLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ password: '', confirmPassword: '' }}>
                <div className="relative">
                  <FormField name="password" label="New password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-9 text-muted-foreground/50 hover:text-foreground transition-colors p-1" tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <FormField name="confirmPassword" label="Confirm password" type="password" placeholder="Re-enter your password" />

                <Button type="submit" className="w-full h-11 mt-5 relative overflow-hidden group" appearance="primary" loading={submitting}>
                  <span className="relative z-10 flex items-center">
                    {submitting ? 'Updating...' : 'Update password'}
                    <CheckCircle2 className="w-4 h-4 ml-1.5 transition-transform group-hover:scale-110" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Form>
            )}
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
