import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAction {
  label: string
  icon?: React.ElementType
  onClick?: () => void
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}

interface QuickActionsProps {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  primaryAction?: QuickAction
  secondaryActions?: QuickAction[]
  showRefresh?: boolean
  onRefresh?: () => void
  showExport?: boolean
  onExport?: () => void
  showImport?: boolean
  onImport?: () => void
  className?: string
}

export function QuickActions({
  searchPlaceholder = 'Search...',
  onSearch,
  primaryAction,
  secondaryActions = [],
  showRefresh = true,
  onRefresh,
  showExport = true,
  onExport,
  showImport = true,
  onImport,
  className,
}: QuickActionsProps) {
  const [searchValue, setSearchValue] = React.useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        {onSearch && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {secondaryActions.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            {secondaryActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showRefresh && onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        {showExport && onExport && (
          <Button variant="outline" size="icon" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        )}
        {showImport && onImport && (
          <Button variant="outline" size="icon" onClick={onImport}>
            <Upload className="h-4 w-4" />
          </Button>
        )}
        
        {primaryAction && (
          <Button
            variant={primaryAction.variant || 'default'}
            onClick={primaryAction.onClick}
          >
            {primaryAction.icon && (
              <primaryAction.icon className="h-4 w-4 mr-2" />
            )}
            {primaryAction.label}
          </Button>
        )}

        {secondaryActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {secondaryActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}