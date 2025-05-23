# State Management

Blueprint implements a multi-layered state management approach designed to handle different types of state effectively. This document explains the state management architecture and provides implementation guidance.

## State Management Architecture

Blueprint uses a three-tiered approach to state management:

1.  **Server State**: Managed by TanStack Query (React Query). Handles data fetched from external sources.
2.  **Global Client State**: Managed by Zustand. Handles application-wide state not directly tied to server data.
3.  **Local Component State**: Managed by React's built-in state hooks (`useState`, `useReducer`).

### State Management Layers

![State Management Layers](about:sanitized)

#### Server State (TanStack Query)

Manages asynchronous data fetched from external services like Appwrite (directly) and Meilisearch (directly or via `/api/search`). This includes:

  - Addons data (`useFetchAddons`, `useSearchAddons`)
  - Schematics data (`useFetchSchematics`, `useSearchSchematics`)
  - User profiles (`useUserStore` fetches initially, but related data might use TanStack Query)
  - Blog posts (`useFetchBlogs`, `useSearchBlogs`)
  - Tags (`useBlogTags`, `useSchematicTags`)
  - Search results

#### Global Client State (Zustand)

Manages synchronous, application-wide state accessible across components. This includes:

  - Authentication state (`userStore`)
  - User preferences (`userStore`)
  - Feature flag states (`featureFlagsStore`)
  - Theme preferences (`themeStore`)
  - Global UI states (e.g., modals, notifications - if managed globally)

#### Local Component State (React `useState`/`useReducer`)

Manages state that is temporary, component-specific, and not needed elsewhere. This includes:

  - Form input values before submission (often managed by React Hook Form).
  - Open/closed states for UI elements like dropdowns, accordions.
  - Component-specific loading or error states not covered by TanStack Query.
  - Temporary UI interaction states.

## TanStack Query Implementation

### API Endpoint Hooks

Custom TanStack Query hooks are centralized in `/src/api/endpoints/`. These hooks encapsulate data fetching logic, caching, and type safety. See `docs/api/endpoints.md` for detailed usage.

```typescript
// Example structure: src/api/endpoints/useAddons.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import type { Addon, AddonWithParsedFields } from '@/types'; // Use canonical types
import { addParsedFields } from './helpers'; // Example helper

// Fetch a single addon by ID (simplified)
export const useFetchAddon = (id?: string) => {
  return useQuery<AddonWithParsedFields | null>({ // Returns processed type
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;
      // Uses typed SDK method
      const addonDoc = await databases.getDocument<Addon>(DATABASE_ID, COLLECTION_ID, id);
      // Handles internal processing (e.g., parsing JSON strings)
      return addParsedFields(addonDoc);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Save (Create/Update) an addon (simplified)
export const useUpdateAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Expects validated input data, prepares it for Appwrite
    mutationFn: async ({ addonId, data }: { addonId: string; data: Partial<Addon> }) => {
      const dataToSave = prepareAddonForUpdate(data); // Handles serialization internaly
      // Uses typed SDK method
      return databases.updateDocument<Addon>(DATABASE_ID, COLLECTION_ID, addonId, dataToSave);
    },
    onSuccess: (updatedDoc) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['addons', 'list'] });
      queryClient.setQueryData(['addon', updatedDoc.$id], updatedDoc); // Update specific cache entry
    },
  });
};
```

### Search Hooks

Search hooks interact with Meilisearch (or the local `/api/search` endpoint) and return processed, typed results.

```typescript
// Example structure: src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import type { AddonWithParsedFields, SearchAddonResult, SearchAddonsProps } from '@/types';
import { processAddon } from './helpers'; // Example helper

export const useSearchAddons = (searchParams: SearchAddonsProps): SearchAddonResult => {
  return useQuery({ // Return type includes TanStack Query state + SearchResult fields
    queryKey: ['searchAddons', searchParams],
    queryFn: async () => {
      // Fetches from Meilisearch/API...
      const rawResults = await fetchFromSearchEngine(searchParams);
      // Processes results...
      const processedHits: AddonWithParsedFields[] = rawResults.hits.map(processAddon);
      return {
        data: processedHits,
        totalHits: rawResults.totalHits,
        // page, limit, hasNextPage etc.
      };
    },
    staleTime: 1000 * 60 * 1, // Cache search results briefly
    keepPreviousData: true, // Keep previous data visible while fetching new results
  });
};
```

### Query Client Configuration

The TanStack Query client is configured in `src/providers/AppProviders.tsx` (or `src/main.tsx`):

