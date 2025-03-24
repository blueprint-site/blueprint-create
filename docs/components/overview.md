# Components Overview

Blueprint follows a component-based architecture using React 19. This document provides an overview of the component organization, design principles, and best practices.

## Component Organization

Blueprint's components are organized into several categories, each with a specific purpose:

```
src/components/
├── common/         # Shared components used across features
├── features/       # Feature-specific components
├── layout/         # Layout components
├── loading-overlays/ # Loading state components
├── tables/         # Table components
├── ui/             # UI components (shadcn)
└── utility/        # Utility components
```

### Component Categories

#### UI Components

UI components are the building blocks of the application interface. Blueprint uses Shadcn/UI as a foundation for its component library.

Examples:
- Button
- Card
- Dialog
- Input
- Tooltip

All UI components are located in the `/src/components/ui` directory.

#### Common Components

Common components are higher-level reusable components used across multiple features.

Examples:
- SearchBar
- FilterMenu
- Pagination
- InfoCard
- SortSelector

All common components are located in the `/src/components/common` directory.

#### Feature Components

Feature components are specific to particular features or domains in the application.

Examples:
- AddonCard
- SchematicViewer
- BlogPostEditor
- UserProfileCard

Feature components are organized by feature in the `/src/components/features` directory:

```
src/components/features/
├── addons/
│   ├── AddonCard.tsx
│   ├── AddonDetails.tsx
│   ├── AddonsGrid.tsx
├── schematics/
│   ├── SchematicCard.tsx
│   ├── SchematicUploader.tsx
├── blog/
│   ├── BlogEditor.tsx
│   ├── BlogPostCard.tsx
```

#### Layout Components

Layout components define the structure and layout of pages.

Examples:
- Header
- Footer
- Sidebar
- NavigationMenu
- PageLayout

All layout components are located in the `/src/components/layout` directory.

#### Utility Components

Utility components handle cross-cutting concerns like error boundaries, loading states, and notifications.

Examples:
- ErrorBoundary
- Toast
- Loader
- LoadingOverlay
- ErrorMessage

All utility components are located in the `/src/components/utility` directory.

## Component Design Principles

### Component Architecture

Blueprint follows these principles for component design:

1. **Composition over Inheritance**: Components are composed from smaller, reusable components
2. **Single Responsibility**: Each component should have a single responsibility
3. **Prop-driven Configuration**: Components are configured through props
4. **Container/Presentation Separation**: Separate data fetching from presentation
5. **Controlled Components**: Form components are controlled by parent components

### Component File Structure

Each component follows a consistent file structure:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

// 1. Type definitions
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// 2. Component definition
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    // 3. Internal state and logic
    
    // 4. Render function
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          // Size variants
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          // Style variants
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// 5. Display name
Button.displayName = 'Button';
```

## Core Component Categories

### UI Components (Shadcn/UI)

Blueprint uses Shadcn/UI for its core UI components. These components follow a consistent design language and are built on top of Radix UI primitives.

Key UI components:
- Button
- Input
- Dialog
- Select
- Toast
- Card
- Tabs
- Form

### Layout Components

Layout components define the structure of pages and provide consistent navigation and UI elements.

Key layout components:

#### BaseLayout

The primary layout component wrapping all pages:

```tsx
// src/layouts/BaseLayout.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Outlet } from 'react-router-dom';

const BaseLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
```

#### AdminPanelLayout

A specialized layout for admin pages:

```tsx
// src/layouts/AdminPanelLayout.tsx
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminPanelLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
```

### Feature Components

Feature components implement specific features and business logic.

Example: AddonCard component:

```tsx
// src/components/features/addons/AddonCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Addon } from '@/types';
import { formatDate } from '@/lib/utils';

interface AddonCardProps {
  addon: Addon;
  onClick?: () => void;
}

