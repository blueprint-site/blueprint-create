# Blueprint Architecture Overview

Blueprint follows a modern frontend architecture with a headless backend approach, using Appwrite for data storage and authentication, and Meilisearch for search functionality.

## High-Level Architecture

Blueprint is a React single-page application (SPA) that interacts with two primary backend services:

1. **Appwrite** - Handles authentication, database storage, and file storage
2. **Meilisearch** - Provides fast, full-text search capabilities

![Blueprint Architecture](../assets/architecture-diagram.png)

*Note: The above diagram is a placeholder. Consider creating an actual architecture diagram.*

## Core Components

### Frontend Application

The frontend is built with:

- **React 19** with TypeScript for component structure
- **Vite** as the build tool and development server
- **React Router** for client-side routing
- **Shadcn/UI** for the component library foundation
- **Tailwind CSS** for styling

### State Management

Blueprint uses a multi-layered state management approach:

1. **Server State**: TanStack Query manages all data fetched from backend services
   - Handles caching, refetching, and background updates
   - Provides loading, error, and success states

2. **Global State**: Zustand stores maintain application-wide state
   - `userStore`: Authentication and user preferences
   - `themeStore`: Theme preferences and settings
   - `collectionStore`: User collections management

3. **Local State**: React's useState and useReducer for component-specific state

### Backend Services

#### Appwrite

Appwrite provides:

- **Authentication**: OAuth integration with Discord, GitHub, and Google
- **Database**: Document storage for addons, schematics, blogs, and user data
- **Storage**: File storage for images, schematic files, and other assets
- **Security**: Permission management and access control

#### Meilisearch

Meilisearch provides:

- **Fast Search**: Sub-millisecond full-text search
- **Filtering**: Powerful filtering capabilities by category, version, etc.
- **Typo Tolerance**: Search results even with spelling mistakes
- **Ranking**: Customizable ranking for search results

## Data Flow

### Read Operations

```
┌─────────┐     ┌───────────┐     ┌────────────┐     ┌──────────────┐
│  User   │────▶│ UI Action │────▶│ TanStack   │────▶│ Meilisearch  │
│ Request │     │ (Search)  │     │   Query    │     │ (For Search) │
└─────────┘     └───────────┘     └────────────┘     └──────────────┘
                                        │
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ Appwrite │
                                  │(For CRUD)│
                                  └──────────┘
```

1. User initiates a request (e.g., searching for addons)
2. React component triggers a TanStack Query hook
3. If data is in cache and fresh, it's returned immediately
4. If not, a request is made to Meilisearch for search operations or to Appwrite for detailed data
5. Data is cached in TanStack Query's cache
6. UI is updated with the fetched data

### Write Operations

```
┌─────────┐     ┌───────────┐     ┌────────────┐     ┌──────────┐
│  User   │────▶│ UI Action │────▶│ TanStack   │────▶│ Appwrite │
│ Action  │     │  (Form)   │     │  Mutation  │     │  (CRUD)  │
└─────────┘     └───────────┘     └────────────┘     └──────────┘
                                        │                  │
                                        │                  │
                                        ▼                  ▼
                                  ┌───────────┐    ┌─────────────┐
                                  │ Invalidate│    │  Background │
                                  │  Queries  │    │     Sync    │
                                  └───────────┘    └─────────────┘
                                                          │
                                                          │
                                                          ▼
                                                   ┌──────────────┐
                                                   │ Meilisearch  │
                                                   │    Update    │
                                                   └──────────────┘
```

1. User performs an action (e.g., creates a schematic)
2. React component captures the input and validates it
3. TanStack Query mutation is triggered with the validated data
4. Data is sent to Appwrite through the mutation
5. On successful write, related queries are invalidated
6. Background process syncs data from Appwrite to Meilisearch (1-minute delay)
7. UI is updated with success message and/or redirected

## System Boundaries

### Client-Side Boundaries

The client-side application is divided into several logical boundaries:

- **UI Layer**: React components, styling, and layout
  - Located in `/src/components`
  - Organized by feature and type

- **State Layer**: TanStack Query and Zustand stores
  - Query hooks in `/src/api/endpoints`
  - Stores in `/src/api/stores`

- **Routing Layer**: React Router configuration
  - Route definitions in `/src/routes`
  - Layout components in `/src/layouts`

- **Type Layer**: TypeScript types and schemas
  - Type definitions in `/src/types`
  - Zod schemas in `/src/schemas`

### Server-Side Boundaries

The server-side is composed of two main services:

- **Appwrite Services**:
  - Authentication
  - Database (collections for addons, schematics, blogs, etc.)
  - Storage (files, images, schematics)

- **Meilisearch Services**:
  - Search indexes (addons, schematics, blogs)
  - Search settings (searchable attributes, filters)

## Authentication Flow

Blueprint uses Appwrite's OAuth authentication system:

1. User clicks "Login with [Provider]" button
2. Application redirects to Appwrite OAuth endpoint
3. Appwrite redirects to the provider (Discord, GitHub, Google)
4. User authenticates with the provider
5. Provider redirects back to Appwrite with auth code
6. Appwrite exchanges code for access token and creates session
7. User is redirected back to the application
8. Application fetches user data and updates state

## Deployment Architecture

- **Static Hosting**: The frontend is deployed as a static site on GitHub Pages
- **Environment Configuration**: Runtime environment variables loaded via `env.js`
- **Backend Services**: 
  - Appwrite hosted on cloud infrastructure
  - Meilisearch hosted on cloud infrastructure
- **CI/CD**: GitHub Actions for automated builds and deployments

## Design Considerations

### Scalability

- Meilisearch handles search traffic efficiently
- Appwrite can scale horizontally as needed
- Static site can be served through CDN for global performance

### Security

- OAuth for secure authentication
- Appwrite permissions for access control
- Environment variables for sensitive configuration
- Content validation on both client and server sides

### Performance

- Client-side caching with TanStack Query
- Meilisearch for fast search operations
- Lazy-loading of components and routes
- Asset optimization (images, etc.)

### Accessibility

- Shadcn/UI components with built-in accessibility
- Responsive design for all devices
- Keyboard navigation support
- Color contrast compliance

## Future Architecture Considerations

- **Server-side rendering**: Adding SSR for improved SEO and initial load performance
- **WebSockets**: Real-time updates for collaborative features
- **Microservices**: Breaking down backend into specialized services
- **Edge Computing**: Deploying certain functions closer to users
- **Offline Support**: Progressive Web App features
