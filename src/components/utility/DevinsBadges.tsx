

// Define the available badge types as const to enable type inference
const BADGE_TYPES = {
  cozy: {
    recommendedHeight: 56, // Default SVG height
    heightRange: { min: 48, max: 64 },
  },
  'cozy-minimal': {
    recommendedHeight: 56,
    heightRange: { min: 48, max: 64 },
  },
  compact: {
    recommendedHeight: 40,
    heightRange: { min: 32, max: 46 },
  },
  'compact-minimal': {
    recommendedHeight: 40,
    heightRange: { min: 32, max: 46 },
  },
} as const;

// Badge categories with descriptions for better DX
const BADGE_CATEGORIES = {
  available: 'Places where your project may be available on',
  'built-with': 'Tools and software used to build your project',
  documentation: 'Places where documentation can be found',
  donate: 'Donation and subscription platforms',
  requires: 'Required tools and software for your project',
  social: 'Social platforms and communities',
  supported: 'Platforms/software supported by your project',
  unsupported: 'Platforms/software not supported by your project',
  translate: 'Translation platforms and resources',
  custom: 'Custom badge',
} as const;

interface DevinsBadgesProps {
  /** Badge style type */
  type: keyof typeof BADGE_TYPES;

  /** Badge category */
  category: keyof typeof BADGE_CATEGORIES;

  /** Badge name/identifier */
  name: string;

  /** Optional custom height (must be within type's recommended range) */
  height?: number;

  /** Image format - SVG recommended for better quality */
  format: 'svg' | 'png';

  /** Optional className for the image wrapper */
  className?: string;

  /** Custom badge URL (required if category is 'custom') */
  customBadgeUrl?: string;
}

const DevinsBadges = ({
                        type,
                        category,
                        name,
                        height,
                        format = 'svg',
                        className,
                        customBadgeUrl,
                      }: DevinsBadgesProps) => {
  // Get badge type configuration
  const typeConfig = BADGE_TYPES[type];

  // Validate and normalize height
  const finalHeight = height
      ? Math.min(Math.max(height, typeConfig.heightRange.min), typeConfig.heightRange.max)
      : typeConfig.recommendedHeight;

  let badgeSrc = '';

  if (category === 'custom') {
    if (!customBadgeUrl) {
      console.error('Custom badge URL is required when category is "custom"');
      return null; // Or display a placeholder image
    }
    badgeSrc = customBadgeUrl;
  } else {
    // Construct badge URL
    badgeSrc = `https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/${type}/${category}/${name}${
        format === 'png' ? `_${finalHeight}h` : format === 'svg' ? '_vector' : ''
    }.${format}`;
  }

  return (
      <img
          loading='lazy'
          src={badgeSrc}
          alt={`${name} badge`}
          className={className}
          height={finalHeight}
      />
  );
};

export default DevinsBadges;

// Export type helpers for better DX
export type BadgeType = keyof typeof BADGE_TYPES;
export type BadgeCategory = keyof typeof BADGE_CATEGORIES;
