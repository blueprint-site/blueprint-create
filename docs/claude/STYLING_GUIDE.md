# Blueprint Styling Guide

## Overview

This guide documents the styling conventions and patterns used in the Blueprint project. The codebase uses a modern CSS architecture with Tailwind CSS v4, CSS-in-JS variants, and a comprehensive design token system.

## Tech Stack

- **Tailwind CSS v4** - Utility-first CSS framework (using @tailwindcss/vite)
- **Shadcn/UI** - Component library built on Radix UI primitives
- **Class Variance Authority (CVA)** - Type-safe component variants
- **clsx + tailwind-merge** - Class name utilities

## Design System

### Color System

The project uses CSS custom properties with HSL values for a flexible theming system:

#### Semantic Colors

- **Primary** - Main brand color (blue)
- **Secondary** - Supporting actions
- **Accent** - Highlight elements (purple)
- **Success** - Positive feedback (green)
- **Warning** - Caution states (yellow)
- **Destructive** - Errors/deletions (red)

#### Surface Hierarchy

```css
--surface-1  /* Elevated surfaces (cards, dialogs) */
--surface-2  /* Mid-level surfaces */
--surface-3  /* Deepest surfaces (borders) */
```

#### Special Colors

- **Blueprint** - Brand-specific blue (`hsl(220 100% 75%)`)
- **Semantic Foreground** - Text on colored backgrounds

### Typography

#### Font Families

- **System Font** - Default UI text
- **Minecraft Font** - Custom font for headings and themed elements
  - Regular, Bold, Italic, Bold Italic variants
  - Used via `font-minecraft` class

#### Heading Hierarchy

```css
h1: @apply font-minecraft text-5xl font-bold md:text-6xl lg:text-7xl;
h2: @apply font-minecraft text-4xl font-bold md:text-5xl lg:text-6xl;
h3: @apply font-minecraft text-3xl font-bold md:text-4xl lg:text-5xl;
h4: @apply font-minecraft text-2xl md:text-3xl lg:text-4xl;
h5: @apply font-minecraft text-xl md:text-2xl lg:text-3xl;
h6: @apply font-minecraft text-lg md:text-xl lg:text-2xl;
```

### Spacing & Layout

#### Border Radius

```css
--radius: 0.5rem /* Default */ --radius-lg: var(--radius) --radius-md: calc(var(--radius) - 2px)
  --radius-sm: calc(var(--radius) - 4px);
```

#### Container

- Auto margins: `margin-inline: auto`
- Padding: `padding-inline: 2rem`
- Responsive widths handled by Tailwind

## Component Patterns

### Using CVA for Variants

```typescript
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: '...',
      secondary: '...',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

### Class Name Composition

Always use the `cn()` utility for merging classes:

```typescript
import { cn } from "@/config/utils"

// Usage
className={cn(
  "base-classes",
  conditionalClass && "conditional-classes",
  className // Allow override
)}
```

## Styling Best Practices

### 1. Component Structure

- Use semantic HTML elements
- Apply `data-slot` attributes for styling hooks
- Keep component files focused on logic, not styling

### 2. Responsive Design

- Mobile-first approach
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on all breakpoints

### 3. Dark Mode Support

- Use CSS variables for all colors
- Define light/dark values in `:root` and `.dark`
- Use `dark:` variant sparingly (prefer CSS variables)

### 4. Animation & Transitions

```css
/* Predefined animations */
--animate-rainbow: rainbow 4s linear infinite;
--animate-pulseScale: pulseScale 1s ease-in-out infinite;

