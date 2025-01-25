// src/stores/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
 isDarkMode: boolean
 systemTheme: 'dark' | 'light' | null
 themeMode: 'system' | 'dark' | 'light'
 fontSize: 'sm' | 'base' | 'lg' | 'xl'
 reducedMotion: boolean
 highContrast: boolean
 toggleTheme: () => void
 setTheme: (theme: 'system' | 'dark' | 'light') => void
 setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void
 toggleReducedMotion: () => void
 toggleHighContrast: () => void
}

export const useThemeStore = create<ThemeState>()(
 persist(
   (set, get) => ({
     isDarkMode: false,
     systemTheme: null, 
     themeMode: 'system',
     fontSize: 'base',
     reducedMotion: false,
     highContrast: false,

     toggleTheme: () => {
       const currentMode = get().themeMode
       if (currentMode === 'system') {
         const newMode = get().systemTheme === 'dark' ? 'light' : 'dark'
         set({ themeMode: newMode, isDarkMode: newMode === 'dark' })
       } else {
         set(state => ({ 
           isDarkMode: !state.isDarkMode,
           themeMode: !state.isDarkMode ? 'dark' : 'light' 
         }))
       }
     },

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

     setFontSize: (size) => set({ fontSize: size }),

     toggleReducedMotion: () => set(state => ({ 
       reducedMotion: !state.reducedMotion 
     })),
     
     toggleHighContrast: () => set(state => ({ 
       highContrast: !state.highContrast 
     })),
   }),
   {
     name: 'blueprint-theme-storage',
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