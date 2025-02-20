import { MeiliSearch } from 'meilisearch';

const url = window._env_?.MEILISEARCH_URL || ''
const apiKey = window._env_?.MEILISEARCH_API_KEY || ''
const searchClient = new MeiliSearch({
    host: url,
    apiKey: apiKey,
});
export default searchClient;
