'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Mail, RefreshCw, Sparkles, Shield, Zap, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

function VerifyOTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const { verifyOtp, resendOtp } = useAuth()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.push('/auth/signup')
    } else {
      setTimeout(() => inputRefs.current[0]?.focus(), 300)
    }
  }, [email, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    if (newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''))
    setOtp(newOtp)
    setError('')
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
    if (pasted.length === 6) {
      handleVerify(pasted)
    }
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otp.join('')
    if (otpCode.length !== 6) return

    setIsLoading(true)
    setError('')
    const result = await verifyOtp(email, otpCode)
    if (result.success) {
      // Create res_users profile
      try {
        await fetch('/api/auth/complete-signup', { method: 'POST' })
      } catch {}
      showToast('success', 'Email verified', 'Welcome to AxtraBiz.')
      setTimeout(() => {
        window.location.href = redirectTo
      }, 800)
    } else {
      setError(result.error || 'Invalid code. Please try again.')
      showToast('error', 'Verification failed', result.error || 'Invalid code')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    const result = await resendOtp(email)
    if (result.success) {
      showToast('success', 'Code resent', 'Check your email for the new code.')
      setTimeLeft(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      setError('')
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } else {
      showToast('error', 'Resend failed', result.error || 'Please try again.')
    }
    setIsResending(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-teal-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-300/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-200/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — value props */}
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur">
              <Shield className="h-3 w-3" />
              Secure verification
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              One last{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                step
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-foreground/90">{email || 'your email'}</span>
              . Enter it below to verify your account.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              { icon: Shield, label: 'Enhanced security', desc: 'Email verification prevents unauthorized access' },
              { icon: RefreshCw, label: 'Easy recovery', desc: 'Lost the code? Request a new one anytime' },
              { icon: KeyRound, label: 'Single use', desc: 'Code expires in 10 minutes for safety' },
            ].map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                  <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
                <div>
                  <div className="font-medium text-foreground/90">{label}</div>
                  <div className="text-xs text-muted-foreground/80 mt-0.5">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — auth card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">AxtraBiz</span>
              </div>

              <Link href="/auth/signup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/80 hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>

              <div className="mb-7">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                  <Mail className="h-3 w-3" />
                  Email verification
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Check your inbox</h2>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  Enter the 6-digit code we sent to{' '}
                  <span className="font-medium text-foreground/90">{email || 'your email'}</span>
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
                  <CheckCircle2 className="h-4 w-4 shrink-0 rotate-180" />
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      disabled={isLoading}
                      className={`h-14 w-full text-center text-2xl font-semibold rounded-xl border-2 bg-white/60 dark:bg-slate-900/40 outline-none transition-all duration-200 backdrop-blur
                        ${digit ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'border-border/60'}
                        ${error ? 'border-destructive/60' : ''}
                        focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10
                        disabled:opacity-50`}
                    />
                  ))}
                </div>

                <Button
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-300"
                  appearance="primary"
                  disabled={isLoading || otp.join('').length !== 6}
                  onClick={() => handleVerify()}
                  loading={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify email'}
                  <ArrowLeft className="w-4 h-4 ml-1.5 rotate-180" />
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground/80">
                    Didn't receive the code?
                  </p>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" />
                          Resend code
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground/60">
                      Resend in <span className="font-mono text-foreground/70">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOTPPageContent />
    </Suspense>
  )
}
