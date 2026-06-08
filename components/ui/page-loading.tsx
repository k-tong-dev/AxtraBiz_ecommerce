'use client'

import { Sparkles } from 'lucide-react'

const gradients: Record<string, string> = {
  default: 'from-indigo-500 via-violet-500 to-fuchsia-500',
  business: 'from-violet-500 via-fuchsia-500 to-rose-500',
  auth: 'from-emerald-500 via-teal-500 to-cyan-500',
  dashboard: 'from-indigo-500 via-violet-500 to-fuchsia-500',
}

export function PageLoading({ theme = 'default' }: { theme?: keyof typeof gradients }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradients[theme] || gradients.default} flex items-center justify-center shadow-lg`}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="w-6 h-6 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
      </div>
    </div>
  )
}
