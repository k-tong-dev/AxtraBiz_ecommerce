'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Schema } from 'rsuite'
import {
  Mail, ArrowLeft, CheckCircle2, Lock, Sparkles, Settings, Star, Shield, Sword, Send, KeyRound, Inbox, MousePointerClick, RefreshCw, AlertCircle, ChevronRight,
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

  if (isSuccess) {
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
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Quest complete!</h1>
                <p className="text-sm text-muted-foreground">We sent a reset link to <span className="font-medium text-foreground">{sentEmail}</span></p>
              </div>
              <Button className="w-full h-12 relative overflow-hidden group" appearance="primary" onClick={() => { setIsSuccess(false); formRef.current?.reset() }}>
                <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                  <Send className="w-4 h-4 mr-2" />
                  Resend scroll
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-400/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-yellow-400/15 to-rose-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05]">
              Lost your{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
                master key?
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              No worries. We&apos;ll send you a magic scroll to reset it.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC 2</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 256-bit SSL</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -bottom-3 left-6 right-6 h-3 rounded-3xl bg-gradient-to-b from-amber-500/20 to-transparent blur-xl" />
            <div className="absolute -bottom-1.5 left-12 right-12 h-1.5 rounded-3xl bg-gradient-to-b from-amber-500/30 to-rose-500/20" />

            <div className="relative rounded-3xl border border-border/40 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    <Star className="h-3 w-3 text-amber-400/40" />
                    <Star className="h-3 w-3 text-amber-400/40" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider">RECOVERY</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/70 tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  QUEST
                </div>
              </div>

              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider uppercase">Step 1 of 3</span>
                  <span className="text-[10px] font-bold text-primary">33%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Find your key</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link</p>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <FormField name="email" type="email" placeholder="your@email.com" />
                </div>

                <Button type="submit" className="w-full h-12 relative overflow-hidden group" appearance="primary" loading={submitting} onClick={onSubmit}>
                  <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Sending scroll...' : 'Send reset scroll'}
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <div className="space-y-2.5 pt-2">
                  {[
                    { icon: Inbox, text: 'Check your inbox' },
                    { icon: MousePointerClick, text: 'Click the magic link' },
                    { icon: RefreshCw, text: 'Set new password' },
                  ].map((s, i) => (
                    <div key={s.text} className="flex items-center gap-2.5 text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/20 text-[10px] font-bold text-amber-600">
                        {i + 1}
                      </div>
                      <s.icon className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-muted-foreground/80">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border/30 bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/70">
                  <Link href="/auth/signin" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </Link>
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
