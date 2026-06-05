'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Mail, ArrowRight, CheckCircle2, Sparkles, Shield, KeyRound, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
})

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!formRef.current?.check()) return
    const { email } = formRef.current.value
    setSubmitting(true)
    const success = await sendPasswordReset(email)
    if (success) {
      setSent(true)
    } else {
      showToast('error', 'Something went wrong', 'Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 dark:from-amber-950/30 dark:via-slate-950 dark:to-orange-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,113,133,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-300/25 to-pink-200/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 backdrop-blur">
              <KeyRound className="h-3 w-3" />
              Account recovery
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Forgot your{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
                password?
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              No worries. Enter your email and we&apos;ll send you reset instructions.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              { icon: Shield, label: 'Secure process', desc: 'Link expires in 1 hour' },
              { icon: Zap, label: 'Instant delivery', desc: 'Email arrives within seconds' },
              { icon: CheckCircle2, label: 'No account lockout', desc: 'Try as many times as needed' },
            ].map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 shrink-0">
                  <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </span>
                <div>
                  <div className="font-medium text-foreground/90">{label}</div>
                  <div className="text-xs text-muted-foreground/80 mt-0.5">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-amber-500/10 backdrop-blur-2xl">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">AxtraBiz</span>
              </div>

              {sent ? (
                <div className="text-center space-y-5 py-2">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">Check your email</h2>
                    <p className="text-sm text-muted-foreground/80 mt-2 max-w-xs mx-auto">
                      We sent a password reset link to your email address. The link expires in 1 hour.
                    </p>
                  </div>
                  <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline">
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">Reset password</h2>
                    <p className="text-sm text-muted-foreground/80 mt-1">We&apos;ll email you reset instructions</p>
                  </div>

                  <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ email: '' }}>
                    <FormField name="email" type="email" placeholder="Email address" variant="bordered" icon={<Mail className="h-4 w-4" />} />

                    <Button type="submit" className="w-full h-11 mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/25 transition-all duration-300" appearance="primary" loading={submitting}>
                      {submitting ? 'Sending...' : 'Send reset link'}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Form>

                  <p className="mt-6 text-center text-sm text-muted-foreground/80">
                    Remember your password?{' '}
                    <Link href="/auth/signin" className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
