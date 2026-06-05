'use client'

import { useState, useRef } from 'react'
import { Schema } from 'rsuite'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import Link from 'next/link'
import {
  Store, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Globe, TrendingUp, Users, Quote,
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

  const benefits = [
    { icon: Store, title: 'Own online store', desc: 'Fully customizable storefront.' },
    { icon: Globe, title: 'Sell worldwide', desc: 'Multi-currency & multi-language.' },
    { icon: TrendingUp, title: 'Grow with data', desc: 'Real-time analytics & insights.' },
    { icon: Users, title: 'Team management', desc: 'Role-based permissions.' },
  ]

  if (step === 'success') {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center ring-1 ring-primary/10">
              <CheckCircle2 className="w-8 h-8 text-primary" />
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-4 lg:px-8 gap-8 xl:gap-16 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary tracking-wide uppercase">
              <Store className="h-3.5 w-3.5" />
              Start selling
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]">
              Launch your{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                e-commerce business
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Everything you need to start selling online — no technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 p-2.5 w-fit mb-3 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                  <b.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-primary/[0.03] to-blue-500/[0.03] p-5">
            <Quote className="h-6 w-6 text-primary/30 absolute top-3 right-3" />
            <p className="text-sm text-muted-foreground/90 italic leading-relaxed">&ldquo;AxtraBiz helped us scale from a single shop to 5 locations in under 6 months. Game changer.&rdquo;</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">ER</div>
              <div>
                <p className="text-xs font-medium">Elena Rodriguez</p>
                <p className="text-[10px] text-muted-foreground/70">Founder, Bella Home</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] max-w-md mx-auto lg:mx-0">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl">
            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Register your business</h1>
              <p className="text-sm text-muted-foreground">Create an account to start selling online</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive mb-4 ring-1 ring-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Form
              ref={formRef}
              model={model}
              onSubmit={onSubmit}
              fluid
              formDefaultValue={{ name: '', email: '', password: '' }}
            >
              <FormField name="name" label="Full name" placeholder="John Doe" />
              <FormField name="email" label="Email address" type="email" placeholder="you@example.com" />

              <div>
                <FormField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-1 text-xs text-muted-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-5"
                appearance="primary"
                loading={submitting}
              >
                {submitting ? 'Creating...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Form>

            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
