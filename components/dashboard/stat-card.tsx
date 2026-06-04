'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 transition-all duration-300 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10 hover:scale-105 group ${className}`}
    >
      {/* Background gradient accent */}
      <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-accent/10 to-primary/5 rounded-full blur-2xl transition-all duration-300 group-hover:scale-125" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 bg-gradient-to-tr from-primary/10 to-accent/5 rounded-full blur-2xl transition-all duration-300 group-hover:scale-125" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/60 mb-1">{label}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>

          {/* Trend indicator */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500/70" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500/70" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-green-500/70' : 'text-red-500/70'
                }`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-lg blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Icon className="w-6 h-6 text-primary/70 transition-transform duration-300 group-hover:scale-125 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
