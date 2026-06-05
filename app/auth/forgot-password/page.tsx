'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
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
        showToast('error', 'Failed', 'Could not send password reset email. Please try again.')
      }
    } catch {
      showToast('error', 'Error', 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We sent a password reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => setIsSuccess(false)}
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Resend email
          </Button>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 space-y-6">
        <div className="space-y-2">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-1.5" />
                Send reset link
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
