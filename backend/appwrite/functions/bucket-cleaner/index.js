const sdk = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = JSON.parse(req.body || "{}");
    const { bucketIds, dryRun = true, batchSize = 100 } = payload;

    log("Starting bucket cleanup process");
    log(`Dry run: ${dryRun}`);
    log(`Batch size: ${batchSize}`);

    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const storage = new sdk.Storage(client);
    const databases = new sdk.Databases(client);

    const buckets = bucketIds || [
      "schematics-nbt", // NBT schematic files
      "schematics-previews", // Schematic preview images
      "67aee2b30000b9e21407", // avatars
    ];

    const results = {
      totalFilesChecked: 0,
      totalOrphaned: 0,
      totalDeleted: 0,
      buckets: {},
      errors: [],
    };

    for (const bucketId of buckets) {
      log(`Processing bucket: ${bucketId}`);
      results.buckets[bucketId] = {
        filesChecked: 0,
        orphaned: [],
        deleted: [],
        errors: [],
      };

      try {
        const referencedFiles = await getReferencedFiles(
          databases,
          bucketId,
          log,
        );
        log(
          `Found ${referencedFiles.size} referenced files in bucket ${bucketId}`,
        );

        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          try {
            const files = await storage.listFiles(bucketId, [
              sdk.Query.limit(batchSize),
              sdk.Query.offset(offset),
            ]);

            if (!files.files || files.files.length === 0) {
              hasMore = false;
              break;
            }

            for (const file of files.files) {
              results.buckets[bucketId].filesChecked++;
              results.totalFilesChecked++;

              const fileIdentifier = getFileIdentifier(bucketId, file.$id);

              if (
                !referencedFiles.has(fileIdentifier) &&
                !referencedFiles.has(file.$id)
              ) {
                results.buckets[bucketId].orphaned.push({
                  id: file.$id,
                  name: file.name,
                  size: file.sizeOriginal,
                  created: file.$createdAt,
                });
                results.totalOrphaned++;

                if (!dryRun) {
                  try {
                    await storage.deleteFile(bucketId, file.$id);
                    results.buckets[bucketId].deleted.push(file.$id);
                    results.totalDeleted++;
                    log(
                      `Deleted orphaned file: ${file.$id} from bucket ${bucketId}`,
                    );
                  } catch (deleteErr) {
                    const errorMsg = `Failed to delete file ${file.$id}: ${deleteErr.message}`;
                    error(errorMsg);
                    results.buckets[bucketId].errors.push(errorMsg);
                  }
                }
              }
            }

            offset += batchSize;

            if (files.files.length < batchSize) {
              hasMore = false;
            }
          } catch (listErr) {
            const errorMsg = `Error listing files in bucket ${bucketId} at offset ${offset}: ${listErr.message}`;
            error(errorMsg);
            results.buckets[bucketId].errors.push(errorMsg);
            hasMore = false;
          }
        }
      } catch (bucketErr) {
        const errorMsg = `Error processing bucket ${bucketId}: ${bucketErr.message}`;
        error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    log("Bucket cleanup completed");
    log(`Total files checked: ${results.totalFilesChecked}`);
    log(`Total orphaned files found: ${results.totalOrphaned}`);
    log(`Total files deleted: ${results.totalDeleted}`);

    return res.json({
      success: true,
      dryRun,
      results,
    });
  } catch (err) {
    error(`Error in bucket cleaner: ${err.message}`);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
    );
  }
};

async function getReferencedFiles(databases, bucketId, log) {
  const references = new Set();

  const collectionMappings = {
    "schematics-nbt": {
      collections: [
        { db: "main", collection: "schematics", fields: ["schematic_url"] },
      ],
    },
    "schematics-previews": {
      collections: [
        { db: "main", collection: "schematics", fields: ["image_urls"] },
      ],
    },
    "67aee2b30000b9e21407": {
      // avatars
      collections: [{ db: "main", collection: "badges", fields: ["iconUrl"] }],
    },
  };

  const mapping = collectionMappings[bucketId];
  if (!mapping) {
    log(`No collection mapping found for bucket ${bucketId}`);
    return references;
  }

  for (const config of mapping.collections) {
    try {
      let offset = 0;
      let hasMore = true;
      let docCount = 0;

      while (hasMore) {
        const docs = await databases.listDocuments(
          config.db,
          config.collection,
          [sdk.Query.limit(100), sdk.Query.offset(offset)],
        );

        if (!docs.documents || docs.documents.length === 0) {
          hasMore = false;
          break;
        }

        docCount += docs.documents.length;

        for (const doc of docs.documents) {
          for (const field of config.fields) {
            const value = doc[field];
            if (value) {
              if (Array.isArray(value)) {
                value.forEach((url) => {
                  // Extract file ID from any bucket, not just the current one
                  // because URLs might reference files in different buckets
                  const fileId = extractFileIdForBucket(url, bucketId);
                  if (fileId) {
                    references.add(fileId);
                  }
                });
              } else {
                const fileId = extractFileIdForBucket(value, bucketId);
                if (fileId) {
                  references.add(fileId);
                }
              }
            }
          }
        }

        offset += 100;

        if (docs.documents.length < 100) {
          hasMore = false;
        }
      }

      log(`Processed ${docCount} documents from ${config.collection}`);
    } catch (collErr) {
      log(
        `Error fetching documents from ${config.collection}: ${collErr.message}`,
      );
    }
  }

  // Get user avatars specifically for the avatars bucket
  if (bucketId === "67aee2b30000b9e21407") {
    const users = await getUserAvatars(databases, log);
    users.forEach((avatarId) => references.add(avatarId));
  }

  log(`Total references found for bucket ${bucketId}: ${references.size}`);

  return references;
}

// Helper function to extract file ID only if it belongs to the specified bucket
function extractFileIdForBucket(url, targetBucketId) {
  if (!url || typeof url !== "string") return null;

  // Check if URL contains the target bucket ID
  if (url.includes(`/buckets/${targetBucketId}/files/`)) {
    // Extract the file ID after /files/
    const match = url.match(
      new RegExp(`/buckets/${targetBucketId}/files/([^/]+)/`),
    );
    if (match && match[1]) {
      return match[1].split("?")[0];
    }
  }

  return null;
}

async function getUserAvatars(databases, log) {
  const avatars = new Set();

  try {
    const sdk = require("node-appwrite");
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const users = new sdk.Users(client);

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const userList = await users.list([
        sdk.Query.limit(100),
        sdk.Query.offset(offset),
      ]);

      if (!userList.users || userList.users.length === 0) {
        hasMore = false;
        break;
      }

      for (const user of userList.users) {
        // Check prefs.avatar (URL format)
        if (user.prefs && user.prefs.avatar) {
          const avatarId = extractFileIdForBucket(
            user.prefs.avatar,
            "67aee2b30000b9e21407",
          );
          if (avatarId) {
            avatars.add(avatarId);
            log(`Found avatar for user ${user.name}: ${avatarId}`);
          }
        }
        // Also check legacy avatarId field
        if (user.prefs && user.prefs.avatarId) {
          avatars.add(user.prefs.avatarId);
        }
      }

      offset += 100;

      if (userList.users.length < 100) {
        hasMore = false;
      }
    }

    log(`Found ${avatars.size} user avatars`);
  } catch (err) {
    log(`Error fetching user avatars: ${err.message}`);
  }

  return avatars;
}

// Removed unused extractFileId function - extractFileIdForBucket is used instead

function getFileIdentifier(bucketId, fileId) {
  return `${bucketId}:${fileId}`;
}
