It looks like you've provided the content for `data-flow.md` again.

Assuming you'd like to proceed with the next file we identified, here is the content for `docs/contributing/appwrite-user-model.md`. Since this file was added in the refactor, this reflects the intended final state based on the changes:

# Appwrite User Model Integration

This document explains how Blueprint integrates with Appwrite's user model.

## Understanding Appwrite's User Model

Unlike other data in Appwrite, users are not stored as standard `Documents` in collections. Instead, they are managed through the Appwrite Account API, which returns a `Models.User<Models.Preferences>` type.

### Key Differences from Document Models

1.  Users are accessed through `account.get()` instead of `databases.getDocument()`
2.  User data extends `Models.User`, not `Models.Document`
3.  User preferences are stored in a flexible object (`prefs`) that can be modified with `account.updatePrefs()`

## Blueprint's User Type Structure

We extend Appwrite's models to add our custom fields, defined in `src/types/appwrite.ts`:

```typescript
// src/types/appwrite.ts

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
  betaTester?: BetaTesterPrefs; // Example custom preference structure
};

// Definition for BetaTesterPrefs (example)
export interface BetaTesterPrefs {
  isActive: boolean;
  joinDate: string; // ISO Date string
  features: string[]; // Features they have access to test
  group?: string;
}

// Extended user model using the custom preferences
export type User = Models.User<UserPreferences>;
```

## Using the User Model

### Fetching Users

The `userStore` (`src/api/stores/userStore.ts`) handles fetching the current user. It uses type casting to apply our extended `User` type.

```typescript
// Simplified from userStore.ts fetchUser method
import type { User } from '@/types'; // Import our extended User type

async function fetchCurrentUser() {
  try {
    // Cast the result from account.get() to our extended User type
    const userData = await account.get() as User;

    // Now userData has access to both standard User fields and custom prefs
    console.log(userData.name); // Standard field
    console.log(userData.prefs.theme); // Custom preference
    if (userData.prefs.betaTester?.isActive) { // Access nested custom prefs safely
      console.log('User is an active beta tester');
    }
    // Store userData in Zustand state
    // set({ user: userData, preferences: userData.prefs });
    return userData;
  } catch (error) {
    console.error('User not authenticated:', error);
    // set({ user: null, preferences: null });
    return null;
  }
}
```

### Updating Preferences

Use `account.updatePrefs()` with an object matching the structure of our extended `UserPreferences`.

```typescript
// Example: Enabling beta access for a user
import { account } from '@/config/appwrite';
import type { UserPreferences, BetaTesterPrefs } from '@/types'; // Import preference types

async function enableBetaAccess(newFeatures: string[]) {
  try {
    const betaPrefs: BetaTesterPrefs = {
      isActive: true,
      joinDate: new Date().toISOString(),
      features: newFeatures,
    };

    // Construct the update object matching UserPreferences
    const prefsUpdate: Partial<UserPreferences> = {
      betaTester: betaPrefs,
      // You can update other preferences simultaneously
      // theme: 'dark',
    };

    // Update the preferences for the currently logged-in user
    await account.updatePrefs(prefsUpdate);

    // Optionally: Refresh user state in the store
    // useUserStore.getState().fetchUser();

  } catch (error) {
    console.error('Failed to update preferences:', error);
  }
}
```

## Best Practices

1.  **Canonical Types**: Define `User` and `UserPreferences` in `src/types/appwrite.ts` as the single source of truth for the user data structure.
2.  **Type Casting**: Use type casting (`as User`) when calling `account.get()` to inform TypeScript about the extended preference structure. This is necessary because the SDK's base `account.get()` returns `Models.User<Models.Preferences>`.
3.  **Preference Updates**: When updating preferences using `account.updatePrefs(prefs)`, Appwrite performs a *merge* operation by default. However, be mindful of nested objects; updating a nested object often requires providing the entire new nested object structure.
4.  **Session Management**: Use `account.getSession('current')`, `account.createEmailPasswordSession()`, `account.deleteSession('current')`, etc., for managing authentication state, not just `account.get()`.
5.  **Store Integration**: Centralize user state management within `userStore.ts` for consistency.

## Common Patterns

### Checking User Roles (Secure Method)

```typescript
import { useUserStore } from '@/api/stores/userStore';
import { teams } from '@/config/appwrite';

function UserProfile() {
  const user = useUserStore((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.$id) {
      checkAdminRole(user.$id).then(setIsAdmin);
    }
  }, [user?.$id]);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const ADMIN_TEAM_ID = '67aee1ab00037d3646b9';
      const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
      return teamMemberships.memberships.some(
        membership => membership.userId === userId
      );
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  return (
    <div>
      <p>Welcome, {user?.name ?? 'Guest'}</p>
      {isAdmin && <p>Admin controls available.</p>}
    </div>
  );
}
```

### Legacy Role Checking (Deprecated)

```typescript
// ❌ DEPRECATED: Don't use preferences for roles (insecure)
function UserProfileLegacy() {
  const user = useUserStore((state) => state.user);

  // This is insecure - preferences are client-accessible
  const isAdmin = user?.prefs?.roles?.includes('admin') || false;
  const isModerator = user?.prefs?.roles?.includes('moderator') || false;

  return (
    <div>
      <p>Welcome, {user?.name ?? 'Guest'}</p>
      {isAdmin && <p>Admin controls available.</p>}
    </div>
  );
}
```

### Checking Beta Access

```typescript
import { useUserStore } from '@/api/stores/userStore';

function BetaFeatureComponent() {
  const user = useUserStore((state) => state.user);

  // Check specific beta feature access
  const canAccessFeature = user?.prefs?.betaTester?.isActive &&
                           user.prefs.betaTester.features.includes('new-upload-ui');

  if (!canAccessFeature) {
    return null; // Or show an alternative component
  }

  return (
    <div>
      {/* Render the beta feature */}
      <h2>New Upload UI (Beta)</h2>
      {/* ... */}
    </div>
  );
}
```