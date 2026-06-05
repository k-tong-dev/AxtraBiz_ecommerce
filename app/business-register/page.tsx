'use client'

import { useState, useRef } from 'react'
import { Schema } from 'rsuite'
import {
  Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ChevronRight, Settings, Star, Shield, Sparkles, Sword, ShoppingBag,
} from 'lucide-react'
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

  if (step === 'success') {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50/40 dark:from-emerald-950 dark:via-slate-900 dark:to-cyan-950/40 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="relative">
            <div className="absolute -bottom-3 left-6 right-6 h-3 rounded-3xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl" />
            <div className="absolute -bottom-1.5 left-12 right-12 h-1.5 rounded-3xl bg-gradient-to-b from-emerald-500/30 to-cyan-500/20" />
            <div className="relative rounded-3xl border border-border/40 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-2xl overflow-hidden p-8 text-center space-y-5">
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 -m-8 mb-0" />
              <div className="flex justify-center pt-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold">Quest started!</h1>
              <p className="text-sm text-muted-foreground">Your business account is ready. Let&apos;s set up your first shop.</p>
              <Button className="w-full h-12 relative overflow-hidden group" appearance="primary" onClick={() => { window.location.href = '/auth/setup' }}>
                <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Build your shop
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Link href="/auth/signin" className="block text-xs text-muted-foreground/70 hover:text-primary transition-colors">Sign in instead</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50/40 dark:from-violet-950/40 dark:via-slate-900 dark:to-rose-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-rose-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-fuchsia-400/15 to-pink-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05]">
              Open your{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-600 bg-clip-text text-transparent">
                digital storefront
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Start selling in minutes. No technical skills needed.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC 2</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> 12K+ stores</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -bottom-3 left-6 right-6 h-3 rounded-3xl bg-gradient-to-b from-violet-500/20 to-transparent blur-xl" />
            <div className="absolute -bottom-1.5 left-12 right-12 h-1.5 rounded-3xl bg-gradient-to-b from-violet-500/30 to-rose-500/20" />

            <div className="relative rounded-3xl border border-border/40 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-600" />

              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-400/40" />
                    {[1, 2, 3, 4].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider">BUSINESS</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/70 tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NEW SHOP
                </div>
              </div>

              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider uppercase">Account creation</span>
                  <span className="text-[10px] font-bold text-primary">50%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Open shop</h2>
                  <p className="text-sm text-muted-foreground mt-1">Create your business account</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
                  <div className="space-y-3.5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <FormField name="name" placeholder="Owner name" />
                    </div>

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
                        <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1 z-10" tabIndex={-1}>
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 mt-5 relative overflow-hidden group" appearance="primary" loading={submitting}>
                    <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                      <Sword className="w-4 h-4 mr-2 -ml-1" />
                      {submitting ? 'Forging...' : 'Open shop'}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Form>
              </div>

              <div className="px-6 py-4 border-t border-border/30 bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/70">
                  Have an account?{' '}
                  <Link href="/auth/signin" className="font-bold text-primary hover:underline">Sign in</Link>
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
