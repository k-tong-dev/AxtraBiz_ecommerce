'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/60 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-rose-300/25 to-pink-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Forgot your{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
                password?
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              No worries. Enter your email and we&apos;ll send you reset instructions.
            </p>
          </div>

          <p className="text-sm text-muted-foreground/80">
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl shadow-black/[0.04] backdrop-blur-xl">
            <div className="lg:hidden mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold">AxtraBiz</span>
            </div>

            {sent ? (
              <div className="text-center space-y-5">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Check your email</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    We sent a password reset link to your email address. The link expires in 1 hour.
                  </p>
                </div>
                <Link href="/auth/signin" className="inline-flex items-center text-sm text-primary hover:underline">
                  <ArrowRight className="h-3.5 w-3.5 mr-1 rotate-180" /> Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-semibold tracking-tight">Reset password</h2>
                  <p className="text-sm text-muted-foreground mt-1">We&apos;ll email you reset instructions</p>
                </div>

                <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ email: '' }}>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <FormField name="email" type="email" placeholder="Email address" />
                  </div>

                  <Button type="submit" className="w-full h-11 mt-4" appearance="primary" loading={submitting}>
                    {submitting ? 'Sending...' : 'Send reset link'}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
