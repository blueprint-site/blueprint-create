import { MeiliSearch } from 'meilisearch';

const searchClient = new MeiliSearch({
    host: import.meta.env.APP_MEILISEARCH_URL,
    apiKey: import.meta.env.APP_MEILISEARCH_API_KEY
});

export default searchClient;
