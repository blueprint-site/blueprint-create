import { Client, TablesDB, Account, Teams } from "appwrite"

export const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const tablesDB = new TablesDB(client)
export const account = new Account(client)
export const teams = new Teams(client)