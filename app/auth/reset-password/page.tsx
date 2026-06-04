'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password after opening the reset link from your email.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">New password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={saving || !password || password.length < 6}
          onClick={async () => {
            if (password !== confirmPassword) {
              setNotice('Passwords do not match.')
              return
            }
            setSaving(true)
            const ok = await updatePassword(password)
            setSaving(false)
            if (ok) {
              setNotice('Password updated. Redirecting to login...')
              setTimeout(() => router.push('/auth/signin'), 800)
            } else {
              setNotice('Failed to update password.')
            }
          }}
        >
          {saving ? 'Updating...' : 'Update Password'}
        </Button>

        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
      </div>
    </div>
  )
}

