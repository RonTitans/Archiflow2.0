import * as React from 'react'
import { cn } from '@/lib/utils'

const NetBoxTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
    <table
      ref={ref}
      className={cn('w-full', className)}
      {...props}
    />
  </div>
))
NetBoxTable.displayName = 'NetBoxTable'

const NetBoxTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn('bg-gray-50 border-b border-gray-200', className)} 
    {...props} 
  />
))
NetBoxTableHeader.displayName = 'NetBoxTableHeader'

const NetBoxTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
NetBoxTableBody.displayName = 'NetBoxTableBody'

const NetBoxTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }
>(({ className, clickable = true, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-gray-200 transition-colors',
      clickable && 'cursor-pointer hover:bg-blue-50',
      className
    )}
    {...props}
  />
))
NetBoxTableRow.displayName = 'NetBoxTableRow'

const NetBoxTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
      className
    )}
    {...props}
  />
))
NetBoxTableHead.displayName = 'NetBoxTableHead'

const NetBoxTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 py-3 text-sm text-gray-900', className)}
    {...props}
  />
))
NetBoxTableCell.displayName = 'NetBoxTableCell'

export {
  NetBoxTable,
  NetBoxTableHeader,
  NetBoxTableBody,
  NetBoxTableRow,
  NetBoxTableHead,
  NetBoxTableCell,
}