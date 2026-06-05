'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, Shield, KeyRound, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
  confirm: Schema.Types.StringType()
    .isRequired('Please confirm your password')
    .addRule((value, data) => value === (data as any)?.password, 'Passwords do not match'),
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    const hasAccess = hash.includes('access_token') || hash.includes('type=recovery')
    setHasToken(hasAccess)
  }, [])

  const handleSubmit = async () => {
    if (!formRef.current?.check()) return
    const { password } = formRef.current.value
    setSubmitting(true)
    const success = await updatePassword(password)
    if (success) {
      setDone(true)
      setTimeout(() => router.push('/auth/signin'), 2000)
    } else {
      showToast('error', 'Update failed', 'Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-teal-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-300/20 blur-3xl orb-1" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-200/20 blur-3xl orb-2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur">
              <KeyRound className="h-3 w-3" />
              New password
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Set a new{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                password
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              Choose a strong password to keep your account secure.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm">
            {['At least 8 characters long', 'Mix of letters, numbers & symbols', 'Don\'t reuse other passwords'].map(tip => (
              <li key={tip} className="flex items-center gap-2.5 text-foreground/80">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl auth-card-enter">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">AxtraBiz</span>
              </div>

              {hasToken === false ? (
                <div className="text-center space-y-5 py-2">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                      <AlertCircle className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">Invalid link</h2>
                    <p className="text-sm text-muted-foreground/80 mt-2">
                      This reset link is invalid or expired.
                    </p>
                  </div>
                  <Link href="/auth/forgot-password" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                    Request a new link
                  </Link>
                </div>
              ) : done ? (
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
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">Password updated</h2>
                    <p className="text-sm text-muted-foreground/80 mt-2">
                      Redirecting you to sign in...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">New password</h2>
                    <p className="text-sm text-muted-foreground/80 mt-1">At least 8 characters</p>
                  </div>

                  <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ password: '', confirm: '' }}>
                    <div className="space-y-3.5 auth-page-form">
                      <FormField
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        variant="bordered"
                        icon={<Lock className="h-4 w-4" />}
                        trailing={
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground/60 hover:text-foreground transition-colors" tabIndex={-1}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      <FormField name="confirm" type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" variant="bordered" icon={<Lock className="h-4 w-4" />} />
                    </div>

                    <Button type="submit" className="w-full h-11 mt-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-300" appearance="primary" loading={submitting}>
                      {submitting ? 'Updating...' : 'Update password'}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
