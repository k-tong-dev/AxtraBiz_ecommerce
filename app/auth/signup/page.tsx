'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, UserPlus, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

function SignupPageContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/website'
  const { user, isLoading: authLoading, signup, loginWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) return
    setSaving(true)
    const created = await signup(name, email, password)
    setSaving(false)

    if (!created) {
      showToast('error', 'Could not create account', 'Please try again.')
      return
    }

    if (created.needsVerification) {
      showToast('success', 'Check your email', 'Verification code sent.')
    } else {
      showToast('success', 'Welcome!', 'Account created successfully.')
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) {
      showToast('error', 'Google sign-up failed', 'Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to start shopping and managing orders
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          {/* Google button */}
          <Button
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={googleLoading || saving}
          >
            {googleLoading ? (
              'Connecting...'
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </div>

          <Button
            className="w-full"
            disabled={saving || authLoading || !email || !password || !name}
            onClick={handleSignup}
          >
            {saving ? 'Creating...' : 'Create account'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-full max-w-md h-96 bg-card border border-border rounded-xl animate-pulse" /></div>}>
      <SignupPageContent />
    </Suspense>
  )
}
