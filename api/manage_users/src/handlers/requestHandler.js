// src/handlers/requestHandler.js

import { HttpError, BadRequestError } from '../utils/errors.js';
import { fetchUsers } from '../services/userService.js';
import { updateTeamMembership } from '../services/teamsService.js';

/**
 * Parses the request body and validates the basic action/payload structure.
 * @param {object} req - The Appwrite request object.
 * @returns {{action: string, payload: object}} - The validated action and payload.
 * @throws {BadRequestError} - If structure is invalid.
 */
export function parseAndValidateRequest(req) {
  // Appwrite already parses the body for us
  const requestBody = req.body || {};

  // Simple validation of required fields
  const { action, payload = {} } = requestBody;

  if (!action) {
    throw new BadRequestError('Missing required field: "action"');
  }

  return { action, payload };
}

/**
 * Routes the action to the appropriate service and executes it.
 * @param {string} action - The action to perform.
 * @param {object} payload - The payload for the action.
 * @returns {Promise<any>} - The result data from the executed service.
 * @throws {BadRequestError} - If action is unknown or payload invalid for the action.
 * @throws {Error} - Propagates errors from services.
 */
export async function routeAndExecuteAction({ action, payload }) {
  switch (action) {
    case 'listUsers':
      return await fetchUsers({ payload });

    case 'updateTeamMembership':
      // Validate required fields for this specific action
      if (
        !payload.userId ||
        !payload.teamId ||
        typeof payload.add !== 'boolean'
      ) {
        throw new BadRequestError(
          'For updateTeamMembership: userId, teamId, and add (boolean) are required'
        );
      }
      return await updateTeamMembership({ payload });

    default:
      throw new BadRequestError(`Unknown action: ${action}`);
  }
}

/**
 * Formats and sends an error response.
 * @param {object} context - Contains error details and response objects.
 * @param {Error} context.e - The caught error.
 * @param {string} context.action - The action being attempted (for logging).
 * @param {object} context.res - The Appwrite response object.
 * @param {Function} context.errorLogger - The error logging function.
 * @param {number} context.start - The timestamp when the request started.
 */
export function handleErrorResponse({ e, action, res, errorLogger, start }) {
  const duration = Date.now() - start;
  let statusCode = 500;
  let message = 'An internal error occurred.';

  if (e instanceof HttpError) {
    statusCode = e.statusCode;
    message = e.message;
  } else if (e instanceof SyntaxError && e.message.includes('JSON')) {
    statusCode = 400;
    message = 'Invalid JSON format in request body.';
  }

  errorLogger(
    `Action "${action}" failed after ${duration}ms. Status: ${statusCode}. Error: ${e.message}. Stack: ${e.stack || 'N/A'}`
  );

  return res.json({ success: false, message: message }, statusCode);
}
