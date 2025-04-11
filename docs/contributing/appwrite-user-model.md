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
  roles?: string[];
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

## Common Patterns

### Checking User Roles

```typescript
const isAdmin = userData.prefs.roles?.includes('admin') || false;
```

### Checking Beta Access

```typescript
const hasBetaAccess = userData.prefs.betaTester?.isActive && 
                      userData.prefs.betaTester.features.includes('feature-name');
```