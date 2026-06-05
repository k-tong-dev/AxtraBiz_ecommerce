'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

type ResetForm = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, updatePassword } = useAuth()
  const [isDone, setIsDone] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const form = useForm<ResetForm>({
    defaultValues: { password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!authLoading && !user) {
      if (!window.location.hash.includes('type=recovery')) {
        setTokenError(true)
      }
    }
  }, [authLoading, user])

  const onSubmit = async (data: ResetForm) => {
    if (data.password !== data.confirmPassword) {
      showToast('error', 'Passwords do not match', 'Please make sure both passwords match.')
      return
    }
    const ok = await updatePassword(data.password)
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
    { icon: ShieldCheck, text: 'Mix of letters and numbers recommended' },
    { icon: RefreshCw, text: 'Don&apos;t reuse passwords from other sites' },
  ]

  if (tokenError) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-red-500/20 flex items-center justify-center ring-1 ring-destructive/10">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">This reset link is no longer valid. Request a new one.</p>
          <Link href="/auth/forgot-password">
            <Button className="w-full h-11" appearance="primary">
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
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center ring-1 ring-primary/10">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Password updated</h1>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl mx-auto px-4 lg:px-8 gap-8 xl:gap-16 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary tracking-wide uppercase">
              <Lock className="h-3.5 w-3.5" />
              Reset password
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]">
              Choose a{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                strong password
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Make it unique and memorable to keep your account secure.
            </p>
          </div>

          <div className="space-y-3">
            {guidelines.map((g) => (
              <div
                key={g.text}
                className="rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-500 hover:border-primary/30 hover:bg-card/70"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 p-2.5 ring-1 ring-primary/10">
                    <g.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center min-h-[36px]">
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: g.text }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[55%] max-w-md mx-auto lg:mx-0">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl">
            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Reset password</h1>
              <p className="text-sm text-muted-foreground">Enter your new password below</p>
            </div>

            {authLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: 'Password is required',
                      minLength: { value: 6, message: 'At least 6 characters' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Min. 6 characters" value={field.value} onChange={(e) => field.onChange(e.target.value)} fullWidth />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{ required: 'Please confirm your password' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Re-enter your password" value={field.value} onChange={(e) => field.onChange(e.target.value)} fullWidth />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11"
                    appearance="primary"
                    loading={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Updating...' : 'Update password'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
