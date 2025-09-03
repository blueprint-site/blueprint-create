/**
 * Extracts bucket ID and file ID from an Appwrite storage URL
 * @param url - The Appwrite storage URL
 * @returns Object with bucketId and fileId, or null if not found
 */
export function extractFileInfoFromUrl(url: string): { bucketId: string; fileId: string } | null {
  if (!url || typeof url !== 'string') return null;

  // Pattern to match Appwrite storage URLs
  // Example: https://api.blueprint-create.com/v1/storage/buckets/schematics-nbt/files/68b1f4dc50436b446870/download?project=...
  // Example: https://api.blueprint-create.com/v1/storage/buckets/schematics-previews/files/68b1f4dc9b3caacd9d4e/preview?project=...

  const match = url.match(/buckets\/([^/]+)\/files\/([^/]+)/);

  if (match && match[1] && match[2]) {
    return {
      bucketId: match[1],
      fileId: match[2],
    };
  }

  return null;
}

/**
 * Extracts all file information from a schematic object
 * @param schematic - The schematic object
 * @returns Array of file information with bucket and file IDs
 */
export function extractSchematicFiles(schematic: {
  schematic_url?: string;
  image_urls?: string[];
}): { bucketId: string; fileId: string }[] {
  const files: { bucketId: string; fileId: string }[] = [];

  // Extract NBT file
  if (schematic.schematic_url) {
    const fileInfo = extractFileInfoFromUrl(schematic.schematic_url);
    if (fileInfo) {
      files.push(fileInfo);
    }
  }

  // Extract image files
  if (schematic.image_urls && Array.isArray(schematic.image_urls)) {
    schematic.image_urls.forEach((url) => {
      const fileInfo = extractFileInfoFromUrl(url);
      if (fileInfo) {
        files.push(fileInfo);
      }
    });
  }

  return files;
}
