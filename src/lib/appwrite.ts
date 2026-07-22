import { Client, TablesDB, Account, Teams, Role } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const tablesDB = new TablesDB(client);
export const account = new Account(client);
export const teams = new Teams(client);
export const role = new Role();
