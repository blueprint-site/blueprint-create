import { transliterate } from 'transliteration'; // A library for transliterating non-English characters

export function generateSlug(text: string): string {
  return transliterate(text) // Transliterate non-English characters
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}