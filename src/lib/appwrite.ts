import {Client, Account, Databases, Storage} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.APP_APPWRITE_URL)
    .setProject(import.meta.env.APP_APPWRITE_PROJECT_ID);


export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
