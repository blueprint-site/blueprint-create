const sdk = require("node-appwrite");
const sharp = require("sharp");

module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const storage = new sdk.Storage(client);
  // const databases = new sdk.Databases(client); // Not currently used

  const processImage = async (params) => {
    const {
      bucketId,
      fileId,
      quality = 85,
      width,
      height,
      preserveOriginal = false,
    } = params;
    const startTime = Date.now();

    try {
      // Download file as a buffer
      const fileResponse = await storage.getFileDownload(bucketId, fileId);

      // Handle different response types
      let buffer;
      if (fileResponse instanceof Buffer) {
        buffer = fileResponse;
      } else if (fileResponse.arrayBuffer) {
        const arrayBuffer = await fileResponse.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (fileResponse instanceof ArrayBuffer) {
        buffer = Buffer.from(fileResponse);
      } else if (typeof fileResponse === "string") {
        buffer = Buffer.from(fileResponse, "binary");
      } else {
        // Try to read as a stream
        const chunks = [];
        for await (const chunk of fileResponse) {
          chunks.push(chunk);
        }
        buffer = Buffer.concat(chunks);
      }

      const originalFile = await storage.getFile(bucketId, fileId);
      const originalName = originalFile.name;
      const nameWithoutExt =
        originalName.substring(0, originalName.lastIndexOf(".")) ||
        originalName;

      let sharpInstance = sharp(buffer);

      const metadata = await sharpInstance.metadata();

      if (width || height) {
        sharpInstance = sharpInstance.resize({
          width: width || null,
          height: height || null,
          fit: "inside",
          withoutEnlargement: true,
        });
      }

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

      const permissions = originalFile.permissions || [];

      const compressedFile = await storage.createFile(
        bucketId,
        sdk.ID.unique(),
        new sdk.InputFile.fromBuffer(
          compressedBuffer,
          `${nameWithoutExt}.webp`,
        ),
        permissions,
      );

      if (!preserveOriginal) {
        await storage.deleteFile(bucketId, fileId);
      }

      return {
        success: true,
        fileId: fileId,
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
          id: compressedFile.$id,
          name: compressedFile.name,
          size: compressedBuffer.length,
          width: compressedMetadata.width,
          height: compressedMetadata.height,
          format: "webp",
          bucketId: bucketId,
        },
        stats: {
          compressionRatio: `${compressionRatio}%`,
          sizeSaved: buffer.length - compressedBuffer.length,
          processingTime: `${Date.now() - startTime}ms`,
        },
      };
    } catch (err) {
      return {
        success: false,
        fileId: fileId,
        error: err.message,
      };
    }
  };

  try {
    const payload = JSON.parse(req.body || "{}");
    const { images, defaultSettings = {} } = payload;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.json(
        {
          success: false,
          error: "Missing or invalid images array",
        },
        400,
      );
    }

    log(`Processing batch of ${images.length} images`);

    const results = await Promise.all(
      images.map((image) => processImage({ ...defaultSettings, ...image })),
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const totalSaved = results
      .filter((r) => r.success)
      .reduce((acc, r) => acc + r.stats.sizeSaved, 0);

    return res.json({
      success: true,
      summary: {
        total: images.length,
        successful,
        failed,
        totalSpaceSaved: totalSaved,
        totalSpaceSavedMB: (totalSaved / 1024 / 1024).toFixed(2),
      },
      results,
    });
  } catch (err) {
    error(`Error processing batch: ${err.message}`);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
    );
  }
};
