// Utility to update existing badges with icon URLs
import { databases } from '@/config/appwrite';
import { defaultBadgeImages } from '@/config/defaultBadges';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'badges';

export const updateBadgesWithIcons = async () => {
  try {
    // Get all badges
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const badges = response.documents;
    
    console.log(`Found ${badges.length} badges to update`);
    
    // Update each badge with an appropriate icon URL
    for (const badge of badges) {
      // Skip if badge already has an iconUrl
      if (badge.iconUrl) {
        console.log(`Badge "${badge.name}" already has an icon URL, skipping...`);
        continue;
      }
      
      // Determine which icon to use based on badge name
      let iconUrl = defaultBadgeImages.default;
      
      const nameLower = badge.name.toLowerCase();
      if (nameLower.includes('download') || nameLower.includes('downloader')) {
        iconUrl = defaultBadgeImages.popularCreator;
      } else if (nameLower.includes('first') || nameLower.includes('starter')) {
        iconUrl = defaultBadgeImages.firstSchematic;
      } else if (nameLower.includes('veteran') || nameLower.includes('experience')) {
        iconUrl = defaultBadgeImages.veteran;
      } else if (nameLower.includes('quality') || nameLower.includes('master')) {
        iconUrl = defaultBadgeImages.qualityBuilder;
      } else if (nameLower.includes('community') || nameLower.includes('helpful')) {
        iconUrl = defaultBadgeImages.helpfulContributor;
      } else if (nameLower.includes('viral') || nameLower.includes('popular')) {
        iconUrl = defaultBadgeImages.viralHit;
      }
      
      // Update the badge with the icon URL
      try {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          badge.$id,
          { iconUrl }
        );
        console.log(`Updated badge "${badge.name}" with icon URL`);
      } catch (error) {
        console.error(`Failed to update badge "${badge.name}":`, error);
      }
    }
    
    console.log('Badge icon update complete!');
    return true;
  } catch (error) {
    console.error('Error updating badges:', error);
    return false;
  }
};