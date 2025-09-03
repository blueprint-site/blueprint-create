/**
 * Compresses an image file to WebP format with specified quality
 * @param file - The image file to compress
 * @param quality - Quality setting (0-100), default 85 for balanced quality
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @returns Promise with compressed file
 */
export async function compressImageToWebP(
  file: File,
  quality: number = 85,
  maxWidth?: number,
  maxHeight?: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;
          
          if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          
          if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create new file with WebP extension
            const fileName = file.name.replace(/\.[^/.]+$/, '.webp');
            const compressedFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          },
          'image/webp',
          quality / 100 // Canvas API expects quality as 0-1
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Batch compress multiple images
 * @param files - Array of image files to compress
 * @param quality - Quality setting (0-100), default 85 for balanced quality
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @returns Promise with array of compressed files
 */
export async function batchCompressImages(
  files: File[],
  quality: number = 85,
  maxWidth?: number,
  maxHeight?: number
): Promise<File[]> {
  const compressedFiles = await Promise.all(
    files.map(file => compressImageToWebP(file, quality, maxWidth, maxHeight))
  );
  
  return compressedFiles;
}

/**
 * Calculate compression savings
 * @param originalSize - Original file size in bytes
 * @param compressedSize - Compressed file size in bytes
 * @returns Compression ratio and saved bytes
 */
export function calculateCompressionStats(originalSize: number, compressedSize: number) {
  const savedBytes = originalSize - compressedSize;
  const compressionRatio = ((savedBytes / originalSize) * 100).toFixed(2);
  
  return {
    savedBytes,
    compressionRatio: `${compressionRatio}%`,
    originalSize: formatFileSize(originalSize),
    compressedSize: formatFileSize(compressedSize)
  };
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}