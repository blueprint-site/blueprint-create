// src/handlers/authHandler.js

import { ForbiddenError } from '../utils/errors.js';
import { getUserMemberships } from '../services/userService.js';
import { config } from '../utils/config.js';

const { adminTeamId } = config;

/**
 * Checks if the invoking user is authorized (is an admin).
 * @param {string} userId - The ID of the user invoking the function.
 * @throws {ForbiddenError} - If the user is not authorized.
 */
export const authorizeRequest = async (userId) => {
  const teams = await getUserMemberships(userId);

  const teamIds = teams.map((team) => team.teamId);
  const isAdmin = teamIds.includes(adminTeamId);

  if (!isAdmin) {
    console.error(`Authorization failed for user ${userId}.`);
    console.error(`User is in teams: ${JSON.stringify(teamIds)}`);
    console.error(`Expected admin team ID: ${adminTeamId}`);
    throw new ForbiddenError(`User ${userId} is not authorized.`);
  }
};
