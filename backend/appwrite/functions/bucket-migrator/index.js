const sdk = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = JSON.parse(req.body || "{}");
    const {
      sourceBucketId = "67b2241e0032c25c8216", // mixed bucket
      nbtBucketId = "schematics-nbt",
      previewBucketId = "schematics-previews",
      dryRun = true,
      batchSize = 50,
    } = payload;

    log("Starting bucket migration process");
    log(`Source bucket: ${sourceBucketId}`);
    log(`NBT bucket: ${nbtBucketId}`);
    log(`Preview bucket: ${previewBucketId}`);
    log(`Dry run: ${dryRun}`);

    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const storage = new sdk.Storage(client);
    const databases = new sdk.Databases(client);

    const results = {
      totalProcessed: 0,
      nbtFiles: [],
      imageFiles: [],
      migrated: {
        nbt: [],
        images: [],
      },
      updated: {
        schematics: [],
      },
      errors: [],
    };

    // Process files in batches
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const files = await storage.listFiles(sourceBucketId, [
          sdk.Query.limit(batchSize),
          sdk.Query.offset(offset),
        ]);

        if (!files.files || files.files.length === 0) {
          hasMore = false;
          break;
        }

        for (const file of files.files) {
          results.totalProcessed++;

          const isNbt =
            file.name.endsWith(".nbt") ||
            file.name.endsWith(".schem") ||
            file.name.endsWith(".schematic");
          const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

          if (isNbt) {
            results.nbtFiles.push({
              id: file.$id,
              name: file.name,
              size: file.sizeOriginal,
            });

            if (!dryRun) {
              try {
                // Download file
                log(`Downloading NBT file: ${file.name}`);
                const fileData = await storage.getFileDownload(
                  sourceBucketId,
                  file.$id,
                );

                // Convert response to buffer
                let buffer;
                if (fileData instanceof Buffer) {
                  buffer = fileData;
                } else if (fileData instanceof ArrayBuffer) {
                  buffer = Buffer.from(fileData);
                } else if (fileData.arrayBuffer) {
                  const arrayBuffer = await fileData.arrayBuffer();
                  buffer = Buffer.from(arrayBuffer);
                } else {
                  const chunks = [];
                  for await (const chunk of fileData) {
                    chunks.push(chunk);
                  }
                  buffer = Buffer.concat(chunks);
                }

                // Upload to new bucket
                log(`Uploading NBT file to new bucket: ${file.name}`);
                const inputFile = sdk.InputFile.fromBuffer(buffer, file.name);
                const newFile = await storage.createFile(
                  nbtBucketId,
                  file.$id, // Keep same ID
                  inputFile,
                  file.$permissions || [],
                );

                results.migrated.nbt.push({
                  id: newFile.$id,
                  name: newFile.name,
                  oldBucket: sourceBucketId,
                  newBucket: nbtBucketId,
                });

                // Update database references
                await updateSchematicReferences(
                  databases,
                  file.$id,
                  sourceBucketId,
                  nbtBucketId,
                  "schematic_url",
                  log,
                );

                // Delete from old bucket
                await storage.deleteFile(sourceBucketId, file.$id);
                log(`Deleted NBT file from source bucket: ${file.$id}`);
              } catch (migrateErr) {
                const errorMsg = `Failed to migrate NBT file ${file.$id}: ${migrateErr.message}`;
                error(errorMsg);
                results.errors.push(errorMsg);
              }
            }
          } else if (isImage) {
            results.imageFiles.push({
              id: file.$id,
              name: file.name,
              size: file.sizeOriginal,
            });

            if (!dryRun) {
              try {
                // Download file
                log(`Downloading image file: ${file.name}`);
                const fileData = await storage.getFileDownload(
                  sourceBucketId,
                  file.$id,
                );

                // Convert response to buffer
                let buffer;
                if (fileData instanceof Buffer) {
                  buffer = fileData;
                } else if (fileData instanceof ArrayBuffer) {
                  buffer = Buffer.from(fileData);
                } else if (fileData.arrayBuffer) {
                  const arrayBuffer = await fileData.arrayBuffer();
                  buffer = Buffer.from(arrayBuffer);
                } else {
                  const chunks = [];
                  for await (const chunk of fileData) {
                    chunks.push(chunk);
                  }
                  buffer = Buffer.concat(chunks);
                }

                // Upload to new bucket
                log(`Uploading image file to new bucket: ${file.name}`);
                const inputFile = sdk.InputFile.fromBuffer(buffer, file.name);
                const newFile = await storage.createFile(
                  previewBucketId,
                  file.$id, // Keep same ID
                  inputFile,
                  file.$permissions || [],
                );

                results.migrated.images.push({
                  id: newFile.$id,
                  name: newFile.name,
                  oldBucket: sourceBucketId,
                  newBucket: previewBucketId,
                });

                // Update database references
                await updateSchematicReferences(
                  databases,
                  file.$id,
                  sourceBucketId,
                  previewBucketId,
                  "image_urls",
                  log,
                );

                // Delete from old bucket
                await storage.deleteFile(sourceBucketId, file.$id);
                log(`Deleted image file from source bucket: ${file.$id}`);
              } catch (migrateErr) {
                const errorMsg = `Failed to migrate image file ${file.$id}: ${migrateErr.message}`;
                error(errorMsg);
                results.errors.push(errorMsg);
              }
            }
          }
        }

        offset += batchSize;

        if (files.files.length < batchSize) {
          hasMore = false;
        }
      } catch (listErr) {
        const errorMsg = `Error listing files at offset ${offset}: ${listErr.message}`;
        error(errorMsg);
        results.errors.push(errorMsg);
        hasMore = false;
      }
    }

    log("Migration completed");
    log(`Total files processed: ${results.totalProcessed}`);
    log(`NBT files found: ${results.nbtFiles.length}`);
    log(`Image files found: ${results.imageFiles.length}`);
    if (!dryRun) {
      log(`NBT files migrated: ${results.migrated.nbt.length}`);
      log(`Image files migrated: ${results.migrated.images.length}`);
    }

    return res.json({
      success: true,
      dryRun,
      results,
    });
  } catch (err) {
    error(`Error in bucket migrator: ${err.message}`);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
    );
  }
};

