// src/services/teamsService.js
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { config } from '../utils/config.js';
import { getUserMemberships } from './userService.js';
import { appwrite } from '../utils/appwrite.js';

const { teamsSdk } = appwrite;
const { MEMBERSHIP_REDIRECT_URL } = config;

/**
 * Adds or removes a user from a specific relevant team.
 * @param {object} payload - Payload with userId, teamId, add flag.
 * @returns {Promise<{message: string}>} - Success message object.
 * @throws {ConflictError} - If user already in team when adding.
 * @throws {NotFoundError} - If user not in team when removing.
 * @throws {Error} - For other SDK errors.
 */
export const updateTeamMembership = async ({ payload }) => {
  const { userId, teamId, add } = payload ?? {};

  if (!userId || !teamId || typeof add !== 'boolean') {
    throw new Error(
      'Internal validation failed: Invalid payload passed to updateTeamMembership service.'
    );
  }

  if (add) {
    try {
      const result = await teamsSdk.createMembership(
        teamId,
        [],
        undefined,
        userId,
        undefined,
        MEMBERSHIP_REDIRECT_URL,
        undefined
      );
      return {
        message: `User ${userId} added to team ${teamId} (Membership ID: ${result.$id}).`,
      };
    } catch (addError) {
      if (addError?.response?.code === 409) {
        // Throw a specific error the handler can catch
        throw new ConflictError(
          `User ${userId} is already a member of team ${teamId}.`
        );
      }
      console.error(
        `SDK Error adding user ${userId} to team ${teamId}: ${addError.message}`
      );
      throw addError;
    }
  } else {
    // Remove user from team
    try {
      const memberships = await getUserMemberships(userId);

      if (memberships.total === 0) {
        throw new NotFoundError(
          `User ${userId} was not found in team ${teamId}.`
        );
      }

      const membershipId = memberships.find(
        (membership) => membership.teamId === teamId
      ).$id;

      if (!membershipId) {
        throw new NotFoundError(
          `Membership ID not found for user ${userId} in team ${teamId}.`
        );
      }

      await teamsSdk.deleteMembership(teamId, membershipId);
      return {
        message: `User ${userId} removed from team ${teamId} (membership ${membershipId}).`,
      };
    } catch (removeError) {
      // Handle NotFoundError thrown above, or let it propagate
      if (removeError instanceof NotFoundError) {
        throw removeError;
      }
      console.error(
        `SDK Error removing user ${userId} from team ${teamId}: ${removeError.message}`
      );
      throw removeError; // Re-throw other SDK errors
    }
  }
};
