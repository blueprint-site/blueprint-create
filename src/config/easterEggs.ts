// src/config/easterEggs.ts
import { EasterEggDefinition } from '@/schemas/user.schema';
import i18next from 'i18next';

/**
 * Configuration for all available Easter eggs in the application
 */
export const EASTER_EGGS: EasterEggDefinition[] = [
  {
    id: 'legacyLogo',
    name: i18next.t('easter-eggs.legacyLogo.name'),
    description: i18next.t('easter-eggs.legacyLogo.description'),
    discoveryHint: i18next.t('easter-eggs.legacyLogo.hint'),
  },
];

/**
 * Gets Easter egg definition by its ID
 */
export function getEasterEggById(id: string): EasterEggDefinition | undefined {
  return EASTER_EGGS.find((egg) => egg.id === id);
}

/**
 * Default settings for new users
 */
export const DEFAULT_EASTER_EGGS = {
  discovered: [],
  enabled: {},
};
