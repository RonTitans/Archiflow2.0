import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
}

const iconColors = {
  default: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  variant = 'default',
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {trend && trendValue && (
            <div className="mt-2 flex items-center text-sm">
              {trend === 'up' && (
                <span className="text-green-600 dark:text-green-400">
                  ↑ {trendValue}
                </span>
              )}
              {trend === 'down' && (
                <span className="text-red-600 dark:text-red-400">
                  ↓ {trendValue}
                </span>
              )}
              {trend === 'neutral' && (
                <span className="text-gray-600 dark:text-gray-400">
                  → {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'rounded-lg p-3',
              variant === 'default' ? 'bg-gray-100 dark:bg-gray-700' : ''
            )}
          >
            <Icon className={cn('h-6 w-6', iconColors[variant])} />
          </div>
        )}
      </div>
    </div>
  )
}