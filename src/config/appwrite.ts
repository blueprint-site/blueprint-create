import {Client, Account, Databases, Storage} from 'appwrite';

export const client = new Client();

const url = window._env_?.APPWRITE_URL || ''
const id = window._env_?.APPWRITE_PROJECT_ID  || ''

client
    .setEndpoint(url)
    .setProject(id)




export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
