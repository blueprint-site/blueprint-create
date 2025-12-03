// src/services/userService.js

import { Query } from 'node-appwrite';
import { appwrite } from '../utils/appwrite.js';

const { usersSdk } = appwrite;

/**
 * Lists users, optionally filters, and enriches them with relevant team IDs.
 * @param {object} payload - Payload containing list options (search, limit, offset).
 * @returns {Promise<{total: number, users: Array<object>}>} - Object with total count and enriched user list.
 * @throws {Error} - If SDK calls fail or unexpected structure received.
 */
export const fetchUsers = async ({ payload }) => {
  const listQueries = [];
  const search = payload?.search;
  const limit = parseInt(payload?.limit, 10) || 25;
  const offset = parseInt(payload?.offset, 10) || 0;

  if (search) {
    listQueries.push(Query.search('search', search));
  }
  listQueries.push(Query.limit(limit));
  listQueries.push(Query.offset(offset));

  const userListResult = await usersSdk.list(listQueries);

  const usersArray = userListResult.users;
  if (!Array.isArray(usersArray)) {
    throw new Error(
      'Internal error: Failed to retrieve expected user list data structure.',
      userListResult
    );
  }

  if (usersArray.length === 0) {
    return { total: 0, users: [] }; // Return data structure
  }

  const userWithTeamIds = await Promise.all(
    usersArray.map(async (user) => {
      try {
        const teams = await usersSdk.listMemberships(user.$id);
        return { ...user, teams };
      } catch (sdkError) {
        throw sdkError;
      }
    })
  );

  return { total: userListResult.total, users: userWithTeamIds };
};

/**
 * Fetches the teams a user belongs to.
 * @param {string} userId - The user ID.
 * @returns {Promise<Membership[]>} - Array of user memberships.
 * @throws {Error} - Throws if the Appwrite SDK call fails unexpectedly.
 */
export const getUserMemberships = async (userId) => {
  try {
    const { memberships } = await usersSdk.listMemberships(userId);

    return memberships;
  } catch (sdkError) {
    console.error(`Failed to fetch teams for user ${userId}:`, sdkError);
    throw sdkError;
  }
};
