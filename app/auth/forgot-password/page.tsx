'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, Lock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    try {
      const ok = await sendPasswordReset(email.trim())
      if (ok) {
        setIsSuccess(true)
        showToast('success', 'Email sent', 'Check your inbox for the password reset link.')
      } else {
        showToast('error', 'Failed', 'Could not send password reset email.')
      }
    } catch {
      showToast('error', 'Error', 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { icon: Mail, title: 'Check your inbox', desc: 'We\'ll send a reset link to your email.' },
    { icon: Lock, title: 'Click the link', desc: 'Opens a secure page to set a new password.' },
    { icon: RefreshCw, title: 'Done', desc: 'Sign in with your new password.' },
  ]

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a reset link to{' '}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
            <Button
              className="w-full"
              appearance="primary"
              onClick={() => { setIsSuccess(false); setEmail('') }}
            >
              <Mail className="w-4 h-4 mr-1.5" />
              Resend email
            </Button>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-5xl gap-8 xl:gap-12 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Lock className="h-3.5 w-3.5" />
              Password reset
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No worries. Enter your email and we&apos;ll send you a link to reset it.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[55%]">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="mb-6 lg:hidden">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-sm text-muted-foreground">Enter your email for a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                className="w-full"
                appearance="primary"
                loading={isLoading}
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
                <Mail className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="hidden lg:block mt-6 text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