```typescript
// src/providers/AppProviders.tsx (Example location)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Import DevTools

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Default stale time: 5 minutes
      retry: 1, // Default retry attempts
      refetchOnWindowFocus: true, // Refetch when window gains focus
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add DevTools only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

// Wrap your App component with AppProviders in main.tsx or similar entry point
```

## Zustand Implementation

### Store Organization

Zustand stores are located in `/src/api/stores/`, each managing a specific slice of global client state.

### User Store (`userStore.ts`)

Manages authentication state, user profile data, and preferences fetched from Appwrite `account` service.

```typescript
// src/api/stores/userStore.ts
import { create } from 'zustand';
import type { User, UserPreferences } from '@/types'; // Use canonical types
import { account } from '@/config/appwrite';

interface UserState {
  user: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  logout: () => Promise<void>;
  // Other auth methods...
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  preferences: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      // Uses type casting for extended User type
      const userData = (await account.get()) as User;
      set({ user: userData, preferences: userData.prefs, isLoading: false, error: null });
    } catch (error) {
      console.error('User is not authenticated', error);
      set({ user: null, preferences: null, isLoading: false, error: 'Failed to fetch user' });
    }
  },

  updatePreferences: async (prefs: Partial<UserPreferences>) => {
    try {
      await account.updatePrefs(prefs);
      // Refresh user state after update
      await get().fetchUser();
    } catch (error) {
      console.error('Failed to update preferences', error);
      // Handle error state
    }
  },

  logout: async () => {
    try {
      await account.deleteSession('current');
      set({ user: null, preferences: null });
    } catch (error) {
      console.error('Logout failed', error);
      // Handle error appropriately
    }
  },
  // Other methods...
}));
```

### Feature Flag Store (`featureFlagsStore.ts`) (New)

Manages the state of feature flags fetched from Appwrite.

```typescript
// src/api/stores/featureFlagsStore.ts
import { create } from 'zustand';
import { fetchFeatureFlags } from '@/api/endpoints/useFeatureFlags'; // Import fetch function
import { useUserStore } from './userStore'; // Depends on user ID

interface FeatureFlagsState {
  flags: Record<string, boolean>; // Map of flag keys to boolean status
  isLoading: boolean;
  error: Error | null;
  isEnabled: (flagKey: string) => boolean; // Helper to check flag status
  refreshFlags: () => Promise<void>; // Action to fetch/update flags
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
  flags: {},
  isLoading: true,
  error: null,

  isEnabled: (flagKey: string): boolean => {
    return Boolean(get().flags[flagKey]);
  },

  refreshFlags: async (): Promise<void> => {
    // Uses current user ID (or anonymous)
    const userId = useUserStore.getState().user?.$id ?? 'anonymous';
    set({ isLoading: true });
    try {
      const featureFlags = await fetchFeatureFlags(userId); // Calls API endpoint
      set({ flags: featureFlags, isLoading: false, error: null });
    } catch (e) {
      console.error('Failed to fetch feature flags:', e);
      set({ isLoading: false, error: e instanceof Error ? e : new Error(String(e)) });
    }
  },
}));

// Store initializes and refreshes flags automatically on load and user change
// (See implementation in featureFlagsStore.ts for details)
```

### Theme Store (`themeStore.ts`)

Manages theme preferences, often persisted to `localStorage`.

```typescript
// src/api/stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Uses persistence

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system', // Default theme
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'blueprint-theme-storage', // localStorage key
    }
  )
);
```

### Using Stores in Components

Import the store hook and use selectors for optimized re-renders.

```tsx
// Example Component
import { useUserStore } from '@/api/stores/userStore';
import { useThemeStore } from '@/api/stores/themeStore';
import { useFeatureFlagsStore } from '@/api/stores/featureFlagsStore';

const UserStatus = () => {
  // Select only the user's name - component only re-renders if name changes
  const userName = useUserStore((state) => state.user?.name);
  const logout = useUserStore((state) => state.logout); // Select action

  const theme = useThemeStore((state) => state.theme); // Select state
  const setTheme = useThemeStore((state) => state.setTheme); // Select action

  // Use the helper function from the feature flag store
  const isNewDashboardEnabled = useFeatureFlagsStore((state) => state.isEnabled('new_dashboard'));

  return (
    <div>
      {userName ? `Welcome, ${userName}` : 'Welcome, Guest'}
      {/* ... UI elements using theme, setTheme, logout, isNewDashboardEnabled ... */}
      {isNewDashboardEnabled && <p>Check out the new dashboard!</p>}
    </div>
  );
};
```

