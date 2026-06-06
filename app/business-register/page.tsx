'use client'

import { useState, useRef } from 'react'
import { Schema } from 'rsuite'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Check, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import Link from 'next/link'

const model = Schema.Model({
  name: Schema.Types.StringType().isRequired('Name is required'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
})

export default function RegisterPage() {
  const formRef = useRef<any>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/auth/business-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  if (step === 'success') {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-cyan-950/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/30 to-cyan-300/20 blur-3xl orb-1" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-300/25 to-sky-200/20 blur-3xl orb-2" />
        </div>
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl" />
            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl text-center space-y-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Account created</h2>
                <p className="text-sm text-muted-foreground/80 mt-2">Let&apos;s set up your first shop.</p>
              </div>
              <Button className="w-full h-11 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/25 transition-all duration-300" appearance="primary" onClick={() => { window.location.href = '/auth/setup' }}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue to setup
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Link href="/auth/signin" className="block text-xs text-muted-foreground/70 hover:text-primary transition-colors">Sign in instead</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50/70 via-white to-rose-50/50 dark:from-violet-950/40 dark:via-slate-950 dark:to-rose-950/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(244,63,94,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-300/30 to-rose-300/20 blur-3xl orb-1" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-300/25 to-pink-200/20 blur-3xl orb-2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/25 transition-transform group-hover:scale-105">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/60 dark:border-violet-800/60 bg-violet-50/60 dark:bg-violet-950/40 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 backdrop-blur">
              <Zap className="h-3 w-3" />
              Open your shop in 60s
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Open your{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-600 bg-clip-text text-transparent">
                digital storefront
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              Start selling in minutes. No technical skills needed.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {['14-day free trial', 'No credit card required', 'Cancel anytime', '24/7 customer support'].map(item => (
              <li key={item} className="flex items-center gap-3 text-foreground/80">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <Check className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6 pt-2 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> SOC 2 Type II
            </span>
            <span>·</span>
            <span>PCI DSS Level 1</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl auth-card-enter">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-rose-600 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">AxtraBiz</span>
              </div>

              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Open shop</h2>
                <p className="text-sm text-muted-foreground/80 mt-1">Create your business account</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20 mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Form ref={formRef} model={model} onChange={(v: any) => setFormData(v)} onSubmit={onSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
                <div className="space-y-3.5 auth-page-form min-w-95">
                  <FormField name="name" placeholder="Owner name" variant="bordered" icon={<User className="h-4 w-4" />} />

                  <FormField name="email" type="email" placeholder="Email address" variant="bordered" icon={<Mail className="h-4 w-4" />} />

                  <FormField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 8 chars)"
                    variant="bordered"
                    icon={<Lock className="h-4 w-4" />}
                    trailing={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground/60 hover:text-foreground transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </div>

                <Button type="submit" className="w-full h-11 mt-5 bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 shadow-lg shadow-violet-500/25 transition-all duration-300" appearance="primary" loading={submitting}>
                  {submitting ? 'Creating account...' : 'Open shop'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
