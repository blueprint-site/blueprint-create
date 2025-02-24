import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useThemeStore } from '@/api/stores/themeStore.tsx';
import { Moon, Sun } from 'lucide-react';

export default function DisplaySettings() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-6 text-2xl font-bold'>Display Settings</h2>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          {isDarkMode ? (
            <Moon className='h-5 w-5' />
          ) : (
            <Sun className='h-5 w-5' />
          )}
          <div className='text-lg font-semibold'>Theme</div>
        </div>

        <div className='flex items-center gap-4'>
          <Switch
            id='theme-toggle'
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
          />
          <Label htmlFor='theme-toggle'>
            {isDarkMode ? 'Dark mode' : 'Light mode'}
          </Label>
        </div>

        <p className='text-foreground-muted text-sm'>
          Choose between light and dark mode for the site interface.
        </p>
      </div>
    </div>
  );
}
