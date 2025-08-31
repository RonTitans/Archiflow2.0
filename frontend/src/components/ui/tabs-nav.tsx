import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TabItem {
  label: string
  href: string
  count?: number
}

interface TabsNavProps {
  tabs: TabItem[]
  className?: string
}

export function TabsNav({ tabs, className }: TabsNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-700', className)}>
      <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-2 rounded-full px-2 py-0.5 text-xs',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}