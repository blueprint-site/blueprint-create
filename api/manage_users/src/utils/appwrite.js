// src/utils/appwrite.js

import { Client, Users, Teams } from 'node-appwrite';
import { config } from './config.js';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

// Initialize SDKs
const usersSdk = new Users(client);
const teamsSdk = new Teams(client);

// Export SDK instances
export const appwrite = {
  usersSdk,
  teamsSdk,
};
