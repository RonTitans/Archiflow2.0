'use client'

import { useEffect, useState } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useDirection } from './direction-provider'

import enCommon from '@/locales/en/common.json'
import heCommon from '@/locales/he/common.json'

const resources = {
  en: {
    common: enCommon,
  },
  he: {
    common: heCommon,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { setDirection } = useDirection()

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en'
    i18n.changeLanguage(savedLang)
    setDirection(savedLang === 'he' ? 'rtl' : 'ltr')
    setIsInitialized(true)

    i18n.on('languageChanged', (lng) => {
      localStorage.setItem('language', lng)
      setDirection(lng === 'he' ? 'rtl' : 'ltr')
    })

    return () => {
      i18n.off('languageChanged')
    }
  }, [setDirection])

  if (!isInitialized) {
    return null
  }

  return <>{children}</>
}