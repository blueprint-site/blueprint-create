import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://api.3de-scs.be/v1')
    .setProject('67ad0767000d58bb6592')

export const account = new Account(client);
export { ID } from 'appwrite';
