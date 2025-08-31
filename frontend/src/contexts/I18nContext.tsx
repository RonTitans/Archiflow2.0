'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'

interface I18nContextType {
  locale: string
  changeLocale: (locale: string) => void
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'he')) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = newLocale === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale
  }

  return (
    <I18nContext.Provider value={{ locale, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}