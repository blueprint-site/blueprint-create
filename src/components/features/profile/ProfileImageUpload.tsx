import React, { useCallback, useState, useEffect } from 'react';
import { Upload, User2, Gamepad2, Check, AlertCircle, Loader2, ImageIcon, Leaf } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { cn } from '@/config/utils';
import { storage } from '@/config/appwrite.ts';
import { STORAGE_BUCKETS } from '@/config/storage.ts';
import { Functions, ID } from 'appwrite';
import { useUserStore } from '@/api/stores/userStore';
import logMessage from '@/components/utility/logs/sendLogs.tsx';
import { client } from '@/config/appwrite.ts';
import { formatEcoToast, getCompressionLoadingMessage } from '@/utils/ecoFacts';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
  disabled?: boolean;
}

interface UploadStatus {
  stage: 'idle' | 'uploading' | 'compressing' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
  details?: {
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: string;
  };
}

export default function ProfileImageUpload({ 
  currentAvatar, 
  onAvatarChange, 
  disabled = false 
}: ProfileImageUploadProps) {
  // Get current avatar directly from user store for most up-to-date value
  const preferences = useUserStore((state) => state.preferences);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [isLoadingMinecraft, setIsLoadingMinecraft] = useState(false);

  const resetUploadStatus = useCallback(() => {
    setTimeout(() => {
      setUploadStatus({
        stage: 'idle',
        progress: 0,
        message: ''
      });
    }, 3000);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    // Store old avatar ID for cleanup later
    let oldAvatarId: string | null = null;
    
    // Get the most current avatar URL from store
    const storeAvatarUrl = preferences?.avatar || '';
    const avatarUrlToCheck = storeAvatarUrl || currentAvatar || '';
    
    // Check if it's an Appwrite storage URL (either contains 'appwrite' or our API domain)
    const isAppwriteUrl = avatarUrlToCheck && (
      avatarUrlToCheck.includes('appwrite') || 
      avatarUrlToCheck.includes('api.blueprint-create.com')
    );
    
    // Debug: Log the current avatar info
    logMessage(`🔍 DEBUG: Starting upload with currentAvatar prop: "${currentAvatar}"`, 0, 'debug');
    logMessage(`🔍 DEBUG: Store avatar URL: "${storeAvatarUrl}"`, 0, 'debug');
    logMessage(`🔍 DEBUG: Final avatarUrlToCheck: "${avatarUrlToCheck}"`, 0, 'debug');
    logMessage(`🔍 DEBUG: avatarUrlToCheck includes 'appwrite': ${avatarUrlToCheck?.includes('appwrite')}`, 0, 'debug');
    logMessage(`🔍 DEBUG: avatarUrlToCheck includes 'api.blueprint-create.com': ${avatarUrlToCheck?.includes('api.blueprint-create.com')}`, 0, 'debug');
    logMessage(`🔍 DEBUG: isAppwriteUrl: ${isAppwriteUrl}`, 0, 'debug');
    
    if (isAppwriteUrl) {
      logMessage(`📸 Current avatar URL detected: ${avatarUrlToCheck}`, 0, 'action');
      
      // Try different patterns to extract file ID
      // Updated patterns to handle query parameters properly
      const patterns = [
        // Main patterns - handle query params with non-greedy match
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/,
        // Legacy patterns
        /\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
        /\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
        /\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/
      ];
      
      // Log each pattern attempt for debugging
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = pattern.exec(avatarUrlToCheck);
        logMessage(`Pattern ${i + 1}: ${pattern.source} - Match: ${match ? match[1] : 'no match'}`, 0, 'debug');
        if (match && match[1]) {
          oldAvatarId = match[1];
          logMessage(`✓ Extracted old avatar ID: ${oldAvatarId} using pattern ${i + 1}`, 0, 'action');
          break;
        }
      }
      
      if (!oldAvatarId) {
        logMessage(`❌ Could not extract file ID from URL: ${avatarUrlToCheck}`, 3, 'action');
        // Try a simpler extraction as last resort
        const simpleMatch = avatarUrlToCheck.match(/files\/([a-zA-Z0-9]+)/);
        if (simpleMatch && simpleMatch[1]) {
          oldAvatarId = simpleMatch[1];
          logMessage(`✓ Extracted using simple pattern: ${oldAvatarId}`, 0, 'action');
        }
      }
    }

    try {

      // Stage 1: Upload original image
      setUploadStatus({
        stage: 'uploading',
        progress: 20,
        message: 'Uploading image...'
      });

      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKETS.AVATARS,
        fileId,
        file
      );

      logMessage(`Original image uploaded: ${uploadedFile.$id}`, 0, 'action');

      // Stage 2: Compress image
      setUploadStatus({
        stage: 'compressing',
        progress: 50,
        message: getCompressionLoadingMessage()
      });

      const functionsClient = new Functions(client);
      const execution = await functionsClient.createExecution(
        'image-compressor',
        JSON.stringify({
          bucketId: STORAGE_BUCKETS.AVATARS,
          fileId: uploadedFile.$id,
          quality: 90,
          width: 500,
          height: 500,
          preserveOriginal: false  // This should delete the original after compression
        })
      );

      // Wait for execution to complete
      let attempts = 0;
      let executionResult = execution;
      
      while (executionResult.status === 'waiting' || executionResult.status === 'processing') {
        if (attempts > 30) {
          throw new Error('Image compression timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const functionsClient = new Functions(client);
        executionResult = await functionsClient.getExecution(
          'image-compressor',
          executionResult.$id
        );
        
        attempts++;
        
        setUploadStatus(prev => ({
          ...prev,
          progress: Math.min(50 + (attempts * 1.5), 80),
          message: `Processing image... (${attempts}s)`
        }));
      }

      if (executionResult.status !== 'completed') {
        throw new Error(`Compression failed: ${executionResult.responseBody || 'Unknown error'}`);
      }

      const result = JSON.parse(executionResult.responseBody);
      
      if (!result.success && !result.uploadFailed) {
        throw new Error(result.error || 'Compression failed');
      }

      // Handle case where compression succeeded but upload failed
      let compressedFileId = result.compressed.id;
      let originalDeleted = false;
      
      if (result.uploadFailed && result.compressed.base64) {
        logMessage('Compression succeeded but upload failed, uploading from client...', 1, 'action');
        
        // Convert base64 back to blob and upload from client
        const base64Response = await fetch(`data:image/webp;base64,${result.compressed.base64}`);
        const blob = await base64Response.blob();
        const file = new File([blob], result.compressed.name, { type: 'image/webp' });
        
        const uploadedCompressedFile = await storage.createFile(
          STORAGE_BUCKETS.AVATARS,
          ID.unique(),
          file
        );
        
        compressedFileId = uploadedCompressedFile.$id;
        logMessage(`Client-side upload completed: ${compressedFileId}`, 0, 'action');
        
        // Now delete the original file that we uploaded initially
        try {
          await storage.deleteFile(STORAGE_BUCKETS.AVATARS, uploadedFile.$id);
          logMessage(`Deleted original uncompressed file: ${uploadedFile.$id}`, 0, 'action');
          originalDeleted = true;
        } catch (deleteErr) {
          logMessage(`Failed to delete original file: ${deleteErr}`, 2, 'action');
        }
      } else {
        logMessage(`Image compressed: ${compressedFileId}`, 0, 'action');
        originalDeleted = result.original.deleted;
      }
      
      // Log if original wasn't deleted
      if (!originalDeleted) {
        logMessage(`Warning: Original file ${uploadedFile.$id} may still exist`, 1, 'action');
      }

      // Stage 3: Save and cleanup
      setUploadStatus({
        stage: 'saving',
        progress: 90,
        message: 'Saving compressed image...',
        details: {
          originalSize: result.original.size,
          compressedSize: result.compressed.size,
          compressionRatio: result.stats.compressionRatio
        }
      });

      // Generate new avatar URL
      const avatarUrl = storage.getFilePreview(
        STORAGE_BUCKETS.AVATARS, 
        compressedFileId
      ).toString();

      // Stage 4: Complete
      setUploadStatus({
        stage: 'complete',
        progress: 100,
        message: `Image compressed successfully! Saved ${result.stats.compressionRatio} space`,
        details: {
          originalSize: result.original.size,
          compressedSize: result.compressed.size,
          compressionRatio: result.stats.compressionRatio
        }
      });

      // Show eco-friendly toast
      const ecoMessage = formatEcoToast(
        result.original.size || file.size,
        result.compressed.size || 0
      );
      toast.success(ecoMessage.title, {
        description: ecoMessage.description,
        duration: 8000,
        icon: <Leaf className="text-green-500" />
      });

      // Update avatar URL first
      onAvatarChange(avatarUrl);
      
      // Debug: Log before deletion attempt
      logMessage(`🔍 DEBUG: About to check for old avatar deletion. oldAvatarId: "${oldAvatarId}"`, 0, 'debug');
      logMessage(`🔍 DEBUG: compressedFileId: "${compressedFileId}"`, 0, 'debug');
      
      // Now delete the old avatar after successful upload
      if (oldAvatarId) {
        if (oldAvatarId === compressedFileId) {
          logMessage(`Skipping deletion - old and new IDs are the same: ${oldAvatarId}`, 1, 'action');
        } else {
          logMessage(`🗑️ Attempting to delete old avatar: ${oldAvatarId} from bucket: ${STORAGE_BUCKETS.AVATARS}`, 0, 'action');
          
          // First verify the file exists before attempting deletion
          try {
            const existingFile = await storage.getFile(STORAGE_BUCKETS.AVATARS, oldAvatarId);
            logMessage(`✓ Old avatar file exists: ${existingFile.name} (${existingFile.sizeOriginal} bytes)`, 0, 'action');
          } catch (checkError: unknown) {
            const errorMessage = checkError instanceof Error ? checkError.message : String(checkError);
            logMessage(`ℹ️ Old avatar file doesn't exist or can't be accessed: ${errorMessage}`, 1, 'action');
            if (errorMessage.includes('404') || errorMessage.includes('not found')) {
              logMessage(`Old avatar ${oldAvatarId} was already deleted`, 1, 'action');
              return; // Skip deletion attempt
            }
          }
          
          try {
            logMessage(`🔥 Executing deletion: storage.deleteFile("${STORAGE_BUCKETS.AVATARS}", "${oldAvatarId}")`, 0, 'debug');
            const deleteResult = await storage.deleteFile(STORAGE_BUCKETS.AVATARS, oldAvatarId);
            logMessage(`✅ Successfully deleted old avatar: ${oldAvatarId}`, 0, 'action');
            logMessage(`Delete result: ${JSON.stringify(deleteResult)}`, 0, 'debug');
            toast.success('Previous avatar removed successfully', { duration: 3000 });
          } catch (deleteError: unknown) {
            const error = deleteError as { message?: string; code?: number; type?: string };
            const errorMessage = error?.message || String(deleteError) || 'Unknown error';
            const errorCode = error?.code || 'unknown';
            const errorType = error?.type || 'unknown';
            
            logMessage(`❌ Failed to delete old avatar ${oldAvatarId}: ${errorMessage} (code: ${errorCode}, type: ${errorType})`, 3, 'action');
            
            // If it's a 404, the file doesn't exist anymore
            if (errorMessage.includes('404') || errorMessage.includes('not found') || errorCode === 404) {
              logMessage(`ℹ️ Old avatar ${oldAvatarId} was already deleted or doesn't exist`, 1, 'action');
              toast.info('Previous avatar was already removed', { duration: 2000 });
            } else {
              // Log the full error for debugging
              console.error('Avatar deletion error details:', {
                error: deleteError,
                message: errorMessage,
                code: errorCode,
                type: errorType,
                fileId: oldAvatarId,
                bucketId: STORAGE_BUCKETS.AVATARS
              });
              toast.error(`Could not remove previous avatar: ${errorMessage}`, { duration: 5000 });
            }
          }
        }
      } else {
        logMessage('⚠️ No old avatar ID found to delete', 1, 'action');
        logMessage(`🔍 DEBUG: Why no deletion? avatarUrlToCheck: "${avatarUrlToCheck}"`, 0, 'debug');
        logMessage(`🔍 DEBUG: isAppwriteUrl: ${isAppwriteUrl}`, 0, 'debug');
      }
      
      resetUploadStatus();

    } catch (error) {
      logMessage(`Avatar upload error: ${error}`, 3, 'action');
      setUploadStatus({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Failed to upload image'
      });
      resetUploadStatus();
    }
  }, [currentAvatar, preferences, onAvatarChange, resetUploadStatus]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB for processing)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        stage: 'error',
        progress: 0,
        message: 'File size must be less than 10MB'
      });
      resetUploadStatus();
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus({
        stage: 'error',
        progress: 0,
        message: 'Please select a valid image file'
      });
      resetUploadStatus();
      return;
    }

    await handleImageUpload(file);
  }, [handleImageUpload, resetUploadStatus]);

  const handleMinecraftAvatar = useCallback(async () => {
    if (!minecraftUsername.trim()) return;

    try {
      setIsLoadingMinecraft(true);
      
      const avatarUrl = `https://minotar.net/helm/${minecraftUsername}/500`;
      
      const testImage = new Image();
      testImage.onload = async () => {
        logMessage(`Minecraft avatar set: ${avatarUrl}`, 0, 'action');
        
        // Update avatar first
        onAvatarChange(avatarUrl);
        
        // Then delete old avatar if from Appwrite
        const isCurrentAppwriteUrl = currentAvatar && (
          currentAvatar.includes('appwrite') || 
          currentAvatar.includes('api.blueprint-create.com')
        );
        
        if (isCurrentAppwriteUrl) {
          logMessage(`Deleting old avatar before Minecraft skin: ${currentAvatar}`, 0, 'action');
          
          const patterns = [
            // Main patterns - handle query params with non-greedy match
            /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
            /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
            /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/,
            // Legacy patterns
            /\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
            /\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
            /\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/
          ];
          
          let oldFileId: string | null = null;
          for (const pattern of patterns) {
            const match = pattern.exec(currentAvatar);
            if (match && match[1]) {
              oldFileId = match[1];
              break;
            }
          }
          
          // Try simpler extraction as last resort
          if (!oldFileId) {
            const simpleMatch = currentAvatar.match(/files\/([a-zA-Z0-9]+)/);
            if (simpleMatch && simpleMatch[1]) {
              oldFileId = simpleMatch[1];
              logMessage(`Extracted using simple pattern: ${oldFileId}`, 0, 'action');
            }
          }
          
          if (oldFileId) {
            try {
              await storage.deleteFile(STORAGE_BUCKETS.AVATARS, oldFileId);
              logMessage(`✓ Deleted old avatar after setting Minecraft skin: ${oldFileId}`, 0, 'action');
            } catch (deleteError: unknown) {
              const error = deleteError as { message?: string };
              const errorMessage = error?.message || String(deleteError) || 'Unknown error';
              if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                logMessage(`Old avatar ${oldFileId} was already deleted or doesn't exist`, 1, 'action');
              } else {
                logMessage(`Failed to delete old avatar: ${errorMessage}`, 2, 'action');
              }
            }
          } else {
            logMessage(`❌ Could not extract file ID from avatar URL: ${currentAvatar}`, 1, 'action');
          }
        }
        
        setMinecraftUsername('');
        setIsLoadingMinecraft(false);
        
        setUploadStatus({
          stage: 'complete',
          progress: 100,
          message: 'Minecraft avatar set successfully!'
        });
        resetUploadStatus();
      };
      
      testImage.onerror = (_error) => {
        setUploadStatus({
          stage: 'error',
          progress: 0,
          message: 'Minecraft username not found'
        });
        setIsLoadingMinecraft(false);
        resetUploadStatus();
      };
      
      testImage.src = avatarUrl;
    } catch {
      setUploadStatus({
        stage: 'error',
        progress: 0,
        message: 'Failed to fetch Minecraft avatar'
      });
      setIsLoadingMinecraft(false);
      resetUploadStatus();
    }
  }, [minecraftUsername, currentAvatar, onAvatarChange, resetUploadStatus]);

  // Debug function for testing avatar deletion from browser console
  const testAvatarDeletion = useCallback(async (fileId: string) => {
    logMessage(`🧪 Testing avatar deletion for file ID: ${fileId}`, 0, 'debug');
    try {
      // First check if file exists
      const existingFile = await storage.getFile(STORAGE_BUCKETS.AVATARS, fileId);
      logMessage(`✓ File exists: ${existingFile.name} (${existingFile.sizeOriginal} bytes)`, 0, 'debug');
      
      // Then try to delete it
      const deleteResult = await storage.deleteFile(STORAGE_BUCKETS.AVATARS, fileId);
      logMessage(`✅ Test deletion successful: ${JSON.stringify(deleteResult)}`, 0, 'debug');
      console.log('Test deletion result:', deleteResult);
      return { success: true, result: deleteResult };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logMessage(`❌ Test deletion failed: ${errorMessage}`, 3, 'debug');
      console.error('Test deletion error:', error);
      return { success: false, error };
    }
  }, []);

  // Expose test function to window for debugging
  useEffect(() => {
    (window as Record<string, unknown>).testAvatarDeletion = testAvatarDeletion;
    (window as Record<string, unknown>).debugAvatarExtraction = (url: string) => {
      const patterns = [
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
        /\/buckets\/[^/]+\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/,
        /\/files\/([a-zA-Z0-9]+)\/preview(?:\?|$)/,
        /\/files\/([a-zA-Z0-9]+)\/view(?:\?|$)/,
        /\/files\/([a-zA-Z0-9]+)(?:\/|$|\?)/
      ];
      
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = pattern.exec(url);
        console.log(`Pattern ${i + 1}: ${pattern.source} - Match: ${match ? match[1] : 'no match'}`);
        if (match && match[1]) {
          console.log(`✓ Extracted file ID: ${match[1]}`);
          return match[1];
        }
      }
      
      const simpleMatch = url.match(/files\/([a-zA-Z0-9]+)/);
      if (simpleMatch && simpleMatch[1]) {
        console.log(`✓ Simple pattern worked: ${simpleMatch[1]}`);
        return simpleMatch[1];
      }
      
      console.log('❌ No patterns matched');
      return null;
    };
    return () => {
      delete (window as Record<string, unknown>).testAvatarDeletion;
      delete (window as Record<string, unknown>).debugAvatarExtraction;
    };
  }, [testAvatarDeletion]);

  const getStatusIcon = () => {
    switch (uploadStatus.stage) {
      case 'uploading':
      case 'compressing':
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus.stage) {
      case 'complete':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback>
            <User2 className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Label htmlFor="picture" className="cursor-pointer">
              <div className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors",
                "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}>
                <Upload className="h-4 w-4" />
                Upload Image
              </div>
              <input
                id="picture"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || uploadStatus.stage !== 'idle'}
              />
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Minecraft username"
              value={minecraftUsername}
              onChange={(e) => setMinecraftUsername(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleMinecraftAvatar();
                }
              }}
              disabled={disabled || isLoadingMinecraft}
              className="w-48"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleMinecraftAvatar}
              disabled={disabled || isLoadingMinecraft || !minecraftUsername.trim()}
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Use Minecraft
            </Button>
          </div>
        </div>
      </div>

      {uploadStatus.stage !== 'idle' && (
        <div className="space-y-2">
          <div className={cn("flex items-center gap-2", getStatusColor())}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{uploadStatus.message}</span>
          </div>
          
          {uploadStatus.stage !== 'complete' && uploadStatus.stage !== 'error' && (
            <Progress value={uploadStatus.progress} className="h-2" />
          )}
          
          {uploadStatus.details && (
            <div className="text-xs text-muted-foreground space-y-1">
              {uploadStatus.details.originalSize && (
                <div>
                  Original: {(uploadStatus.details.originalSize / 1024).toFixed(1)} KB → 
                  Compressed: {(uploadStatus.details.compressedSize! / 1024).toFixed(1)} KB
                </div>
              )}
              {uploadStatus.details.compressionRatio && (
                <div>Space saved: {uploadStatus.details.compressionRatio}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}