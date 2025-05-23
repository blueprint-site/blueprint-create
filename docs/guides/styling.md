# Styling Guidelines

Blueprint uses Tailwind CSS for styling, with Shadcn/UI components as a foundation. This guide outlines the styling approach, conventions, and best practices for maintaining a consistent design.

## Styling Architecture

### Technology Stack

- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library built on Radix UI primitives
- **CSS Variables**: Used for theme values
- **PostCSS**: For processing CSS

### Directory Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   └── ...
├── styles/
│   ├── globals.css   # Global styles and Tailwind imports
│   └── themes/       # Theme-specific styles
```

## Tailwind Configuration

Blueprint extends the default Tailwind configuration in `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        blueprint: "hsl(var(--blueprint))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Animation keyframes
      },
      animation: {
        // Animation definitions
      },
      fontFamily: {
        minecraft: ["Minecraft", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## Theming System

Blueprint implements a dark/light theme system using CSS variables and Tailwind CSS.

### Theme Variables

CSS variables are defined in `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
 
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
 
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
 
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
 
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
 
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;

    --blueprint: 210 100% 50%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
 
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
 
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
 
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
 
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
 
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
 
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
 
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --blueprint: 210 100% 40%;
  }
}
```

### Theme Switching

Theme switching is handled by the `themeStore`:

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

The theme is applied to the HTML element using a theme provider component:

```tsx
// src/components/utility/ThemeProvider.tsx
import { useEffect } from 'react';
import { useThemeStore } from '@/api/stores/themeStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  return <>{children}</>;
};
```

## Component Styling

### Base UI Components

Blueprint uses Shadcn/UI components, which are styled with Tailwind CSS:

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        blueprint: "bg-blueprint text-white hover:bg-blueprint/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Feature-Specific Components

For feature-specific components, styles should be composed using Tailwind classes:

```tsx
// src/components/features/addons/AddonCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Addon } from "@/types";

interface AddonCardProps {
  addon: Addon;
}

export const AddonCard = ({ addon }: AddonCardProps) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <img 
            src={addon.icon} 
            alt={addon.name} 
            className="w-10 h-10 rounded-md object-cover"
          />
          <h3 className="font-medium line-clamp-1">{addon.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {addon.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {addon.categories.map(category => (
            <span 
              key={category} 
              className="px-2 py-1 text-xs bg-secondary rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

## Styling Best Practices

### Use Tailwind's Utility Classes

Always prefer Tailwind's utility classes over custom CSS:

```tsx
{/* Good */}
<div className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold">Title</h2>
</div>

{/* Avoid */}
<div className="header-container">
  <h2 className="header-title">Title</h2>
</div>
```

### Class Name Composition

Use the `cn` utility function to compose class names:

```tsx
import { cn } from "@/lib/utils";

const Component = ({ className, ...props }) => {
  return (
    <div 
      className={cn(
        "base-styles go-here",
        className
      )}
      {...props}
    />
  );
};
```

The `cn` utility is implemented as:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Variants

Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  // Props
}
```

### Responsive Design

Use Tailwind's responsive modifiers for responsive design:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

Common breakpoints:
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### Dark Mode

Always ensure components work in both light and dark mode:

```tsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Dark mode compatible content
</div>
```

With the theme system in place, you should use semantic color names:

```tsx
<div className="bg-background text-foreground">
  Theme-aware content
</div>
```

### Spacing and Typography

Use Tailwind's spacing and typography scales:

```tsx
<div className="p-4 m-2 space-y-4">
  <h1 className="text-2xl font-bold">Heading</h1>
  <p className="text-base">Paragraph text</p>
</div>
```

### Global Styles

Use `@layer components` for reusable component styles:

```css
/* src/styles/globals.css */
@layer components {
  .input-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
  }
  
  .card-container {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4;
  }
}
```

### Custom Animations

Define custom animations in the Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  // ...
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-in",
      },
    },
  },
};
```

Then use them in components:

```tsx
<div className="animate-fade-in">
  Content that fades in
</div>
```

## Accessibility

### Color Contrast

Ensure sufficient color contrast for all text:

- Regular text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

### Focus States

Maintain visible focus states for keyboard navigation:

```tsx
<button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Screen Reader Support

Use appropriate ARIA attributes and semantic HTML:

```tsx
<button
  aria-label="Close dialog"
  aria-pressed="false"
  onClick={closeDialog}
>
  <svg className="w-4 h-4" /* ... */ />
</button>
```

## Performance Considerations

### Minimize Class Name Length

Avoid excessive class names for better performance:

```tsx
{/* Good */}
<div className="flex flex-col p-4">
  {/* Content */}
</div>

{/* Avoid */}
<div className="flex flex-col p-4 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
  {/* Content */}
</div>
```

### Reusable Components

Extract repeated patterns into reusable components:

```tsx
// Extract common card pattern
const Card = ({ title, children }) => (
  <div className="p-4 bg-card text-card-foreground rounded-lg shadow-sm">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);

// Usage
<Card title="Featured">
  Content goes here
</Card>
```

## Common Patterns

### Layout Patterns

#### Container with Max Width

```tsx
<div className="container mx-auto px-4 max-w-7xl">
  {/* Constrained width content */}
</div>
```

#### Grid Layouts

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

#### Responsive Flexbox

```tsx
<div className="flex flex-col md:flex-row items-start md:items-center justify-between">
  {/* Flex items */}
</div>
```

### Component Patterns

#### Card Pattern

```tsx
<div className="bg-card text-card-foreground rounded-lg shadow-sm p-4">
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Card Title</h3>
    <p className="text-muted-foreground">Card description</p>
  </div>
  <div className="mt-4">
    {/* Card content */}
  </div>
</div>
```

#### Form Controls

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium">
      Email
    </label>
    <input
      id="email"
      type="email"
      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
    Submit
  </button>
</div>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Class Variance Authority](https://cva.style/docs)

## Related Documentation

- [Component Overview](../components/overview.md)
- [Accessibility Guidelines](./accessibility.md)
- [UI Components](../components/ui-components.md)
