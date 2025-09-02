# User Management Function

This Appwrite function provides admin-level user management operations.

## Setup

1. Deploy this function to your Appwrite instance
2. Configure function scopes in Appwrite Console:
   - `users.read`
   - `users.write`
   - `teams.read`
   - `teams.write`
   - `sessions.write`
3. Set the following environment variables (optional):
   - `APPWRITE_ENDPOINT`: Your Appwrite endpoint URL (default: uses function's endpoint)
   - `ADMIN_TEAM_ID`: ID of your admin team (default: 'admin')

Note: `APPWRITE_FUNCTION_PROJECT_ID` and `APPWRITE_FUNCTION_API_KEY` are automatically provided by Appwrite.

## Security

- Function requires JWT authentication
- Only users in the admin team can execute operations
- All operations are logged

## Available Actions

- `listUsers`: List all users
- `getUser`: Get a specific user
- `createUser`: Create a new user
- `updateUser`: Update user details
- `deleteUser`: Delete a user
- `updateUserStatus`: Enable/disable user account
- `updateUserLabels`: Update user labels
- `updateEmailVerification`: Update email verification status
- `resetUserPassword`: Reset user password
- `updateTeamMembership`: Add/remove user from teams
- `getUserSessions`: Get user sessions
- `deleteUserSessions`: Delete all user sessions
