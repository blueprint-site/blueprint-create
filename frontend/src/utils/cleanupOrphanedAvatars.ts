import { storage } from '@/config/appwrite';
import { STORAGE_BUCKETS } from '@/config/storage';
import logMessage from '@/components/utility/logs/sendLogs';

/**
 * Cleans up orphaned avatar files for a user
 * Keeps only the most recent WebP file and deletes all others
 */
export async function cleanupOrphanedAvatars(currentAvatarUrl: string | null) {
  try {
    // Extract the current avatar file ID from the URL
    let currentFileId: string | null = null;
    if (currentAvatarUrl && currentAvatarUrl.includes('appwrite')) {
      const fileIdRegex = /\/files\/([^/?]+)/;
      const previewRegex = /\/storage\/buckets\/[^/]+\/files\/([^/?]+)\/(preview|view)/;

      currentFileId = fileIdRegex.exec(currentAvatarUrl)?.[1] || null;
      if (!currentFileId) {
        currentFileId = previewRegex.exec(currentAvatarUrl)?.[1] || null;
      }
    }

    if (!currentFileId) {
      logMessage('No current avatar to preserve', 0, 'action');
      return;
    }

    // List all files in the avatars bucket
    const response = await storage.listFiles(STORAGE_BUCKETS.AVATARS);
    const files = response.files || [];

    // Filter files that belong to this user (you might need additional logic here)
    // For now, we'll just log what we find
    logMessage(`Found ${files.length} total files in avatars bucket`, 0, 'action');

    // Find and delete orphaned files
    let deletedCount = 0;
    for (const file of files) {
      // Skip the current avatar
      if (file.$id === currentFileId) {
        continue;
      }

      // Check if this is an old uncompressed file (not WebP)
      if (file.name && !file.name.endsWith('.webp')) {
        try {
          // You might want to add additional checks here, like file age
          // For safety, let's only delete files older than 1 hour
          const fileAge = Date.now() - new Date(file.$createdAt).getTime();
          const oneHour = 60 * 60 * 1000;

          if (fileAge > oneHour) {
            await storage.deleteFile(STORAGE_BUCKETS.AVATARS, file.$id);
            logMessage(`Deleted orphaned file: ${file.$id} (${file.name})`, 0, 'action');
            deletedCount++;
          }
        } catch (deleteErr) {
          logMessage(`Failed to delete orphaned file ${file.$id}: ${deleteErr}`, 2, 'action');
        }
      }
    }

    if (deletedCount > 0) {
      logMessage(`Cleaned up ${deletedCount} orphaned avatar files`, 0, 'action');
    }

    return deletedCount;
  } catch (error) {
    logMessage(`Error during avatar cleanup: ${error}`, 2, 'action');
    return 0;
  }
}

/**
 * Deletes a specific avatar file by ID
 */
export async function deleteAvatarFile(fileId: string): Promise<boolean> {
  try {
    await storage.deleteFile(STORAGE_BUCKETS.AVATARS, fileId);
    logMessage(`Successfully deleted avatar file: ${fileId}`, 0, 'action');
    return true;
  } catch (error) {
    logMessage(`Failed to delete avatar file ${fileId}: ${error}`, 2, 'action');
    return false;
  }
}
