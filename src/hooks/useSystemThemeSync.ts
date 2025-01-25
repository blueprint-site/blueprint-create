// src/hooks/useSystemThemeSync.ts
import { useThemeStore } from '@/stores/themeStore'
import { useEffect } from 'react'

export const useSystemThemeSync = () => {
  const themeMode = useThemeStore(state => state.themeMode)

  useEffect(() => {
    if (themeMode !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      useThemeStore.setState({ 
        systemTheme: e.matches ? 'dark' : 'light',
        isDarkMode: e.matches
      })
    }

    updateSystemTheme(mediaQuery)
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [themeMode])
}