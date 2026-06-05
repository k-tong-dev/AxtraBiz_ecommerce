'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
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
      const hasHash = window.location.hash.includes('type=recovery')
      if (!hasHash) {
        setTokenError(true)
      }
    }
  }, [authLoading, user])

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'Please make sure both passwords match.')
      return
    }
    if (password.length < 6) {
      showToast('error', 'Password too short', 'Must be at least 6 characters.')
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

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/auth/forgot-password">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Password updated</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been changed successfully. Redirecting to sign in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your new password below
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          {authLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Input
                label="New password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
              <Button
                className="w-full"
                disabled={saving || !password || !confirmPassword}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  'Update password'
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
