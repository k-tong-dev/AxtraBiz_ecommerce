'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {Schema} from 'rsuite'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Check, Shield, Zap, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CountrySelect } from '@/components/ui/country-select'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'
import { getPhoneCode, validatePhone as validatePhoneWithCountry } from '@/lib/mock/phone-utils'

const model = Schema.Model({
  name: Schema.Types.StringType().isRequired('Name is required'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
  confirm: Schema.Types.StringType()
    .isRequired('Please confirm your password')
    .addRule((value, data) => {
      return value === data?.password;
    }, 'Passwords do not match'),
})

export default function SignupPage() {
  const router = useRouter()
  const { signup, loginWithGoogle } = useAuth()
  const formRef = useRef<any>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', phone: '', country: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [countryError, setCountryError] = useState('')
  const [formErrors, setFormErrors] = useState<string[]>([])
  const phoneCode = formData.country ? getPhoneCode(formData.country) : ''

  const handleSubmit = async () => {
    setPhoneError('')
    setCountryError('')
    setFormErrors([])

    if (!formData.country.trim()) {
      setCountryError('Country is required')
      showToast('error', 'Validation', 'Country is required')
      return
    }

    const phoneErr = validatePhoneWithCountry(formData.phone, formData.country)
    if (phoneErr) {
      setPhoneError(phoneErr)
      showToast('error', 'Validation', phoneErr)
      return
    }

    try {
      const valid = formRef.current?.check()
      if (!valid) {
        const errors: string[] = []
        if (!formData.name.trim()) errors.push('Name is required')
        if (!formData.email.trim()) errors.push('Email is required')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Invalid email address')
        if (formData.password.length < 8) errors.push('Password must be at least 8 characters')
        if (formData.password !== formData.confirm) errors.push('Passwords do not match')
        if (errors.length) {
          setFormErrors(errors)
          showToast('error', 'Validation', errors[0])
          return
        }
        return
      }
      setSubmitting(true)
      const result = await signup(formData.name, formData.email, formData.password, formData.phone, formData.country)
      if (result?.success) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`)
      } else {
        const msg = result?.error || 'Please try again.'
        if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
          showToast('error', 'Email in use', 'This email is already registered. Try signing in.')
        } else {
          showToast('error', 'Signup failed', msg)
        }
      }
    } catch (e) {
      console.error('[Signup] Unexpected error:', e)
      showToast('error', 'Signup failed', 'An unexpected error occurred.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-violet-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-300/30 to-violet-300/20 blur-3xl orb-1" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-300/25 to-pink-200/20 blur-3xl orb-2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Luxe</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 backdrop-blur">
              <Zap className="h-3 w-3" />
              Free for 14 days
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Start your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                free account
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              Join 12,000+ merchants building modern storefronts. No credit card required.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {['14-day free trial', 'No credit card required', 'Cancel anytime'].map(item => (
              <li key={item} className="flex items-center gap-3 text-foreground/80">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6 pt-2 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> SOC 2 Type II
            </span>
            <span>·</span>
            <span>GDPR ready</span>
            <span>·</span>
            <span>99.99% uptime</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative z-0">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl auth-card-enter">
              <div className="lg:hidden mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">Luxe</span>
              </div>

              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Create account</h2>
                <p className="text-sm text-muted-foreground/80 mt-1">Get started in seconds</p>
              </div>

              <div className="flex items-center justify-center mb-4">
                <Button
                  className="p-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-border/60 transition-all duration-200"
                  appearance="default"
                  onClick={async () => {
                    setGoogleLoading(true)
                    const ok = await loginWithGoogle()
                    if (!ok) showToast('error', 'Google sign-up failed', 'Please try again.')
                    setGoogleLoading(false)
                  }}
                  disabled={googleLoading}
                  loading={googleLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white/80 dark:bg-slate-900/70 px-3 text-muted-foreground/80 backdrop-blur rounded-full">or sign up with email</span>
                </div>
              </div>

              <Form ref={formRef} model={model} onChange={(v: any) => setFormData((prev) => ({ ...prev, ...v }))} fluid formDefaultValue={{ name: '', email: '', password: '', confirm: '' }}>
                <div className="space-y-3.5 auth-page-form min-w-95">
                  <FormField name="name" placeholder="Full name" variant="bordered" icon={<User className="h-4 w-4" />} />

                  <div className="relative w-full">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 pointer-events-none">
                      <Globe className="h-4 w-4" />
                    </div>
                    <CountrySelect
                        value={formData.country}
                        error={!!countryError}
                        onChange={(v) => { setCountryError(''); setFormData((prev) => ({ ...prev, country: v ?? '' })) }}
                        className="pl-10"
                    />
                  </div>

                  <div className="relative w-full">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 pointer-events-none">
                      <Phone className="h-4 w-4" />
                    </div>
                    {phoneCode && (
                      <div className="absolute left-[2.25rem] top-1/2 -translate-y-1/2 z-10 text-sm font-medium text-muted-foreground/70 pointer-events-none border-r border-border/40 pr-2">
                        {phoneCode}
                      </div>
                    )}
                    <Input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        variant="bordered"
                        error={!!phoneError}
                        onChange={(e) => { setPhoneError(''); setFormData((prev) => ({ ...prev, phone: e.target.value })) }}
                        className={phoneCode ? 'pl-[5.5rem]' : 'pl-10'}
                    />
                  </div>

                  <FormField name="email" type="email" placeholder="Email address" variant="bordered" icon={<Mail className="h-4 w-4" />} />

                  <FormField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 8 chars)"
                    variant="bordered"
                    icon={<Lock className="h-4 w-4" />}
                    trailing={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground/60 hover:text-foreground transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />

                  <FormField
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    variant="bordered"
                    icon={<Lock className="h-4 w-4" />}
                    trailing={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted-foreground/60 hover:text-foreground transition-colors" tabIndex={-1}>
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </div>

                <Button
                        className="w-full h-11 mt-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all duration-300"
                        appearance="primary" loading={submitting}
                        onClick={handleSubmit}>
                  {submitting ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground/80">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
