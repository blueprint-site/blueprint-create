# Project Structure

This document provides an overview of the Blueprint project structure, explaining the organization and purpose of each directory.

## Directory Structure

The Blueprint project follows a structured organization to maintain code clarity and separation of concerns:

```
src/
├── api/                 # API integration and state management
│   ├── endpoints/       # TanStack Query hooks for data fetching
│   ├── stores/          # Zustand stores for client-side state
├── assets/              # Static assets (images, icons, fonts)
├── components/          # React components
│   ├── common/          # Shared components
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components
│   ├── loading-overlays/# Loading state components
│   ├── tables/          # Table components
│   ├── ui/              # UI components (shadcn)
│   └── utility/         # Utility components
├── config/              # Configuration files
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── layouts/             # Page layout components
├── lib/                 # Utility libraries and functions
├── pages/               # Page components
├── routes/              # Route definitions
├── schemas/             # Type definitions and schemas
├── stores/              # State management stores
└── styles/              # Global styles and Tailwind config
```

## Key Directories Explained

### `/src/api`

Contains all API-related code, organizing the application's data layer:

- **`/endpoints`**: TanStack Query hooks for API communication
  - `useAddons.tsx`: Hooks for CRUD operations on addons
  - `useBlogs.tsx`: Hooks for blog post management
  - `useSearchAddons.tsx`: Hook for searching addons via Meilisearch
  - `useSearchSchematics.tsx`: Hook for searching schematics

- **`/stores`**: Zustand state stores
  - `userStore.ts`: Authentication and user state management
  - `themeStore.ts`: Theme preferences and UI settings

### `/src/components`

All React components, organized by purpose:

- **`/common`**: Reusable components used across features
  - Buttons, cards, and other common elements

- **`/features`**: Feature-specific components
  - `/addons`: Addon-related components
  - `/schematics`: Schematic-related components
  - `/blog`: Blog-related components
  - `/home`: Homepage-specific components

- **`/layout`**: Layout-related components
  - `Header.tsx`: Application header
  - `Footer.tsx`: Application footer
  - `Sidebar.tsx`: Navigation sidebar

- **`/ui`**: Shadcn UI components
  - Customized UI components following Shadcn structure
  - Button, Card, Dialog, etc.

- **`/utility`**: Utility components
  - Error boundaries
  - Loading indicators
  - Toast notifications

### `/src/config`

Application configuration:

- `appwrite.ts`: Appwrite client configuration
- `i18n.ts`: Internationalization configuration
- Other configuration files

### `/src/hooks`

Custom React hooks:

- `useToast.ts`: Hook for displaying toast notifications
- `useMediaQuery.ts`: Hook for responsive design
- Other utility hooks

### `/src/layouts`

Page layout components:

- `BaseLayout.tsx`: Main layout wrapper
- `AdminPanelLayout.tsx`: Admin panel layout

### `/src/pages`

Page components that correspond to routes:

- `Home.tsx`: Homepage
- `/addons/AddonListPage.tsx`: Addons listing page
- `/addons/AddonDetailsPage.tsx`: Addon details page
- `/schematics/SchematicsList.tsx`: Schematics listing page

### `/src/routes`

Route definitions for React Router:

- `index.tsx`: Main route definitions
- `authRoutes.tsx`: Authentication routes
- `schematicRoutes.tsx`: Schematic-related routes
- `adminRoutes.tsx`: Admin panel routes

### `/src/schemas`

Type definitions and validation schemas:

- `addon.schema.ts`: Addon data structure and validation
- `schematic.schema.ts`: Schematic data structure and validation
- Other type definitions

## Root-Level Files

Key files at the project root:

- **`index.html`**: Main HTML template
- **`package.json`**: NPM package definition and scripts
- **`vite.config.ts`**: Vite configuration
- **`tsconfig.json`**: TypeScript configuration
- **`.eslintrc.cjs`**: ESLint configuration
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`README.md`**: Project overview and documentation

## Public Directory

Static assets served directly:

- **`/public/env.js`**: Runtime environment configuration
- **`/public/favicon.ico`**: Site favicon
- **`/public/robots.txt`**: Search engine directives
- Other static assets

## Build Files

Files related to building and deployment:

- **`Dockerfile`**: Docker container definition
- **`docker-compose.yml`**: Docker Compose configuration
- **`nginx.conf`**: Nginx server configuration
- **`entrypoint.sh`**: Docker container entrypoint script

## Development Files

Files related to development tooling:

- **`.husky`**: Git hooks for pre-commit checks
- **`.github`**: GitHub workflows and templates
- **`.prettierrc`**: Prettier configuration
- **`.dependency-cruiser.cjs`**: Dependency analysis configuration

## Naming Conventions

Blueprint follows consistent naming conventions:

1. **Components**: PascalCase for component names
   - Example: `AddonCard.tsx`, `SchematicDetails.tsx`

2. **Hooks**: camelCase prefixed with "use"
   - Example: `useAddons.tsx`, `useSearchSchematics.tsx`

3. **Stores**: camelCase with "Store" suffix
   - Example: `userStore.ts`, `themeStore.ts`

4. **Utilities**: camelCase
   - Example: `formatDate.ts`, `validation.ts`

5. **Pages**: PascalCase with descriptive names
   - Example: `AddonListPage.tsx`, `SchematicDetailsPage.tsx`

## Code Organization Principles

1. **Separation of Concerns**:
   - UI components are separated from data fetching logic
   - State management is centralized in stores
   - API integration is isolated in endpoint hooks

2. **Component Composition**:
   - Components are built from smaller, reusable components
   - Layout components handle structure
   - Feature components implement business logic
   - UI components handle presentation

3. **Code Splitting**:
   - Lazy loading for routes and large components
   - Dynamic imports for code that isn't needed immediately

4. **Modular Design**:
   - Features are organized in self-contained modules
   - Clear boundaries between different parts of the application
   - Reusable components are shared across features

## Understanding Key Patterns

1. **API Data Fetching Pattern**:
   ```jsx
   const { data, isLoading, error } = useAddons();
   
   if (isLoading) return <LoadingOverlay />;
   if (error) return <ErrorComponent error={error} />;
   
   return <AddonsList addons={data} />;
   ```

2. **Component Composition Pattern**:
   ```jsx
   // Page -> Layout -> Feature Components -> UI Components
   <AddonListPage>
     <BaseLayout>
       <AddonsGrid>
         <AddonCard />
         <AddonCard />
       </AddonsGrid>
     </BaseLayout>
   </AddonListPage>
   ```

3. **State Management Pattern**:
   ```jsx
   // Component using global state
   const user = useUserStore((state) => state.user);
   const login = useUserStore((state) => state.login);
   
   // Component with local state
   const [inputValue, setInputValue] = useState('');
   ```

## Further Reading

- [Component Documentation](../components/overview.md)
- [State Management Documentation](../architecture/state-management.md)
- [API Integration Documentation](../api/endpoints.md)
