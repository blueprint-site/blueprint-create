const sdk = require("node-appwrite");

module.exports = async function (context) {
  // Destructure the context object that Appwrite provides
  const { req, res, log, error: logError } = context;

  // Add some debugging
  log("Function called with context keys:", Object.keys(context));
  log("Request object keys:", req ? Object.keys(req) : "No req object");
  log("Request headers:", req?.headers);
  log("Request body:", req?.body);
  log("Request payload:", req?.payload);

  // Extract headers for JWT validation
  const headers = req?.headers || {};

  // Initialize Appwrite SDK with the API key you configured
  // Check for both function-specific and global API key
  const apiKey =
    process.env.APPWRITE_FUNCTION_API_KEY ||
    process.env.APPWRITE_API_KEY ||
    process.env.API_KEY;

  log("Environment check:", {
    projectId: process.env.APPWRITE_FUNCTION_PROJECT_ID,
    hasApiKey: !!apiKey,
    apiKeySource: apiKey
      ? process.env.APPWRITE_FUNCTION_API_KEY
        ? "APPWRITE_FUNCTION_API_KEY"
        : process.env.APPWRITE_API_KEY
          ? "APPWRITE_API_KEY"
          : process.env.API_KEY
            ? "API_KEY"
            : "unknown"
      : "none",
    endpoint: process.env.APPWRITE_ENDPOINT,
    allEnvKeys: Object.keys(process.env).filter(
      (key) => key.includes("APPWRITE") || key.includes("API"),
    ),
  });

  const client = new sdk.Client()
    .setEndpoint(
      process.env.APPWRITE_ENDPOINT || "https://api.blueprint-create.com/v1",
    )
    .setProject(
      process.env.APPWRITE_FUNCTION_PROJECT_ID || "683770670016d1661c37",
    );

  if (apiKey) {
    client.setKey(apiKey);
    log("Using configured API key for authentication");
  } else {
    log("WARNING: No API key found in environment variables");
  }

  log("SDK initialized with:", {
    endpoint:
      process.env.APPWRITE_ENDPOINT || "https://api.blueprint-create.com/v1",
    projectId:
      process.env.APPWRITE_FUNCTION_PROJECT_ID || "683770670016d1661c37",
    hasApiKey: !!apiKey,
  });

  const users = new sdk.Users(client);
  const teams = new sdk.Teams(client);

  log("Using function built-in permissions with scopes:", {
    projectId:
      process.env.APPWRITE_FUNCTION_PROJECT_ID || "683770670016d1661c37",
    endpoint:
      process.env.APPWRITE_ENDPOINT || "https://api.blueprint-create.com/v1",
  });

  // Parse request body - check different possible locations
  let body;
  try {
    // Check req.body first (most common)
    if (req?.body) {
      if (typeof req.body === "string") {
        body = JSON.parse(req.body);
      } else if (typeof req.body === "object") {
        body = req.body;
      }
    }
    // Check req.payload as alternative
    else if (req?.payload) {
      if (typeof req.payload === "string") {
        body = JSON.parse(req.payload);
      } else if (typeof req.payload === "object") {
        body = req.payload;
      }
    }
    // Fallback to variables or default
    else {
      body = { action: "listUsers", payload: {} };
    }

    log("Parsed body:", body);
  } catch (err) {
    logError("Body parsing error:", err);
    return res.json({ error: "Invalid JSON body", details: err.message }, 400);
  }

  const { action, payload = {} } = body;

  // Verify JWT token from request headers (headers already extracted above)

  // Try to find JWT in various places
  const jwt =
    headers["x-appwrite-jwt"] ||
    headers["X-Appwrite-JWT"] ||
    headers["X-APPWRITE-JWT"] ||
    headers["authorization"]?.replace("Bearer ", "") ||
    headers["Authorization"]?.replace("Bearer ", "") ||
    payload.jwt || // Try payload
    body.jwt; // Try body

  // Log JWT search results
  log("JWT search results:", {
    availableHeaders: Object.keys(headers),
    fromHeaders: !!headers["x-appwrite-jwt"] || !!headers["X-Appwrite-JWT"],
    fromAuth: !!headers["authorization"] || !!headers["Authorization"],
    fromPayload: !!payload.jwt,
    fromBody: !!body.jwt,
    finalJwt: !!jwt,
  });

  if (!jwt) {
    // For now, let's continue without JWT to test the function structure
    log("WARNING: Proceeding without JWT for debugging");
    // return res.json({
    //   error: 'Unauthorized - JWT token required',
    //   receivedHeaders: headers ? Object.keys(headers) : 'No headers object',
    //   debug: 'No JWT found in headers'
    // }, 401);
  }

  try {
    // With API key configured, the function has admin permissions
    // JWT is still passed for audit purposes but not validated
    if (jwt) {
      log(
        "Request includes JWT for audit trail - using function API key for operations",
      );
    } else {
      log("No JWT provided - using function API key for operations");
    }

    // Continue using the main client with function's built-in permissions for admin operations

    // Handle different actions
    switch (action) {
      case "listUsers": {
        const { search, queries = [] } = payload;
        // Note: limit and offset are handled via queries if needed
        const result = await users.list(queries, search);
        return res.json({ success: true, data: result });
      }

      case "getUser": {
        const { userId } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }
        const user = await users.get(userId);
        return res.json({ success: true, data: user });
      }

      case "createUser": {
        const { email, password, name, phone, labels, emailVerification } =
          payload;
        if (!email || !password || !name) {
          return res.json(
            { success: false, error: "email, password, and name are required" },
            400,
          );
        }

        // Generate unique ID
        const userId = sdk.ID.unique();

        // Create user
        const user = await users.create(userId, email, phone, password, name);

        // Update labels if provided
        if (labels && labels.length > 0) {
          await users.updateLabels(userId, labels);
        }

        // Update email verification if specified
        if (emailVerification === true) {
          await users.updateEmailVerification(userId, true);
        }

        // Add to teams based on labels
        if (labels && labels.includes("admin")) {
          try {
            const adminTeamId = process.env.ADMIN_TEAM_ID || "admin";
            await teams.createMembership(
              adminTeamId,
              ["owner"],
              userId,
              email,
              undefined,
              undefined,
              name,
            );
          } catch (error) {
            console.error("Failed to add user to admin team:", error);
          }
        }

        if (labels && labels.includes("beta_tester")) {
          try {
            await teams.createMembership(
              "beta_testers",
              ["member"],
              userId,
              email,
              undefined,
              undefined,
              name,
            );
          } catch (error) {
            console.error("Failed to add user to beta_testers team:", error);
          }
        }

        return res.json({ success: true, data: user });
      }

      case "updateUser": {
        const { userId, updates } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }

        let user = await users.get(userId);

        // Update basic fields
        if (updates.name !== undefined) {
          user = await users.updateName(userId, updates.name);
        }
        if (updates.email !== undefined) {
          user = await users.updateEmail(userId, updates.email);
        }
        if (updates.phone !== undefined) {
          user = await users.updatePhone(userId, updates.phone);
        }
        if (updates.labels !== undefined) {
          user = await users.updateLabels(userId, updates.labels);
        }
        if (updates.emailVerification !== undefined) {
          user = await users.updateEmailVerification(
            userId,
            updates.emailVerification,
          );
        }
        if (updates.phoneVerification !== undefined) {
          user = await users.updatePhoneVerification(
            userId,
            updates.phoneVerification,
          );
        }

        return res.json({ success: true, data: user });
      }

      case "deleteUser": {
        const { userId } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }
        await users.delete(userId);
        return res.json({ success: true, data: null });
      }

      case "updateUserStatus": {
        const { userId, status } = payload;
        if (!userId || status === undefined) {
          return res.json(
            { success: false, error: "userId and status are required" },
            400,
          );
        }
        const user = await users.updateStatus(userId, status);
        return res.json({ success: true, data: user });
      }

      case "updateUserLabels": {
        const { userId, labels } = payload;
        if (!userId || !Array.isArray(labels)) {
          return res.json(
            { success: false, error: "userId and labels array are required" },
            400,
          );
        }
        const user = await users.updateLabels(userId, labels);
        return res.json({ success: true, data: user });
      }

      case "updateEmailVerification": {
        const { userId, emailVerification } = payload;
        if (!userId || emailVerification === undefined) {
          return res.json(
            {
              success: false,
              error: "userId and emailVerification are required",
            },
            400,
          );
        }
        const user = await users.updateEmailVerification(
          userId,
          emailVerification,
        );
        return res.json({ success: true, data: user });
      }

      case "resetUserPassword": {
        const { userId } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }
        // Generate a new random password
        const newPassword = generateRandomPassword();
        const user = await users.updatePassword(userId, newPassword);

        // In production, you'd want to send this password to the user via email
        // For now, we'll return it in the response (only for development)
        return res.json({
          success: true,
          data: {
            user,
            temporaryPassword: newPassword,
            message:
              "Password reset successfully. Please share the temporary password with the user securely.",
          },
        });
      }

      case "updateTeamMembership": {
        const { userId, teamId, add } = payload;
        if (!userId || !teamId || add === undefined) {
          return res.json(
            { success: false, error: "userId, teamId, and add are required" },
            400,
          );
        }

        try {
          if (add) {
            // Get user details first
            const user = await users.get(userId);
            // Add user to team
            await teams.createMembership(
              teamId,
              ["member"],
              userId,
              user.email,
              undefined,
              undefined,
              user.name,
            );
          } else {
            // Remove user from team
            // First, we need to find the membership
            const memberships = await teams.listMemberships(teamId);
            const membership = memberships.memberships.find(
              (m) => m.userId === userId,
            );
            if (membership) {
              await teams.deleteMembership(teamId, membership.$id);
            }
          }
          return res.json({ success: true, data: null });
        } catch (error) {
          return res.json({ success: false, error: error.message }, 400);
        }
      }

      case "getUserSessions": {
        const { userId } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }
        const sessions = await users.listSessions(userId);
        return res.json({ success: true, data: sessions });
      }

      case "deleteUserSessions": {
        const { userId } = payload;
        if (!userId) {
          return res.json({ success: false, error: "userId is required" }, 400);
        }
        await users.deleteSessions(userId);
        return res.json({ success: true, data: null });
      }

      default:
        return res.json(
          { success: false, error: `Unknown action: ${action}` },
          400,
        );
    }
  } catch (error) {
    logError("Function error:", error);
    return res.json(
      {
        success: false,
        error: error.message || "Internal server error",
        details: error.response || undefined,
      },
      error.code || 500,
    );
  }
};

// Helper function to generate a random password
function generateRandomPassword() {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
