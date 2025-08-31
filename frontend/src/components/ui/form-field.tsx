'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  className,
  disabled = false,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const error = errors[name]
  const value = watch(name)

  if (type === 'select') {
    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Select
          value={value}
          onValueChange={(val) => setValue(name, val)}
          disabled={disabled}
        >
          <SelectTrigger id={name} className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-500">{error.message as string}</p>
        )}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          className={error ? 'border-red-500' : ''}
          disabled={disabled}
        />
        {error && (
          <p className="text-sm text-red-500">{error.message as string}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  )
}