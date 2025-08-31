import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusChipVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        free: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      },
      size: {
        default: 'h-5 text-xs',
        sm: 'h-4 text-[10px]',
        lg: 'h-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'active',
      size: 'default',
    },
  }
)

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusChipVariants> {
  label?: string
}

const StatusChip = React.forwardRef<HTMLDivElement, StatusChipProps>(
  ({ className, variant, size, label, children, ...props }, ref) => {
    return (
      <div
        className={cn(statusChipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {label || children}
      </div>
    )
  }
)
StatusChip.displayName = 'StatusChip'

export { StatusChip, statusChipVariants }