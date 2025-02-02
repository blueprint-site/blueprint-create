// src/config/i18n.ts
import Translations from '@/assets/translations.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Translations,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  }).then();

export default i18n;