async function updateSchematicReferences(
  databases,
  fileId,
  oldBucketId,
  newBucketId,
  field,
  log,
) {
  try {
    // Search for schematics that reference this file
    let offset = 0;
    let hasMore = true;
    let updatedCount = 0;

    while (hasMore) {
      const docs = await databases.listDocuments("main", "schematics", [
        sdk.Query.limit(100),
        sdk.Query.offset(offset),
      ]);

      if (!docs.documents || docs.documents.length === 0) {
        hasMore = false;
        break;
      }

      for (const doc of docs.documents) {
        let needsUpdate = false;
        const updates = {};

        if (
          field === "schematic_url" &&
          doc.schematic_url &&
          doc.schematic_url.includes(fileId)
        ) {
          // Update single URL
          updates.schematic_url = doc.schematic_url.replace(
            `/buckets/${oldBucketId}/`,
            `/buckets/${newBucketId}/`,
          );
          needsUpdate = true;
        } else if (
          field === "image_urls" &&
          doc.image_urls &&
          Array.isArray(doc.image_urls)
        ) {
          // Update array of URLs
          const updatedUrls = doc.image_urls.map((url) => {
            if (url && url.includes(fileId)) {
              return url.replace(
                `/buckets/${oldBucketId}/`,
                `/buckets/${newBucketId}/`,
              );
            }
            return url;
          });

          if (JSON.stringify(updatedUrls) !== JSON.stringify(doc.image_urls)) {
            updates.image_urls = updatedUrls;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          await databases.updateDocument(
            "main",
            "schematics",
            doc.$id,
            updates,
          );
          updatedCount++;
          log(`Updated schematic ${doc.$id} references`);
        }
      }

      offset += 100;

      if (docs.documents.length < 100) {
        hasMore = false;
      }
    }

    if (updatedCount > 0) {
      log(`Updated ${updatedCount} schematic documents`);
    }
  } catch (err) {
    log(`Error updating schematic references: ${err.message}`);
  }
}
