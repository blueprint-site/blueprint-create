// src/main.js
import { authorizeRequest } from './handlers/authHandler.js';
import {
  parseAndValidateRequest,
  routeAndExecuteAction,
  handleErrorResponse,
} from './handlers/requestHandler.js';

export default async ({ req, res, log, error }) => {
  const start = Date.now();
  const userId = req.headers['x-appwrite-user-id'] ?? 'unknown';
  let action = 'unknown';

  log(
    `Invocation Start. User ID: ${userId}. Method: ${req.method}. Path: ${req.path}.`
  );

  try {
    await authorizeRequest(userId);
    log(`User ${userId} authorized.`);

    const parsedRequest = parseAndValidateRequest(req);
    action = parsedRequest.action;
    const payload = parsedRequest.payload;
    log(
      `Action: ${action}. Payload keys: ${Object.keys(payload || {}).join(', ')}`
    );

    const resultData = await routeAndExecuteAction({
      action,
      payload,
    });

    const duration = Date.now() - start;
    log(`Action "${action}" executed successfully in ${duration}ms.`);
    return res.json({ success: true, data: resultData });
  } catch (e) {
    return handleErrorResponse({ e, action, res, errorLogger: error, start });
  }
};
