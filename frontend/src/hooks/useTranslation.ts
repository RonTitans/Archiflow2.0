import { useTranslation as useI18nTranslation } from 'react-i18next'

export function useTranslation() {
  const { t, i18n } = useI18nTranslation('common')
  
  // Create a simplified t function that matches our usage
  const translate = (key: string): string => {
    // Map simple keys to nested keys in the translation files
    const keyMappings: Record<string, string> = {
      'signInToYourAccount': 'auth.signIn',
      'username': 'auth.username',
      'password': 'auth.password',
      'signIn': 'auth.signIn',
      'signingIn': 'common.loading',
      'logout': 'auth.logout',
      'profile': 'nav.settings',
    }
    
    const mappedKey = keyMappings[key] || key
    return t(mappedKey) as string
  }
  
  return {
    t: translate,
    locale: i18n.language,
    changeLocale: (lng: string) => i18n.changeLanguage(lng),
  }
}