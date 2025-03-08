// src/config/easterEggs.ts
import { EasterEggDefinition } from '@/schemas/user.schema';

/**
 * Configuration for all available easter eggs in the application
 */
export const EASTER_EGGS: EasterEggDefinition[] = [
  {
    id: 'legacyLogo',
    name: 'Legacy Logo',
    description: 'Replaces the current Blueprint logo with the classic legacy logo.',
    discoveryHint: 'Try clicking on things that represent our identity.',
  },
  // Add more easter eggs here in the future
  // Example:
  // {
  //   id: 'pixelCursor',
  //   name: 'Pixel Cursor',
  //   description: 'Changes your cursor to a Minecraft-style pixelated cursor.',
  //   discoveryHint: 'Dig around the features that let you build things.',
  // },
];

/**
 * Gets easter egg definition by its ID
 */
export function getEasterEggById(id: string): EasterEggDefinition | undefined {
  return EASTER_EGGS.find(egg => egg.id === id);
}

/**
 * Default settings for new users
 */
export const DEFAULT_EASTER_EGGS = {
  discovered: [],
  enabled: {}
};