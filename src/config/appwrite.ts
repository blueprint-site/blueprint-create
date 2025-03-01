import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

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

const url = 'https://api.blueprint-create.com/v1';
const id = '67ad0767000d58bb6592';

client.setEndpoint(url).setProject(id);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
