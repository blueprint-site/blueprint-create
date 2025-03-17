import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Define supported language codes as a type
type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'it' | 'id' | 'zh' | 'ar' | 'pt' | 'ja' | 'ru';

type Direction = 'up' | 'down';

// Flag icons mapping with proper typing
const languageFlags: Record<LanguageCode, string> = {
  en: 'en',
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
};

interface LanguageSwitcherProps {
  className?: string;
  direction?: Direction;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  direction = 'down',
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    (i18n.language as LanguageCode) || 'en'
  );

  useEffect(() => {
    const language = i18n.language as string;
    const validLanguage = Object.keys(languageNames).includes(language)
      ? (language as LanguageCode)
      : 'en';

    setCurrentLanguage(validLanguage);
    document.documentElement.dir = validLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const changeLanguage = (language: LanguageCode): void => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    setIsOpen(false);
    localStorage.setItem('preferred-language', language);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Language selector button */}
      <button
        className='flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <span>{languageFlags[currentLanguage]}</span>
        <span>{languageNames[currentLanguage]}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`ring-opacity-5 absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800 ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          <div className='py-1' role='listbox'>
            {(Object.keys(languageNames) as Array<LanguageCode>).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentLanguage === lang ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                role='option'
                aria-selected={currentLanguage === lang}
              >
                <span className='mr-2'>{languageFlags[lang]}</span>
                <span>{languageNames[lang]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
