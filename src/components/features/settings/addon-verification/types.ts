import type { Addon } from '@/types';

/**
 * Supported platform types for addon verification
 */
export type VerificationPlatform = 'modrinth' | 'curseforge' | null;

/**
 * Common props for all verification steps
 */
export interface StepProps {
  next: () => void;
  back: () => void;
}

/**
 * Props for the platform selection step
 */
export interface PlatformSelectionProps {
  selectPlatform: (platform: VerificationPlatform) => void;
  next: () => void;
}

/**
 * Props for the Modrinth auth token step
 */
export interface ModrinthAuthProps extends StepProps {
  modrinthToken: string;
  setModrinthToken: (token: string) => void;
}

/**
 * Props for the Modrinth profile confirmation step
 */
export interface ModrinthProfileProps extends StepProps {
  modrinthToken: string | null;
}

/**
 * Props for the Modrinth addon validation step
 */
export interface ModrinthValidationProps extends StepProps {
  modrinthToken: string | null;
  selectedAddonSlugs: string[];
  setSelectedAddonSlugs: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Props for the confirmation step
 */
export interface ConfirmationProps extends StepProps {
  selectedAddonSlugs: string[];
}

/**
 * Props for the final push changes step
 */
export interface PushChangesProps {
  back: () => void;
  selectedAddonSlugs: string[];
}

/**
 * Props for the addon fetcher component
 */
export interface AddonFetcherProps {
  slug: string;
  onAddonFetched: (addon: Addon) => void;
}
