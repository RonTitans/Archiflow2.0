import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {breadcrumbs.length > 0 && (
          <nav className="flex mb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
    </div>
  )
}