## Local Component State

Local component state uses React's built-in hooks (`useState`, `useReducer`) for state that is temporary, component-specific, and not needed elsewhere.

```tsx
import { useState, useReducer } from 'react';

const FormComponent = () => {
  // Simple state with useState
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Complex state with useReducer
  const [formState, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_FIELD':
          return { ...state, [action.field]: action.value };
        case 'RESET':
          return initialState; // Assume initialState is defined
        default:
          return state;
      }
    },
    {
      submitted: false,
      valid: false,
      errors: {},
    }
  );

  // Component implementation...
};
```

## State Management Best Practices

### When to Use Each Type of State

| State Type     | When to Use                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| TanStack Query | For data from external sources that needs caching, refetching, background updates.    |
| Zustand        | For application-wide client state that needs to be shared across unrelated components. |
| React State    | For component-specific state not needed elsewhere (UI state, temporary form values).  |

### Data Flow Patterns

Follow these patterns for consistent data flow:

1.  **Unidirectional Data Flow**: Data generally flows down from hooks/stores to components, and actions/events flow up from components to trigger state changes via hook mutations or store actions.
2.  **Container/Presentational Pattern**: Consider separating components responsible for data fetching/logic (containers, often using hooks) from components focused solely on rendering UI (presentational).

Example of Container/Presentational pattern:

```tsx
// Container component using hooks
const AddonListContainer = () => {
  const { data, isLoading, error } = useFetchAddons(1, 10); // Example fetch hook

  if (isLoading) return <LoadingOverlay />;
  if (error) return <ErrorMessage error={error} />;

  // Pass only the necessary data down
  return <AddonList addons={data?.addons} />;
};

// Presentational component only receiving props
const AddonList = ({ addons }) => {
  if (!addons || addons.length === 0) {
     return <p>No addons found.</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-4">
      {addons.map(addon => (
        <AddonCard key={addon.$id} addon={addon} />
      ))}
    </div>
  );
};
```

### State Persistence

Some state needs to persist across sessions:

1.  **Theme Preferences**: Stored in `localStorage` using Zustand `persist` middleware (`themeStore`).
2.  **User Settings/Preferences**: Stored in the Appwrite user's `prefs` object (`userStore` fetches and updates these).
3.  **Authentication**: Managed by secure HTTP-only cookies set by Appwrite during session creation. The frontend checks session validity via `account.get()`.

### State Debugging

For debugging state:

1.  **TanStack Query DevTools**: Include in development builds for visualizing query states, cache, etc.
    ```tsx
    // In AppProviders or similar
    import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
     <>
       {/* ... other providers */}
       {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
     </>
    ```
2.  **Redux DevTools for Zustand**: Connect Zustand stores to the Redux DevTools browser extension for inspecting state changes and actions.
    ```typescript
    // In your store definition
    import { devtools } from 'zustand/middleware';

    export const useMyStore = create<MyState>()(
      devtools(
        (set) => ({
          // store implementation...
        }),
        { name: "MyStore" } // Optional name for DevTools
      )
    );
    ```

## Performance Considerations

1.  **State Selectors**: Use selectors (`useStore(state => state.specificValue)`) with Zustand and TanStack Query's `select` option to prevent components from re-rendering when unrelated parts of the state change.
2.  **Memoization**: Use `useMemo` for expensive calculations derived from state and `useCallback` for stabilizing function references passed as props, preventing unnecessary re-renders in child components.
3.  **Query Cache Configuration**: Tune TanStack Query's `staleTime` and `gcTime` (cacheTime) based on how frequently data updates, balancing freshness with performance.

## Error Handling Strategy

1.  **Query/Mutation Errors**: Handle errors returned by TanStack Query hooks (`error`, `isError` states) within components to display appropriate UI feedback (e.g., error messages, retry buttons). Use `onError` callbacks in `useMutation` for side effects like logging or showing toasts.
2.  **Global Errors**: Consider a global Zustand store or React Context to handle critical application-wide errors (e.g., failed initial data load, major API outages).
3.  **Error Boundaries**: Use React Error Boundaries to catch rendering errors in specific parts of the UI and prevent crashing the entire application.

## Related Documentation

  - [Architecture Overview](./overview.md)
  - [Data Flow](./data-flow.md)
  - [API Endpoints](../api/endpoints.md)
  - [Appwrite Integration](../api/appwrite.md)
  - [Zod Validation Guide](../guides/zod-validation-guide.md)