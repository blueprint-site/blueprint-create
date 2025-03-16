# Development Workflow

This guide covers the development workflow for contributing to the Blueprint project.

## Development Environment

Blueprint uses Vite as its build tool, providing a fast development experience with hot module replacement (HMR).

### Starting the Development Server

After installing dependencies as per the [installation guide](./installation.md), start the development server:

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:5173`.

### Available Scripts

Blueprint includes several npm scripts to streamline development:

- `npm run dev`: Start the development server
- `npm run build`: Build the production version
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check for code issues
- `npm run format`: Run Prettier to format code
- `npm run update`: Pull the latest changes and install dependencies
- `npm run docker-build`: Build the Docker image

## Development Workflow

### Feature Development

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement your changes**
   - Follow the project's coding standards
   - Ensure components are correctly typed
   - Add proper documentation for new components or features

3. **Run linting and formatting**

   ```bash
   npm run lint
   npm run format
   ```

4. **Commit changes using conventional commits**

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with component"
   ```

5. **Push changes and create a pull request**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Request a code review**

### Bug Fixes

1. **Create a bug fix branch**

   ```bash
   git checkout -b fix/bug-description
   ```

2. **Implement the fix**
   - Ensure the bug is fully addressed
   - Add tests if possible to prevent regression

3. **Commit changes**

   ```bash
   git commit -m "fix: resolve issue with X"
   ```

4. **Push changes and create a pull request**

## Code Style and Standards

Blueprint enforces code style and standards through ESLint and Prettier:

- **ESLint**: Enforces code quality rules
- **Prettier**: Enforces consistent code formatting
- **TypeScript**: All code should be properly typed

These tools are automatically run via Git hooks using Husky before each commit.

## Testing

*Note: Testing framework is TBD*

Once implemented, run tests with:

```bash
npm run test
```

## Working with Components

### Creating New Components

1. Create a new component in the appropriate directory:
   - UI components: `/src/components/ui`
   - Feature components: `/src/components/features`
   - Common components: `/src/components/common`

2. Use TypeScript for proper type definitions:

```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  description?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};
```

3. Document the component with JSDoc comments:

```tsx
/**
 * MyComponent displays a title and optional description.
 * 
 * @component
 * @example
 * ```tsx
 * <MyComponent title="Hello World" description="A simple example" />
 * ```
 */
```

## Working with API and State

### Adding a New API Endpoint

1. Create a new file in `/src/api/endpoints` for your API endpoint
2. Use TanStack Query for data fetching and mutations
3. Export your hooks for use in components

Example:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';

export const useMyFeature = (id: string) => {
  return useQuery({
    queryKey: ['myFeature', id],
    queryFn: async () => {
      const response = await databases.getDocument('DATABASE_ID', 'COLLECTION_ID', id);
      return response;
    },
  });
};
```

### Adding a New Store

1. Create a new file in `/src/api/stores` for your store
2. Use Zustand for state management
3. Export your store for use in components

Example:

```tsx
import { create } from 'zustand';

interface MyFeatureState {
  value: string;
  setValue: (newValue: string) => void;
}

export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  value: '',
  setValue: (newValue) => set({ value: newValue }),
}));
```

## Debugging

### Browser DevTools

Use React DevTools to inspect component hierarchies and props.

### TanStack Query DevTools

TanStack Query includes DevTools to inspect query states and cache:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to your App component
<ReactQueryDevtools initialIsOpen={false} />
```

## Deployment

### Building for Production

```bash
npm run build
```

This creates a production build in the `dist` directory.

### Docker Deployment

Build the Docker image:

```bash
npm run docker-build
```

Run the container:

```bash
docker run -p 80:80 blueprint-app
```

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   - Check that all required environment variables are set in the `env.js` file

2. **API connection issues**
   - Verify Appwrite and Meilisearch are running and accessible
   - Check network requests in browser DevTools

3. **Build errors**
   - Ensure dependencies are installed correctly
   - Check TypeScript errors and fix type issues
