import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/config/utils.ts';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define supported language codes as a type
type LanguageCode =
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'it'
  | 'id'
  | 'zh'
  | 'ar'
  | 'pt'
  | 'ja'
  | 'ru'
  | 'uk'
  | 'pl';

// Flag icons mapping with proper typing
const languageFlags: Record<LanguageCode, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  id: '🇮🇩',
  zh: '🇨🇳',
  ar: '🇸🇦',
  pt: '🇵🇹',
  ja: '🇯🇵',
  ru: '🇷🇺',
  pl: '🇵🇱',
  uk: '🇺🇦',
};

// Language names in their native form
const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  id: 'Bahasa Indonesia',
  zh: '中文',
  ar: 'العربية',
  pt: 'Português',
  ja: '日本語',
  ru: 'Русский',
  pl: 'Polski',
  uk: 'Українська',
};

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    (i18n.language as LanguageCode) || 'en'
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const language = i18n.language as string;
    const validLanguage = Object.keys(languageNames).includes(language)
      ? (language as LanguageCode)
      : 'en';

    setCurrentLanguage(validLanguage);
    document.documentElement.dir = validLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const changeLanguage = (language: string): void => {
    const lang = language as LanguageCode;
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const languages = Object.keys(languageNames) as Array<LanguageCode>;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-48 justify-between'
          >
            <div className='flex items-center space-x-2'>
              <span>{languageFlags[currentLanguage]}</span>
              <span>{languageNames[currentLanguage]}</span>
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-48 p-0'>
          <Command>
            <CommandInput placeholder='Search language...' className='h-9' />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((lang) => (
                  <CommandItem
                    key={lang}
                    value={lang}
                    onSelect={(currentValue) => {
                      changeLanguage(currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center space-x-2'>
                      <span>{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        currentLanguage === lang ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSwitcher;
