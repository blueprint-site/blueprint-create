const { throwIfMissing } = require('./utils.js');

module.exports = async ({ req, res, log }) => {
  try {
    const requiredKeys = ['APPWRITE_URL', 'MEILISEARCH_URL', 'MEILISEARCH_SEARCH_API_KEY'];

    throwIfMissing(process.env, requiredKeys);

    const response = {
      APPWRITE_DATABASE_ID: 'main',
      APPWRITE_URL: process.env.APPWRITE_URL,
      MEILISEARCH_URL: process.env.MEILISEARCH_URL,
      MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
