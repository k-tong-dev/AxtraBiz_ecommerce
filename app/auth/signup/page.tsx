'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Schema } from 'rsuite'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Check, Shield, Zap } from 'lucide-react'
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

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const result = await signup(values.name, values.email, values.password)
    if (result?.success) {
      showToast('success', 'Account created', 'Check your email for the verification code.')
      router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`)
    } else {
      showToast('error', 'Signup failed', result?.error || 'Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-violet-950/20">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-300/30 to-violet-300/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-300/25 to-pink-200/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — value props */}
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 backdrop-blur">
              <Zap className="h-3 w-3" />
              Free for 14 days
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Start your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                free account
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              Join 12,000+ merchants building modern storefronts. No credit card required.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {['14-day free trial', 'No credit card required', 'Cancel anytime'].map(item => (
              <li key={item} className="flex items-center gap-3 text-foreground/80">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
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
            <span>GDPR ready</span>
            <span>·</span>
            <span>99.99% uptime</span>
          </div>
        </div>

        {/* Right — auth card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            {/* Subtle glow behind card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">AxtraBiz</span>
              </div>

              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Create account</h2>
                <p className="text-sm text-muted-foreground/80 mt-1">Get started in seconds</p>
              </div>

              <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
                <div className="space-y-3.5">
                  <FormField name="name" placeholder="Full name" variant="bordered" icon={<User className="h-4 w-4" />} />

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

                <Button type="submit" className="w-full h-11 mt-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all duration-300" appearance="primary" loading={submitting}>
                  {submitting ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground/80">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
