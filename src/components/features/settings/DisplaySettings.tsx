import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useThemeStore } from '@/api/stores/themeStore';
import { Moon, Sun } from 'lucide-react';
import EasterEggsSettings from './EasterEggSettings';
import { useTranslation } from 'react-i18next';

export default function DisplaySettings() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-6 text-2xl font-bold'>{t('settings.user-settings.display.title')}</h2>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          {isDarkMode ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
          <div className='text-lg font-semibold'>
            {t('settings.user-settings.display.theme.title')}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Switch id='theme-toggle' checked={isDarkMode} onCheckedChange={toggleTheme} />
          <Label htmlFor='theme-toggle'>
            {isDarkMode
              ? t('settings.user-settings.display.theme.dark-mode')
              : t('settings.user-settings.display.theme.light-mode')}
          </Label>
        </div>

        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.display.theme.description')}
        </p>
      </div>

      <EasterEggsSettings />
    </div>
  );
}
