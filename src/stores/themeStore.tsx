// src/stores/themeStore.ts
import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  // Core theme state
  isDarkMode: boolean
  systemTheme: 'dark' | 'light' | null
  themeMode: 'system' | 'dark' | 'light'
  
  // Actions
  toggleTheme: () => void
  setTheme: (theme: 'system' | 'dark' | 'light') => void
  
  // Dynamic theme settings
  fontSize: 'sm' | 'base' | 'lg' | 'xl'
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void
  
  // Accessibility preferences
  reducedMotion: boolean
  highContrast: boolean
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      isDarkMode: false,
      systemTheme: null,
      themeMode: 'system',
      fontSize: 'base',
      reducedMotion: false,
      highContrast: false,

      // Theme toggling with system preference support
      toggleTheme: () => {
        const currentMode = get().themeMode
        if (currentMode === 'system') {
          // If currently following system, switch to manual dark/light
          const newMode = get().systemTheme === 'dark' ? 'light' : 'dark'
          set({ themeMode: newMode, isDarkMode: newMode === 'dark' })
        } else {
          // If manually set, just toggle
          set(state => ({ 
            isDarkMode: !state.isDarkMode,
            themeMode: !state.isDarkMode ? 'dark' : 'light' 
          }))
        }
      },

      // Explicitly set theme mode
      setTheme: (theme) => {
        if (theme === 'system') {
          const systemTheme = get().systemTheme
          set({ 
            themeMode: 'system',
            isDarkMode: systemTheme === 'dark'
          })
        } else {
          set({ 
            themeMode: theme,
            isDarkMode: theme === 'dark'
          })
        }
      },

      // Font size control
      setFontSize: (size) => set({ fontSize: size }),

      // Accessibility toggles
      toggleReducedMotion: () => 
        set(state => ({ reducedMotion: !state.reducedMotion })),
      
      toggleHighContrast: () => 
        set(state => ({ highContrast: !state.highContrast })),
    }),
    {
      name: 'blueprint-theme-storage',
      // Only persist specific values
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        themeMode: state.themeMode,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
      }),
    }
  )
)

// Optional: Hook to sync with system theme
export const useSystemThemeSync = () => {
  const setTheme = useThemeStore(state => state.setTheme)
  const themeMode = useThemeStore(state => state.themeMode)

  React.useEffect(() => {
    // Only run if following system theme
    if (themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      useThemeStore.setState({ 
        systemTheme: e.matches ? 'dark' : 'light',
        isDarkMode: e.matches
      })
    }

    // Initial check
    updateSystemTheme(mediaQuery)

    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [themeMode])
}