// Default badge configurations with sample image URLs
export const defaultBadgeImages = {
  // Achievement badges
  firstSchematic: 'https://img.icons8.com/fluency/96/medal.png',
  schematicMaster: 'https://img.icons8.com/fluency/96/trophy.png',
  
  // Download milestones
  popularCreator: 'https://img.icons8.com/fluency/96/star.png',
  viralHit: 'https://img.icons8.com/fluency/96/fire.png',
  
  // Community badges
  helpfulContributor: 'https://img.icons8.com/fluency/96/handshake.png',
  activeCommunity: 'https://img.icons8.com/fluency/96/chat.png',
  
  // Quality badges
  qualityBuilder: 'https://img.icons8.com/fluency/96/diamond.png',
  detailOriented: 'https://img.icons8.com/fluency/96/focus.png',
  
  // Time-based badges
  earlyAdopter: 'https://img.icons8.com/fluency/96/sunrise.png',
  veteran: 'https://img.icons8.com/fluency/96/shield.png',
  
  // Special badges
  staffPick: 'https://img.icons8.com/fluency/96/certificate.png',
  verified: 'https://img.icons8.com/fluency/96/checkmark.png',
  premium: 'https://img.icons8.com/fluency/96/crown.png',
  
  // Milestone badges
  milestone10: 'https://img.icons8.com/fluency/96/10.png',
  milestone50: 'https://img.icons8.com/fluency/96/50.png',
  milestone100: 'https://img.icons8.com/fluency/96/100.png',
  
  // Default fallback
  default: 'https://img.icons8.com/fluency/96/prize.png',
};

// Badge templates for quick creation
export const badgeTemplates = [
  {
    name: 'First Upload',
    description: 'Awarded for uploading your first schematic',
    iconUrl: defaultBadgeImages.firstSchematic,
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    borderColor: '#2563eb',
    shape: 'circle',
    hasGlow: true,
    isAnimated: false,
    rarity: 'common',
    tier: 'common',
    isActive: true,
  },
  {
    name: 'Popular Creator',
    description: 'Your content has received over 100 downloads',
    iconUrl: defaultBadgeImages.popularCreator,
    backgroundColor: '#f59e0b',
    textColor: '#ffffff',
    borderColor: '#d97706',
    shape: 'star',
    hasGlow: true,
    isAnimated: true,
    rarity: 'rare',
    tier: 'rare',
    isActive: true,
  },
  {
    name: 'Quality Builder',
    description: 'Consistently high-rated content creator',
    iconUrl: defaultBadgeImages.qualityBuilder,
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    borderColor: '#7c3aed',
    shape: 'hexagon',
    hasGlow: true,
    isAnimated: false,
    rarity: 'epic',
    tier: 'epic',
    isActive: true,
  },
  {
    name: 'Veteran',
    description: 'Active member for over 1 year',
    iconUrl: defaultBadgeImages.veteran,
    backgroundColor: '#ef4444',
    textColor: '#ffffff',
    borderColor: '#dc2626',
    shape: 'shield',
    hasGlow: true,
    isAnimated: true,
    rarity: 'legendary',
    tier: 'legendary',
    isActive: true,
  },
];