# Code Standards

This guide outlines the coding standards and best practices for the Blueprint project. Following these standards ensures consistency across the codebase and makes collaboration easier.

## TypeScript Standards

### Type Safety

- Always use TypeScript for new files
- Define proper interfaces for props, state, and data models
- Avoid using `any` type - use specific types or `unknown` when necessary
- Use type guards to narrow types when working with `unknown`
- Use function overloads for complex function signatures

```typescript
// 🟢 Good: Props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: React.ReactNode;
}

// 🟢 Good: Discriminated union type
type AddonSource = 
  | { type: 'curseforge'; id: string; data: CurseForgeData }
  | { type: 'modrinth'; id: string; data: ModrinthData };

// 🔴 Bad: Using any
const parseData = (data: any) => { ... }

// 🟢 Good: Using unknown with type guard
const parseData = (data: unknown) => {
  if (isValidData(data)) {
    // Now TypeScript knows data is ValidData
    return data.value;
  }
  throw new Error('Invalid data format');
};
```

### Naming Conventions

- Use PascalCase for component names, interfaces, and types
- Use camelCase for variables, functions, and methods
- Use UPPER_SNAKE_CASE for constants
- Prefix interfaces with `I` only for type declaration files (.d.ts)
- Prefix type parameters (generics) with `T` (e.g., `TData`)

## React Component Standards

### Component Structure

- Keep components focused on a single responsibility
- Break large components into smaller, reusable pieces
- Use function components with hooks instead of class components
- Group related hooks at the beginning of the component

```tsx
// 🟢 Good: Focused component with grouped hooks
const AddonCard = ({ addon }: AddonCardProps) => {
  // State hooks
  const [expanded, setExpanded] = useState(false);
  
  // Effect hooks
  useEffect(() => {
    // Effect logic
  }, [addon.id]);
  
  // Custom hooks
  const { isLoading, error, data } = useAddonDetails(addon.id);
  
  // Handlers
  const handleExpand = () => setExpanded(!expanded);
  
  // Render helpers
  const renderBadges = () => (
    <div className="flex gap-2">
      {addon.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
    </div>
  );
  
  // Component render
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};
```

### Props and State

- Destructure props in the component parameters
- Set default values using parameter defaults, not conditionals inside the component
- Keep state minimal and focused
- Use derived state when possible instead of duplicating state

```tsx
// 🟢 Good: Destructured props with defaults
const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  icon
}: ButtonProps) => {
  // Component implementation
};

// 🔴 Bad: Conditional defaults inside component
const Button = (props: ButtonProps) => {
  const variant = props.variant || 'primary';
  const disabled = props.disabled === undefined ? false : props.disabled;
  // ...
};
```

### Error Handling

- Use error boundaries to catch render errors
- Handle async errors gracefully with try/catch
- Provide meaningful error messages to users
- Include fallback UI for error states

```tsx
// 🟢 Good: Error handling in async function
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response);
  } catch (error) {
    setError(error instanceof Error 
      ? error.message 
      : 'An unknown error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Loading States

- Always account for loading states in components that fetch data
- Use Suspense and React Query where appropriate
- Provide meaningful loading indicators
- Maintain consistent UI during loading
- Consider skeleton loaders for content-heavy components

## Styling Standards

### Tailwind CSS Usage

- Use Tailwind core utilities only - avoid arbitrary values
- Follow responsive design principles (mobile-first)
- Maintain consistent spacing and sizing using Tailwind's scale
- Use Tailwind's color system for consistency
- Ensure dark mode compatibility with dark: variants

```tsx
// 🟢 Good: Core utilities only
<div className="m-4 p-6 rounded-lg bg-white dark:bg-gray-800">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Title</h2>
</div>

// 🔴 Bad: Arbitrary values
<div className="m-[17px] p-[24px] rounded-[12px] bg-[#ffffff] dark:bg-[#1f2937]">
  <h2 className="text-[18px] font-semibold text-[#111827]">Title</h2>
</div>
```

### Component Libraries

- Use Shadcn/UI components whenever possible
- Extend Shadcn/UI components rather than creating new ones
- Follow Shadcn/UI patterns for consistency
- Use appropriate variants provided by Shadcn/UI

## State Management

### Client State

- Use Zustand for global state management
- Keep state minimal and focused
- Split stores by domain for maintainability
- Use selectors to access only the needed state

```typescript
// 🟢 Good: Focused Zustand store
const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

// Usage with selector
const theme = useThemeStore((state) => state.theme);
const setTheme = useThemeStore((state) => state.setTheme);
```

### Server State

- Use TanStack Query for API data fetching and caching
- Configure appropriate stale times and cache behavior
- Use query keys consistently
- Handle loading, error, and empty states

```typescript
// 🟢 Good: React Query usage
const { data, isLoading, error } = useQuery({
  queryKey: ['addons', { category, version }],
  queryFn: () => api.getAddons({ category, version }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Performance Considerations

- Use memoization (useMemo, useCallback) for expensive calculations
- Apply virtual scrolling for long lists
- Implement proper key props for lists
- Avoid unnecessary rerenders
- Optimize images with appropriate sizes and formats
- Use code splitting for large components

```tsx
// 🟢 Good: Optimized list with proper keys
const AddonList = ({ addons }: AddonListProps) => {
  // Memoize filtered addons
  const filteredAddons = useMemo(
    () => addons.filter(addon => addon.isCompatible),
    [addons]
  );
  
  return (
    <div>
      {filteredAddons.map(addon => (
        <AddonCard key={addon.id} addon={addon} />
      ))}
    </div>
  );
};
```

## Accessibility Standards

- Ensure proper semantic HTML is used
- Include appropriate ARIA attributes when necessary
- Maintain adequate color contrast (WCAG AA compliance)
- Support keyboard navigation
- Make sure interactive elements have proper focus states
- Add alt text to images

```tsx
// 🟢 Good: Accessible interactive element
<button
  className="px-4 py-2 bg-blue-600 text-white rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
  onClick={handleClick}
  aria-label="Add to collection"
>
  <PlusIcon className="h-5 w-5" />
</button>
```

## Testing Expectations

- Write unit tests for utility functions
- Create component tests for complex components
- Test user interactions and edge cases
- Ensure tests are not brittle

## Code Organization

- Group related files together
- Follow the established project structure
- Keep file sizes reasonable (consider splitting if > 300 lines)
- Use barrel exports (index.ts) for cleaner imports

## Documentation

- Add JSDoc comments to functions and components
- Document props, return values, and side effects
- Include examples for complex components or functions
- Keep comments up-to-date with code changes

```tsx
/**
 * A component that displays a Create Mod addon with its details.
 * 
 * @param addon - The addon data to display
 * @param showDownloads - Whether to show the download count
 * @returns A card component with the addon information
 * 
 * @example
 * <AddonCard addon={addonData} showDownloads={true} />
 */
export const AddonCard = ({ addon, showDownloads = true }: AddonCardProps) => {
  // Implementation
};
```

## Commit and Code Review

- Keep PRs focused and reasonably sized
- Self-review your code before requesting reviews
- Respond to code review comments promptly
- Be open to suggestions and feedback
- Thank reviewers for their time and insights

By following these standards, we ensure Blueprint remains maintainable, accessible, and high-quality as it grows. If you have questions about these standards, please reach out in our Discord server or GitHub discussions.
