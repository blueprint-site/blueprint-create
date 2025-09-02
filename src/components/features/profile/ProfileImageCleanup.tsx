import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { storage } from '@/config/appwrite';
import { STORAGE_BUCKETS } from '@/config/storage';
import logMessage from '@/components/utility/logs/sendLogs';

interface ProfileImageCleanupProps {
  currentAvatarUrl?: string;
}

export default function ProfileImageCleanup({ currentAvatarUrl }: ProfileImageCleanupProps) {
  const [isCleaningUp, setIsCleaningUp] = React.useState(false);

  const cleanupOrphanedFiles = async () => {
    setIsCleaningUp(true);
    
    try {
      // Extract current avatar ID
      let currentFileId: string | null = null;
      if (currentAvatarUrl && currentAvatarUrl.includes('appwrite')) {
        const patterns = [
          /\/files\/([a-zA-Z0-9]+)\/preview/,
          /\/files\/([a-zA-Z0-9]+)\/view/,
          /\/files\/([a-zA-Z0-9]+)/
        ];
        
        for (const pattern of patterns) {
          const match = pattern.exec(currentAvatarUrl);
          if (match && match[1]) {
            currentFileId = match[1];
            break;
          }
        }
      }
      
      logMessage(`Starting cleanup. Current avatar ID: ${currentFileId || 'none'}`, 0, 'action');
      
      // List all files in avatars bucket
      const response = await storage.listFiles(STORAGE_BUCKETS.AVATARS);
      const files = response.files || [];
      
      logMessage(`Found ${files.length} files in avatars bucket`, 0, 'action');
      
      let deletedCount = 0;
      let skippedCount = 0;
      
      for (const file of files) {
        // Skip the current avatar
        if (file.$id === currentFileId) {
          logMessage(`Skipping current avatar: ${file.$id}`, 0, 'action');
          skippedCount++;
          continue;
        }
        
        // Delete any file that's not the current avatar
        // You might want to add additional checks here like:
        // - Only delete files older than X hours
        // - Only delete non-WebP files (uncompressed originals)
        // - Check if file belongs to current user (if you track that)
        
        try {
          logMessage(`Deleting orphaned file: ${file.$id} (${file.name})`, 0, 'action');
          await storage.deleteFile(STORAGE_BUCKETS.AVATARS, file.$id);
          deletedCount++;
        } catch (error) {
          logMessage(`Failed to delete ${file.$id}: ${error instanceof Error ? error.message : 'Unknown error'}`, 2, 'action');
        }
      }
      
      logMessage(`Cleanup complete: Deleted ${deletedCount} files, skipped ${skippedCount}`, 0, 'action');
      alert(`Cleanup complete!\nDeleted ${deletedCount} orphaned files\nSkipped ${skippedCount} files`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logMessage(`Cleanup failed: ${errorMessage}`, 3, 'action');
      alert(`Cleanup failed: ${errorMessage}`);
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
      <Trash2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <span className="text-sm text-yellow-800 dark:text-yellow-200">
        Clean up orphaned avatar files
      </span>
      <Button
        size="sm"
        variant="destructive"
        onClick={cleanupOrphanedFiles}
        disabled={isCleaningUp}
      >
        {isCleaningUp ? 'Cleaning...' : 'Clean Up'}
      </Button>
    </div>
  );
}