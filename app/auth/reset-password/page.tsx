'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Schema } from 'rsuite'
import { Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react'
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
    .addRule((value, data) => {
      if (value !== data?.password) return false
      return true
    }, 'Passwords do not match'),
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash || (!hash.includes('access_token') && !hash.includes('type=recovery'))) {
      showToast('error', 'Invalid link', 'This reset link is invalid or expired.')
    }
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Set a new{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                password
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Choose a strong password to keep your account secure.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl shadow-black/[0.04] backdrop-blur-xl">
            <div className="lg:hidden mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold">AxtraBiz</span>
            </div>

            {done ? (
              <div className="text-center space-y-5">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Password updated</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting you to sign in...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-semibold tracking-tight">New password</h2>
                  <p className="text-sm text-muted-foreground mt-1">At least 8 characters</p>
                </div>

                <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ password: '', confirm: '' }}>
                  <div className="space-y-3.5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="New password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <FormField name="confirm" type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 mt-5" appearance="primary" loading={submitting}>
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
  )
}
