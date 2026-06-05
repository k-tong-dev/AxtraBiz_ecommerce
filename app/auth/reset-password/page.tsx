'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      if (!window.location.hash.includes('type=recovery')) {
        setTokenError(true)
      }
    }
  }, [authLoading, user])

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      showToast('error', 'Invalid password', 'Must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'Please make sure both passwords match.')
      return
    }

    setSaving(true)
    const ok = await updatePassword(password)
    setSaving(false)

    if (ok) {
      setIsDone(true)
      showToast('success', 'Password updated', 'Redirecting to sign in...')
      setTimeout(() => router.push('/auth/signin'), 1500)
    } else {
      showToast('error', 'Failed', 'Could not update password. The link may have expired.')
    }
  }

  const guidelines = [
    { icon: KeyRound, text: 'At least 6 characters long' },
    { icon: ShieldCheck, text: 'Use a mix of letters and numbers' },
    { icon: RefreshCw, text: 'Avoid reusing old passwords' },
  ]

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold">Invalid or expired link</h1>
              <p className="text-sm text-muted-foreground">
                This password reset link is no longer valid. Request a new one.
              </p>
            </div>
            <Link href="/auth/forgot-password">
              <Button className="w-full" appearance="primary">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Request new link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isDone) {
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
              <h1 className="text-xl font-bold">Password updated</h1>
              <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
            </div>
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
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
              Reset password
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">
              Choose a new password
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Make it strong and unique to keep your account secure.
            </p>
          </div>

          <div className="space-y-3">
            {guidelines.map((g) => (
              <div
                key={g.text}
                className="rounded-2xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                    <g.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center min-h-[36px]">
                    <p className="text-sm">{g.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[55%]">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold">Reset password</h1>
              <p className="text-sm text-muted-foreground">Enter your new password below</p>
            </div>

            {authLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  fullWidth
                />
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  fullWidth
                />
                <Button
                  className="w-full"
                  appearance="primary"
                  loading={saving}
                  disabled={saving || !password || !confirmPassword}
                  onClick={handleSubmit}
                >
                  {saving ? 'Updating...' : 'Update password'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
