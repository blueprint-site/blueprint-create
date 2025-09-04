import { MeiliSearch } from 'meilisearch';

const url = window._env_?.MEILISEARCH_URL || '';
const apiKey = window._env_?.MEILISEARCH_API_KEY || '';

// Only initialize MeiliSearch client if URL is provided
const searchClient = url
  ? new MeiliSearch({
      host: url,
      apiKey: apiKey,
    })
  : null;

export default searchClient;
