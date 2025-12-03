// src/utils/config.js

const apiKey = process.env.APPWRITE_API_KEY;
const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
const adminTeamId = process.env.ADMIN_TEAM_ID;
const betaTesterTeamId = process.env.BETA_TESTER_TEAM_ID;
const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;

const requiredEnvVars = {
  APPWRITE_API_KEY: apiKey,
  APPWRITE_FUNCTION_PROJECT_ID: projectId,
  ADMIN_TEAM_ID: adminTeamId,
  BETA_TESTER_TEAM_ID: betaTesterTeamId,
  APPWRITE_FUNCTION_API_ENDPOINT: endpoint,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Function configuration error: Missing environment variables: ${missingVars.join(', ')}`
  );
}

const MEMBERSHIP_REDIRECT_URL = 'https://blueprint-create.com';

export const config = {
  apiKey,
  projectId,
  endpoint,
  adminTeamId,
  betaTesterTeamId,
  MEMBERSHIP_REDIRECT_URL,
};
