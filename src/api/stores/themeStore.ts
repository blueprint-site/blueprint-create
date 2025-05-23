import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  systemTheme: 'dark' | 'light' | null;
  themeMode: 'system' | 'dark' | 'light';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  reducedMotion: boolean;
  highContrast: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'system' | 'dark' | 'light') => void;
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  syncWithSystemTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const updateHtmlClass = (theme: 'system' | 'dark' | 'light') => {
        const htmlEl = document.documentElement;
        if (theme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          htmlEl.classList.toggle('dark', systemPrefersDark);
        } else {
          htmlEl.classList.toggle('dark', theme === 'dark');
        }
      };

      return {
        isDarkMode: false,
        systemTheme: null,
        themeMode: 'system',
        fontSize: 'base',
        reducedMotion: false,
        highContrast: false,

        toggleTheme: () => {
          const currentMode = get().themeMode;
          if (currentMode === 'system') {
            const newMode = get().systemTheme === 'dark' ? 'light' : 'dark';
            set({ themeMode: newMode, isDarkMode: newMode === 'dark' });
            updateHtmlClass(newMode);
          } else {
            const newMode = currentMode === 'dark' ? 'light' : 'dark';
            set({ themeMode: newMode, isDarkMode: newMode === 'dark' });
            updateHtmlClass(newMode);
          }
        },

        setTheme: (theme) => {
          if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            set({
              themeMode: 'system',
              isDarkMode: systemPrefersDark,
            });
          } else {
            set({
              themeMode: theme,
              isDarkMode: theme === 'dark',
            });
          }
          updateHtmlClass(theme);
        },

        setFontSize: (size) => set({ fontSize: size }),

        toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),

        toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),

        syncWithSystemTheme: () => {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({
            systemTheme: systemPrefersDark ? 'dark' : 'light',
          });
          if (get().themeMode === 'system') {
            set({ isDarkMode: systemPrefersDark });
            updateHtmlClass('system');
          }
        },
      };
    },
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
);

// Listen for system theme changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', () => useThemeStore.getState().syncWithSystemTheme());

// Initialize theme on load
// Ensure stored theme is applied on page load
const { themeMode, syncWithSystemTheme, setTheme } = useThemeStore.getState();

if (themeMode === 'system') {
  syncWithSystemTheme(); // Apply system theme correctly
} else {
  setTheme(themeMode); // Apply stored theme
}