export const AddonCard: React.FC<AddonCardProps> = ({ addon, onClick }) => {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <img src={addon.icon} alt={addon.name} className="w-8 h-8" />
          <h3 className="text-lg font-semibold">{addon.name}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{addon.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {addon.categories.map((category) => (
            <span key={category} className="text-xs bg-secondary px-2 py-1 rounded-full">
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <span>By {addon.author}</span>
          <span>Updated {formatDate(addon.updated_at)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
```

## Component Composition Patterns

Blueprint uses several composition patterns to build complex interfaces:

### Compound Components

Compound components work together to form a cohesive unit:

```tsx
// Usage of compound components
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="versions">Versions</TabsTrigger>
    <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content...</TabsContent>
  <TabsContent value="versions">Versions content...</TabsContent>
  <TabsContent value="dependencies">Dependencies content...</TabsContent>
</Tabs>
```

### Higher-Order Components (HOCs)

HOCs enhance components with additional functionality:

```tsx
// Example HOC for authentication protection
export const withAuthentication = (Component) => {
  return (props) => {
    const user = useUserStore((state) => state.user);
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Usage
const ProtectedComponent = withAuthentication(MyComponent);
```

### Render Props

Render props pattern for flexible component composition:

```tsx
// Example render prop component
const ResourceLoader = ({ resourceId, children }) => {
  const { data, isLoading, error } = useResource(resourceId);
  
  if (isLoading) return <LoadingOverlay />;
  if (error) return <ErrorMessage error={error} />;
  
  return children(data);
};

// Usage
<ResourceLoader resourceId="123">
  {(data) => <ResourceDisplay data={data} />}
</ResourceLoader>
```

## Component Best Practices

1. **Type Safety**: Always use TypeScript interfaces for props
   ```tsx
   interface ButtonProps {
     variant?: 'primary' | 'secondary' | 'ghost';
     size?: 'sm' | 'md' | 'lg';
     // other props...
   }
   ```

2. **Default Props**: Provide sensible defaults for optional props
   ```tsx
   const Button = ({ variant = 'primary', size = 'md', ...props }) => {
     // implementation
   };
   ```

3. **Composition**: Compose complex components from simpler ones
   ```tsx
   const Card = ({ children }) => (
     <div className="border rounded-lg p-4 shadow-sm">
       {children}
     </div>
   );
   
   const CardHeader = ({ children }) => (
     <div className="pb-2 border-b">{children}</div>
   );
   
   const CardBody = ({ children }) => (
     <div className="py-4">{children}</div>
   );
   ```

4. **Forward Refs**: Use forwardRef for components that need to receive refs
   ```tsx
   const Input = React.forwardRef<HTMLInputElement, InputProps>(
     (props, ref) => (
       <input ref={ref} {...props} />
     )
   );
   ```

5. **Memoization**: Use React.memo for performance optimization when appropriate
   ```tsx
   const ExpensiveComponent = React.memo(({ data }) => {
     // expensive rendering logic
   });
   ```

## Styling Components

Blueprint uses Tailwind CSS for styling components:

1. **Utility-First Approach**: Use Tailwind's utility classes directly
   ```tsx
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
     <h2 className="text-xl font-semibold text-gray-800">Title</h2>
     <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
       Action
     </button>
   </div>
   ```

2. **Class Name Merging**: Use the `cn` utility to merge class names
   ```tsx
   import { cn } from '@/lib/utils';
   
   const Button = ({ className, ...props }) => (
     <button
       className={cn(
         "px-4 py-2 rounded font-medium",
         "bg-blue-500 text-white hover:bg-blue-600",
         className
       )}
       {...props}
     />
   );
   ```

3. **Variants**: Use conditional classes for component variants
   ```tsx
   const Badge = ({ variant = 'default', ...props }) => (
     <span
       className={cn(
         "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
         variant === 'default' && "bg-blue-100 text-blue-800",
         variant === 'success' && "bg-green-100 text-green-800",
         variant === 'error' && "bg-red-100 text-red-800"
       )}
       {...props}
     />
   );
   ```

## Component Documentation

Blueprint uses JSDoc comments for component documentation:

```tsx
/**
 * Button component for triggering actions.
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  // implementation
};
```

## Related Documentation

- [UI Components](./ui-components.md)
- [Layout Components](./layout-components.md)
- [Feature Components](./feature-components.md)
- [Styling Guide](../guides/styling.md)
