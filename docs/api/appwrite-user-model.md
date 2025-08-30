# Appwrite User Model Integration

This document explains how Blueprint integrates with Appwrite's user model.

## Understanding Appwrite's User Model

Unlike other data in Appwrite, users are not stored as standard `Documents` in collections. Instead, they are managed through the Appwrite Account API, which returns a `Models.User<Models.Preferences>` type.

### Key Differences from Document Models

1. Users are accessed through `account.get()` instead of `databases.getDocument()`
2. User data extends `Models.User`, not `Models.Document`
3. User preferences are stored in a flexible object (`prefs`) that can be modified with `account.updatePrefs()`

## Blueprint's User Type Structure

We extend Appwrite's models to add our custom fields:

```typescript
// Extended user preferences
export interface UserPreferences extends Models.Preferences {
  theme?: 'light' | 'dark';
  language?: string;
  notificationsEnabled?: boolean;
  avatar?: string;
  bio?: string;
  // NOTE: roles field is deprecated - use Appwrite Teams for secure role management
  roles?: string[]; // @deprecated Use Appwrite Teams instead
  easterEggs?: {
    discovered: string[];
    enabled: Record<string, boolean>;
    lastDiscovery?: number;
  } | null;
  betaTester?: BetaTesterPrefs;
};

// Extended user model
export type User = Models.User<UserPreferences>;
```

## Security Considerations

**⚠️ IMPORTANT**: User preferences (`prefs`) are client-side accessible and should **NEVER** be used for storing sensitive data or security-related information like roles, permissions, or access levels.

### What NOT to store in preferences:
- User roles or permissions
- Access levels or security clearances
- Sensitive configuration data
- Any data that should not be readable by the client

### What's safe to store in preferences:
- UI themes and appearance settings
- Language preferences
- Notification preferences
- User profile information (bio, avatar)
- Non-sensitive feature flags
- Easter egg progress

### Secure Role Management

For role-based access control, use **Appwrite Teams** instead of preferences:

```typescript
// ❌ DON'T: Store roles in preferences (insecure)
await account.updatePrefs({
  roles: ['admin'] // Client can modify this!
});

// ✅ DO: Use Appwrite Teams for roles (secure)
import { teams } from '@/config/appwrite';

// Add user to admin team
await teams.createMembership(
  'ADMIN_TEAM_ID', 
  ['admin'], 
  user.email
);

// Check team membership securely
const teamMemberships = await teams.listMemberships('ADMIN_TEAM_ID');
const isAdmin = teamMemberships.memberships.some(
  membership => membership.userId === user.$id
);
```

## Using the User Model

### Fetching Users

```typescript
// Cast the result to our extended User type
const userData = await account.get() as User;

// Access custom preferences
if (userData.prefs.betaTester?.isActive) {
  // User is a beta tester
}
```

### Updating Preferences

```typescript
// Directly update preferences with our extended type
await account.updatePrefs({
  theme: 'dark',
  betaTester: {
    isActive: true,
    joinDate: new Date().toISOString(),
    features: ['advanced-search', 'new-upload-ui']
  }
});
```

## Best Practices

1. **No Mapping Functions Needed**: With proper type extension, we don't need mapping functions between Appwrite types and our application types.

2. **Type Casting**: Use type casting (`as User`) when getting user data to ensure TypeScript recognizes our custom fields.

3. **Preference Updates**: When updating user preferences, always update the entire object to avoid unexpected overwrites.

4. **Session Management**: For user authentication status, use Appwrite's session methods (`listSessions`, `createEmailPasswordSession`, etc.).

5. **🔒 Security First**: Never store sensitive data in user preferences. Use Appwrite Teams for roles and permissions.

6. **Team-Based Access Control**: Leverage Appwrite's built-in team system for secure role management instead of client-accessible preferences.

## Common Patterns

### Checking User Roles (Secure Method)

```typescript
// ✅ RECOMMENDED: Check team membership for roles
import { teams } from '@/config/appwrite';

const ADMIN_TEAM_ID = '67aee1ab00037d3646b9';

async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
    return teamMemberships.memberships.some(
      membership => membership.userId === userId
    );
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

// Usage in components
const user = await account.get();
const isAdmin = await checkAdminRole(user.$id);
```

### Legacy Role Checking (Deprecated)

```typescript
// ❌ DEPRECATED: Don't use preferences for roles (insecure)
const isAdmin = userData.prefs.roles?.includes('admin') || false;
```

### Checking Beta Access (Safe for Preferences)

```typescript
// ✅ Safe: Non-sensitive feature flags can use preferences
const hasBetaAccess = userData.prefs.betaTester?.isActive && 
                      userData.prefs.betaTester.features.includes('feature-name');
```

### Team Management Examples

```typescript
// Add user to a team
await teams.createMembership(
  'TEAM_ID',
  ['member'], // roles within the team
  'user@example.com',
  'https://yourapp.com/welcome', // redirect URL
  'User Name'
);

// Remove user from team
await teams.deleteMembership('TEAM_ID', 'MEMBERSHIP_ID');

// List all team members
const memberships = await teams.listMemberships('TEAM_ID');
```