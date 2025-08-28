# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start development server with network access
npm run host

# Build for production (runs lint before build)
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run fix

# Format code with Prettier
npm run format

# Run both type checking and linting
npm run check

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze

# Update repository and dependencies
npm run update
```

### Testing

The project uses Husky for pre-commit hooks with lint-staged. On commit, it automatically:

- Formats code with Prettier
- Runs ESLint fixes
- Ensures code passes linting standards

## Architecture Overview

### Core Stack

- **React 19** with TypeScript - Main framework
- **Vite** - Build tool and development server
- **React Router v7** - Routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS + Shadcn/UI** - Styling and component library

### Backend Services

- **Appwrite** - Backend as a service for authentication, database, storage
- **Meilisearch** - Full-text search engine for addons, blogs, and schematics
- **OAuth Providers** - Discord, GitHub, Google authentication

### Key Architecture Patterns

#### State Management Strategy

- **Server State**: TanStack Query for API data (addons, users, schematics)
- **Client State**: Zustand stores for user session, theme, feature flags
- **Form State**: React Hook Form with Zod validation

#### API Layer Structure

```
src/api/
├── appwrite/       # Appwrite service hooks (useAddons, useUsers, etc.)
├── meilisearch/    # Search functionality hooks
├── external/       # External APIs (GitHub, Modrinth)
├── endpoints/      # Custom endpoint hooks
└── stores/         # Zustand state stores
```

#### Routing Architecture

- Lazy-loaded routes with code splitting
- Protected routes with authentication checks
- Nested layouts (BaseLayout, AdminPanelLayout)
- Error boundaries at route level

#### Component Organization

```
src/components/
├── features/       # Feature-specific components
│   ├── addons/    # Addon listing and details
│   ├── schematics/# Schematic upload and display
│   ├── admin/     # Admin panel components
│   └── blog/      # Blog system
├── ui/            # Shadcn/UI base components
├── layout/        # Layout components
└── common/        # Shared components
```

### Data Flow

1. **Authentication**: OAuth flow through Appwrite, stored in userStore
2. **Content Loading**: TanStack Query fetches data, caches, and manages loading states
3. **Search**: Meilisearch indexes provide real-time search across content types
4. **File Uploads**: Images compressed client-side, uploaded to Appwrite Storage

### Environment Configuration

- Environment variables loaded dynamically via `/env.js`
- Key variables: `APPWRITE_URL`, `APPWRITE_PROJECT_ID`, `MEILISEARCH_URL`
- Variables accessed through `window._env_`

### Version Compatibility System

- Minecraft version filtering
- Create Mod version compatibility
- Mod loader support (Forge, Fabric, NeoForge)
- Dynamic version processing in hooks

### Schema Validation

All data models validated with Zod schemas:

- `src/schemas/` - Contains schemas for addons, users, blogs, schematics
- Ensures type safety from API to UI
- Form validation integrated with React Hook Form