/* Standard transition */
transition-colors  /* For hover states */
```

### 5. Focus States

Always include keyboard navigation support:

```css
focus-visible:outline-hidden
focus-visible:ring-1
focus-visible:ring-ring
```

### 6. Disabled States

```css
disabled:pointer-events-none
disabled:opacity-50
```

## Special Components

### Minecraft-Themed Button

```css
.minecraft-btn {
  background-image: /* base64 texture */;
  font-family: 'Minecraft';
  border-color: #aaa #565656 #565656 #aaa;
  text-shadow: 3px 3px #4c4c4c;
}
```

### Custom Scrollbars

```css
.scrollable-container {
  scrollbar-width: thin;
  scrollbar-color: #7b9bf7 transparent;
}
```

### Markdown Content

```css
.customMarkdown {
  /* Custom typography for markdown */
  /* Specific heading colors */
  /* Link styling */
}
```

## File Organization

### Style Files Location

```
src/
├── index.css           # Global styles, CSS variables
├── styles/
│   ├── addon-markdown.css  # Feature-specific styles
│   └── index.scss          # SCSS imports (if any)
└── components/ui/      # Component-specific styles
```

### Import Order

1. CSS framework imports (@import 'tailwindcss')
2. Feature-specific styles
3. Component styles
4. Utility classes

## Common Patterns

### Card Components

```tsx
<Card className='bg-card text-card-foreground'>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Form Elements

```tsx
<Input className="bg-background border-input" />
<Select className="bg-popover text-popover-foreground" />
```

### Status Indicators

Use semantic color variants:

- `variant="success"` - Positive actions
- `variant="warning"` - Caution needed
- `variant="destructive"` - Dangerous actions

## Performance Considerations

### 1. Bundle Size

- Components use tree-shaking friendly imports
- Unused Tailwind classes are purged
- Images optimized with vite-plugin-imagemin

### 2. CSS Specificity

- Avoid `!important` (except for third-party overrides)
- Use Tailwind utilities over custom CSS
- Leverage CSS variables for theming

### 3. Runtime Performance

- Minimize style recalculations
- Use CSS transforms for animations
- Implement `will-change` sparingly

## Accessibility

### Color Contrast

- All text meets WCAG AA standards
- Use semantic foreground colors on backgrounds
- Test with color blindness simulators

### Interactive Elements

- Minimum touch target: 44x44px
- Clear focus indicators
- Proper ARIA attributes

### Motion

- Respect `prefers-reduced-motion`
- Provide motion-free alternatives
- Keep animations subtle and purposeful

## Migration Notes

### From Tailwind v3 to v4

- Configuration moved to @theme directive in CSS
- No separate tailwind.config.js needed
- Custom variants use @custom-variant

## Code Examples

### Creating a New Component

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/config/utils';

const componentVariants = cva('base styles', {
  variants: {
    // Define variants
  },
  defaultVariants: {
    // Set defaults
  },
});

interface ComponentProps extends VariantProps<typeof componentVariants> {
  className?: string;
}

export function Component({ className, variant, ...props }: ComponentProps) {
  return <div className={cn(componentVariants({ variant }), className)} {...props} />;
}
```

### Using Theme Colors

```tsx
// Good - uses CSS variables
<div className="bg-primary text-primary-foreground" />

// Avoid - hardcoded colors
<div className="bg-blue-500 text-white" />
```

### Responsive Layout

```tsx
<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>{/* Content */}</div>
```

## Tools & Resources

### Development

- Browser DevTools for CSS inspection
- Tailwind CSS IntelliSense (VS Code)
- React Developer Tools

### Design Tokens

- All tokens defined in `src/index.css`
- Light/dark mode variables
- Custom animations

### Component Library

- Shadcn/UI components in `src/components/ui/`
- Radix UI primitives for behavior
- Custom variants with CVA

## Troubleshooting

### Common Issues

1. **Styles not applying**
   - Check import order
   - Verify Tailwind classes are valid
   - Clear build cache

2. **Dark mode not working**
   - Ensure `.dark` class on root element
   - Use CSS variables, not hardcoded colors

3. **Class conflicts**
   - Use `cn()` utility for merging
   - Order matters: later classes override

4. **Performance issues**
   - Check for unnecessary re-renders
   - Optimize animations with CSS transforms
   - Use production build for testing
