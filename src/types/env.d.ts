declare global {
    interface Window {
        _env_?: {
            APP_URL: string;
            MEILISEARCH_URL: string;
            MEILISEARCH_API_KEY: string;
            APPWRITE_URL: string;
            APPWRITE_PROJECT_ID: string;
        };
    }
}

export {};
