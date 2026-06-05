'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Store, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/business-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setIsLoading(false)
        return
      }

      setStep('success')
    } catch {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Account created!</h1>
          <p className="text-sm text-muted-foreground">
            Your business account is ready. Now let's set up your first shop.
          </p>
          <Button
            className="w-full"
            onClick={() => { window.location.href = '/auth/setup' }}
          >
            Create your shop
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link
            href="/auth/signin"
            className="block text-xs text-muted-foreground hover:text-primary"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Register your business</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create an account to start selling online
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Full name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPassword ? 'Hide' : 'Show'} password
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Creating...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
