const sdk = require('node-appwrite');
const sharp = require('sharp');

// Helper function to generate unique ID
function uniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomStr}`;
}

module.exports = async ({ req, res, log, error }) => {
  const startTime = Date.now();

  try {
    const payload = JSON.parse(req.body || '{}');
    const { bucketId, fileId, quality = 85, width, height, preserveOriginal = false } = payload;

    if (!bucketId || !fileId) {
      return res.json(
        {
          success: false,
          error: 'Missing required parameters: bucketId and fileId',
        },
        400
      );
    }

    log(`Processing image: ${fileId} from bucket: ${bucketId}`);

    // Initialize the Appwrite client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const storage = new sdk.Storage(client);

    // Get file metadata
    let originalFile;
    try {
      originalFile = await storage.getFile(bucketId, fileId);
      log(`Original file: ${originalFile.name}, size: ${originalFile.sizeOriginal} bytes`);
    } catch (err) {
      error(`Failed to get file metadata: ${err.message}`);
      throw new Error(`Failed to get file metadata: ${err.message}`);
    }

    const originalName = originalFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

    // Download file as a buffer
    let buffer;
    try {
      const fileResponse = await storage.getFileDownload(bucketId, fileId);

      // Handle different response types
      if (fileResponse instanceof Buffer) {
        buffer = fileResponse;
      } else if (fileResponse instanceof ArrayBuffer) {
        buffer = Buffer.from(fileResponse);
      } else if (fileResponse.arrayBuffer) {
        const arrayBuffer = await fileResponse.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (typeof fileResponse === 'string') {
        buffer = Buffer.from(fileResponse, 'binary');
      } else {
        // Try to read as a stream
        const chunks = [];
        for await (const chunk of fileResponse) {
          chunks.push(chunk);
        }
        buffer = Buffer.concat(chunks);
      }

      log(`Downloaded ${buffer.length} bytes`);
    } catch (err) {
      error(`Failed to download file: ${err.message}`);
      throw new Error(`Failed to download file: ${err.message}`);
    }

    // Process image with Sharp
    let sharpInstance = sharp(buffer);

    const metadata = await sharpInstance.metadata();
    log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width: width || null,
        height: height || null,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to WebP
    const compressedBuffer = await sharpInstance
      .webp({
        quality: Math.min(100, Math.max(1, quality)),
        effort: 6,
      })
      .toBuffer();

    const compressedMetadata = await sharp(compressedBuffer).metadata();

    const compressionRatio = (
      ((buffer.length - compressedBuffer.length) / buffer.length) *
      100
    ).toFixed(2);
    log(
      `Compressed to WebP: ${compressedMetadata.width}x${compressedMetadata.height}, saved ${compressionRatio}%`
    );

    // Extract permissions
    let permissions = [];
    if (originalFile.$permissions && Array.isArray(originalFile.$permissions)) {
      permissions = originalFile.$permissions;
    } else if (originalFile.permissions && Array.isArray(originalFile.permissions)) {
      permissions = originalFile.permissions;
    }

    // Generate new file ID
    const newFileId = uniqueId();
    let compressedFile;

    try {
      // Try to create InputFile and upload
      // Check if InputFile is available in the SDK
      if (sdk.InputFile && sdk.InputFile.fromBuffer) {
        log('Using InputFile.fromBuffer method');
        const inputFile = sdk.InputFile.fromBuffer(compressedBuffer, `${nameWithoutExt}.webp`);
        compressedFile = await storage.createFile(bucketId, newFileId, inputFile, permissions);
      } else {
        // Fallback: Try the simpler approach that might work with older SDK versions
        log('Using direct buffer upload method');

        // Create a File-like object
        const fileData = {
          name: `${nameWithoutExt}.webp`,
          buffer: compressedBuffer,
          size: compressedBuffer.length,
          type: 'image/webp',
        };

        // Try different parameter variations
        try {
          // Variation 1: Direct buffer
          compressedFile = await storage.createFile(
            bucketId,
            newFileId,
            compressedBuffer,
            permissions
          );
        } catch (e1) {
          log(`Direct buffer failed: ${e1.message}`);

          // Variation 2: File-like object
          try {
            compressedFile = await storage.createFile(bucketId, newFileId, fileData, permissions);
          } catch (e2) {
            log(`File-like object failed: ${e2.message}`);

            // Variation 3: SDK.ID.unique() for file ID
            const sdkFileId = sdk.ID.unique();
            compressedFile = await storage.createFile(
              bucketId,
              sdkFileId,
              compressedBuffer,
              permissions
            );

            // Update the ID in the response
            if (compressedFile) {
              compressedFile.$id = compressedFile.$id || sdkFileId;
            }
          }
        }
      }

      log(`Created compressed file: ${compressedFile.$id || newFileId}`);
    } catch (err) {
      error(`Failed to upload compressed file: ${err.message}`);
      error(`Error stack: ${err.stack}`);

      // Last resort: Return success with the compressed buffer data
      // The client can handle the upload separately if needed
      const result = {
        success: true,
        uploadFailed: true,
        original: {
          id: fileId,
          name: originalName,
          size: buffer.length,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          deleted: false,
        },
        compressed: {
          id: newFileId,
          name: `${nameWithoutExt}.webp`,
          size: compressedBuffer.length,
          width: compressedMetadata.width,
          height: compressedMetadata.height,
          format: 'webp',
          bucketId: bucketId,
          // Include base64 data for client-side handling
          base64: compressedBuffer.toString('base64'),
        },
        stats: {
          compressionRatio: `${compressionRatio}%`,
          sizeSaved: buffer.length - compressedBuffer.length,
          processingTime: `${Date.now() - startTime}ms`,
        },
        error: `Upload failed: ${err.message}, but compression succeeded`,
      };

      return res.json(result);
    }

    // Delete original if requested
    if (!preserveOriginal) {
      try {
        log(`Attempting to delete original file: ${fileId}`);
        await storage.deleteFile(bucketId, fileId);
        log(`Successfully deleted original file: ${fileId}`);
      } catch (deleteErr) {
        error(`Failed to delete original file ${fileId}: ${deleteErr.message}`);
        error(`Delete error stack: ${deleteErr.stack}`);
        // Don't throw - let the function complete even if deletion fails
      }
    } else {
      log(`Preserving original file as requested: ${fileId}`);
    }

    // Prepare response
    const result = {
      success: true,
      original: {
        id: fileId,
        name: originalName,
        size: buffer.length,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        deleted: !preserveOriginal,
      },
      compressed: {
        id: compressedFile.$id || newFileId,
        name: `${nameWithoutExt}.webp`,
        size: compressedBuffer.length,
        width: compressedMetadata.width,
        height: compressedMetadata.height,
        format: 'webp',
        bucketId: bucketId,
      },
      stats: {
        compressionRatio: `${compressionRatio}%`,
        sizeSaved: buffer.length - compressedBuffer.length,
        processingTime: `${Date.now() - startTime}ms`,
      },
    };

    return res.json(result);
  } catch (err) {
    error(`Error processing image: ${err.message}`);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500
    );
  }
};
