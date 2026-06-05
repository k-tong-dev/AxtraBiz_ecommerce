'use client'

import { Suspense, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Schema } from 'rsuite'
import {
  Mail, Lock, User, ArrowRight, Eye, EyeOff, ChevronRight, Settings, Star, Shield, Sparkles, Sword, Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  name: Schema.Types.StringType().isRequired('Name is required'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
})

function SignupPageContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/website'
  const { signup, loginWithGoogle } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const created = await signup(values.name, values.email, values.password)
    setSubmitting(false)

    if (!created) {
      showToast('error', 'Could not create account', 'Please try again.')
      return
    }
    showToast('success', 'Check your email',
      created.needsVerification ? 'Verification code sent.' : 'Account created successfully.')
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) { showToast('error', 'Google sign-up failed', 'Please try again.') }
    setGoogleLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50/40 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950/40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-400/20 to-rose-500/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05]">
              Begin your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                seller quest
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Create your account and start selling in minutes.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC 2</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" /> 12K+ stores</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -bottom-3 left-6 right-6 h-3 rounded-3xl bg-gradient-to-b from-indigo-500/20 to-transparent blur-xl" />
            <div className="absolute -bottom-1.5 left-12 right-12 h-1.5 rounded-3xl bg-gradient-to-b from-indigo-500/30 to-pink-500/20" />

            <div className="relative rounded-3xl border border-border/40 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600" />

              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-400/40" />
                    {[1, 2, 3, 4].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider">LVL 1</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/70 tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NEW PLAYER
                </div>
              </div>

              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider uppercase">Account creation</span>
                  <span className="text-[10px] font-bold text-primary">25%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
                  <p className="text-sm text-muted-foreground mt-1">Start your seller journey</p>
                </div>

                <Button className="w-full h-11 group" appearance="default" onClick={handleGoogleSignup} disabled={googleLoading || submitting}>
                  {googleLoading ? 'Connecting...' : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Quick sign up with Google
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase">
                    <span className="bg-card px-3 text-muted-foreground/50 tracking-widest">or sign up with email</span>
                  </div>
                </div>

                <Form ref={formRef} model={model} onSubmit={onSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
                  <div className="space-y-3.5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <FormField name="name" placeholder="Hero name" />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <FormField name="email" type="email" placeholder="your@email.com" />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <div className="relative">
                        <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1 z-10" tabIndex={-1}>
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-5 relative overflow-hidden group"
                    appearance="primary"
                    loading={submitting}
                  >
                    <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                      <Sword className="w-4 h-4 mr-2 -ml-1" />
                      {submitting ? 'Forging...' : 'Begin your quest'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Form>
              </div>

              <div className="px-6 py-4 border-t border-border/30 bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/70">
                  Returning player?{' '}
                  <Link href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-primary hover:underline">
                    Sign in
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-full max-w-md h-[600px] rounded-3xl border border-border/40 bg-card/70 animate-pulse" /></div>}>
      <SignupPageContent />
    </Suspense>
  )
}
