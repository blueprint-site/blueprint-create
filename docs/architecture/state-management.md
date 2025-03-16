# State Management

Blueprint implements a multi-layered state management approach designed to handle different types of state effectively. This document explains the state management architecture and provides implementation guidance.

## State Management Architecture

Blueprint uses a three-tiered approach to state management:

1. **Server State**: Managed by TanStack Query
2. **Global Client State**: Managed by Zustand
3. **Local Component State**: Managed by React's built-in state

### State Management Layers

![State Management Layers](../assets/state-management-layers.png)

#### Server State (TanStack Query)

Server state represents data fetched from external services like Appwrite and Meilisearch. This includes:

- Addons data
- Schematics data
- User profiles
- Blog posts
- Search results

#### Global Client State (Zustand)

Global client state represents application-wide state that's not tied to server data. This includes:

- Authentication state
- Theme preferences
- UI settings
- Modal/dialog states
- Navigation state

#### Local Component State (React useState/useReducer)

Local component state is specific to individual components and not needed elsewhere. This includes:

- Form input values
- Open/closed states for dropdowns
- Scroll positions
- Temporary UI states

## TanStack Query Implementation

### API Endpoint Hooks

Blueprint organizes TanStack Query hooks in the `/src/api/endpoints` directory. Each file typically exports a set of hooks for a specific feature:

```typescript
// src/api/endpoints/useAddons.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import { Addon } from '@/types';

// Fetch a single addon by slug
export const useFetchAddon = (slug?: string) => {
  return useQuery<Addon | null>({
    queryKey: ['addon', slug],
    queryFn: async () => {
      if (!slug) return null;
      // Implementation details...
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Fetch a list of addons
export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery<{
    addons: Addon[];
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    queryKey: ['addons', page, limit],
    queryFn: async () => {
      // Implementation details...
    },
  });
};

// Save an addon
export const useSaveAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addon: Partial<Addon>) => {
      // Implementation details...
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};
```

### Search Hooks

Search functionality uses TanStack Query with Meilisearch:

```typescript
// src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import { meilisearch } from '@/config/meilisearch';
import { Addon } from '@/types';

export const useSearchAddons = (
  query: string,
  filters?: string,
  page: number = 1,
  hitsPerPage: number = 20
) => {
  return useQuery<{
    hits: Addon[];
    total: number;
    page: number;
    hitsPerPage: number;
    totalPages: number;
  }>({
    queryKey: ['search', 'addons', query, filters, page, hitsPerPage],
    queryFn: async () => {
      const index = meilisearch.index('addons');
      const results = await index.search(query, {
        filter: filters,
        page,
        hitsPerPage,
      });
      
      return {
        hits: results.hits as Addon[],
        total: results.estimatedTotalHits,
        page: results.page,
        hitsPerPage: results.hitsPerPage,
        totalPages: Math.ceil(results.estimatedTotalHits / results.hitsPerPage),
      };
    },
    staleTime: 1000 * 60, // Cache for 1 minute
  });
};
```

### Query Client Configuration

The TanStack Query client is configured in `src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Zustand Implementation

### Store Organization

Zustand stores are organized in the `/src/api/stores` directory, with each store focused on a specific feature or concern:

```typescript
// src/api/stores/userStore.ts
import { create } from 'zustand';
import { User, UserPreferences } from '@/types';

interface UserState {
  user: User | null;
  preferences: UserPreferences | null;
  error: string | null;
  
  // Methods
  fetchUser: () => Promise<void>;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
  // Other methods...
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  preferences: null,
  error: null,
  
  fetchUser: async () => {
    // Implementation...
  },
  
  updatePreferences: async (prefs: UserPreferences) => {
    // Implementation...
  },
  
  // Other methods...
}));
```

### Theme Store Example

The theme store manages theme preferences:

```typescript
// src/api/stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'blueprint-theme',
    }
  )
);
```

### Using Stores in Components

Stores are used in components by importing the store hook and selecting the specific state or actions needed:

```tsx
import { useUserStore } from '@/api/stores/userStore';
import { useThemeStore } from '@/api/stores/themeStore';

const Header = () => {
  // Select only the specific state needed
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  
  // Component implementation...
};
```

## Local Component State

Local component state uses React's built-in hooks:

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
          return initialState;
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

| State Type | When to Use |
|------------|-------------|
| TanStack Query | For data from external sources that needs caching, refetching, background updates |
| Zustand | For application-wide state that persists across pages and components |
| React State | For component-specific state that doesn't need to be shared |

### Data Flow Patterns

Follow these patterns for consistent data flow:

1. **Unidirectional Data Flow**: Data flows down, actions flow up
2. **Container/Presentational Pattern**: Separate data fetching from presentation
3. **Derived State**: Calculate derived state in components rather than storing it

Example of Container/Presentational pattern:

```tsx
// Container component
const AddonListContainer = () => {
  const { data, isLoading, error } = useFetchAddons(1, 10);
  
  if (isLoading) return <LoadingOverlay />;
  if (error) return <ErrorMessage error={error} />;
  
  return <AddonList addons={data.addons} />;
};

// Presentational component
const AddonList = ({ addons }) => {
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

1. **Theme Preferences**: Stored using Zustand persist middleware
2. **User Settings**: Stored in Appwrite user preferences
3. **Authentication**: Managed by Appwrite sessions

### State Debugging

For debugging state:

1. **TanStack Query DevTools**: Include in development builds
   ```tsx
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   
   // In App component
   <>
     <RouterProvider router={router} />
     {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
   </>
   ```

2. **Redux DevTools for Zustand**: Connect Zustand to Redux DevTools
   ```tsx
   import { devtools } from 'zustand/middleware';
   
   export const useStore = create<State>()(
     devtools(
       (set) => ({
         // store implementation
       })
     )
   );
   ```

## Performance Considerations

1. **State Selectors**: Use selectors to prevent unnecessary re-renders
   ```tsx
   // Bad: selecting the entire state
   const state = useStore();
   
   // Good: selecting only what's needed
   const count = useStore(state => state.count);
   ```

2. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations or callbacks
   ```tsx
   const memoizedValue = useMemo(
     () => computeExpensiveValue(a, b),
     [a, b]
   );
   ```

3. **Query Cache Configuration**: Configure TanStack Query cache settings for optimal performance
   ```tsx
   useQuery({
     queryKey: ['data'],
     queryFn: fetchData,
     staleTime: 1000 * 60 * 5, // 5 minutes
     cacheTime: 1000 * 60 * 30, // 30 minutes
   });
   ```

## Error Handling Strategy

1. **Query Error Handling**: Handle errors at the query level
   ```tsx
   const { data, error, isError } = useQuery({
     queryKey: ['data'],
     queryFn: fetchData,
     onError: (error) => {
       console.error('Query error:', error);
       // Show toast or other user feedback
     },
   });
   ```

2. **Mutation Error Handling**: Handle errors during data mutations
   ```tsx
   const mutation = useMutation({
     mutationFn: updateData,
     onError: (error) => {
       console.error('Mutation error:', error);
       // Show error feedback
     },
   });
   ```

3. **Global Error State**: Track global error state for critical errors
   ```tsx
   // In a global error store
   interface ErrorState {
     globalError: Error | null;
     setGlobalError: (error: Error | null) => void;
   }
   ```

## Related Documentation

- [Architecture Overview](./overview.md)
- [Data Flow](./data-flow.md)
- [API Integration](../api/endpoints.md)
