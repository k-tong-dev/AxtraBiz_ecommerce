'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

function VerifyOTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const redirectTo = searchParams.get('redirect') || '/website'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/business-register')
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
    if (value.length > 1) {
      value = value[0]
    }
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
    setOtp(newOtp)
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      showToast('error', 'Invalid OTP', 'Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otpCode })
      })

      const data = await response.json()

      if (response.ok) {
        showToast('success', 'Email verified', 'Your account has been confirmed')
        setTimeout(() => router.push(redirectTo), 1500)
      } else {
        showToast('error', 'Verification failed', data.message || 'Invalid OTP code')
      }
    } catch (error) {
      showToast('error', 'Network error', 'Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        showToast('success', 'OTP resent', 'Check your email for the new code')
        setTimeLeft(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
      } else {
        showToast('error', 'Resend failed', data.message || 'Could not resend OTP')
      }
    } catch (error) {
      showToast('error', 'Network error', 'Please try again')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top-right,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_30%)] px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="w-full max-w-md justify-self-center lg:order-2">
          <div className="space-y-6 rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-2">
              <Link href="/business-register" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to sign up
              </Link>
              <p className="text-sm font-medium text-primary">Verify your email</p>
              <h1 className="text-3xl font-bold tracking-tight">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter verification code</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-lg font-semibold"
                    />
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={isLoading || otp.join('').length !== 6}
                onClick={handleVerify}
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  disabled={!canResend || isResending}
                  onClick={handleResend}
                  className="text-sm"
                >
                  {isResending ? (
                    'Resending...'
                  ) : canResend ? (
                    'Resend code'
                  ) : (
                    `Resend in ${timeLeft}s`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden rounded-3xl border border-border/60 bg-card/70 p-10 shadow-xl backdrop-blur lg:block">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Mail className="h-4 w-4" />
              Email verification
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">Protect your account with email verification</h2>
              <p className="text-base leading-7 text-muted-foreground">
                We've sent a verification code to your email address to ensure you own this account and keep it secure.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Enhanced security
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Email verification prevents unauthorized access to your account.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  Easy recovery
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lost the code? Request a new one anytime with a single click.
                </p>
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
        <div className="min-h-screen px-4 py-12">
          <div className="mx-auto min-h-[calc(100vh-6rem)] w-full max-w-md rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur" />
        </div>
      }
    >
      <VerifyOTPPageContent />
    </Suspense>
  )
}
