declare global {
    interface Window {
        _env_?: {
            SUPABASE_URL: string;
            SUPABASE_ANON_KEY: string;
            MEILISEARCH_URL: string;
            MEILISEARCH_API_KEY: string;
            APPWRITE_URL: string;
            APPWRITE_PROJECT_ID: string;
        };
    }
}

export {};
