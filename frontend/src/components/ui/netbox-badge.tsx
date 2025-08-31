import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NetBoxBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'default'
}

const badgeVariants = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-cyan-100 text-cyan-800',
  secondary: 'bg-gray-100 text-gray-800',
  default: 'bg-gray-100 text-gray-600',
}

const NetBoxBadge = React.forwardRef<HTMLDivElement, NetBoxBadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          badgeVariants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
NetBoxBadge.displayName = 'NetBoxBadge'

export { NetBoxBadge }