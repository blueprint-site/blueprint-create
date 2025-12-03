import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const databases = new Databases(client);

    const userId =
      req.headers['x-user-id'] || req.body?.userId || req.query?.userId;

    if (!userId) {
      log('User ID is required but not provided.');
      return res.json({ error: 'User ID is required' }, 400);
    }

    const collectionsConfig = [
      { id: 'schematics', row: 'user_id' },
      { id: 'blogs', row: 'authors_uuid' },
    ];

    let allData = [];

    for (const collectionConfig of collectionsConfig) {
      let documents = [];
      let cursor = null;

      do {
        try {
          const queries = [
            Query.limit(100),
            Array.isArray(collectionConfig.row)
              ? Query.contains(collectionConfig.row, [userId])
              : Query.equal(collectionConfig.row, userId),
          ];

          if (cursor) {
            queries.push(Query.cursorAfter(cursor));
          }

          const response = await databases.listDocuments(
            'main',
            collectionConfig.id,
            queries
          );

          if (response.documents.length > 0) {
            cursor = response.documents[response.documents.length - 1].$id;
            documents.push(...response.documents);
          } else {
            log(
              `No more documents found for user ${userId} in collection ${collectionConfig.id}.`
            );
            cursor = null;
            break;
          }

          log(
            `Fetched chunk of ${response.documents.length} documents for user ${userId} from collection ${collectionConfig.id}...`
          );
        } catch (err) {
          log(
            `Error fetching documents from collection ${collectionConfig.id}: ${err.message}`
          );
          break;
        }
      } while (cursor !== null);

      allData.push({
        collectionId: collectionConfig.id,
        row: collectionConfig.row,
        data: documents,
      });
    }

    log(`Successfully retrieved data for user ${userId} from all collections.`);
    return res.json(
      {
        message: `Successfully retrieved data for user ${userId} from all collections.`,
        data: allData,
      },
      200
    );
  } catch (err) {
    log(`Unexpected error: ${err.message}`);
    return res.json({ error: 'An unexpected error occurred.' }, 500);
  }
};
