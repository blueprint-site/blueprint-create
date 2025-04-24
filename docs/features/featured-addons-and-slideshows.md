# Featured Addons and Slideshows Documentation

## Overview

The Featured Addons feature allows administrators to highlight specific addons on the homepage through an interactive slideshow. This documentation covers both the Featured Addon functionality and the Slideshow implementation.

## Featured Addon Schema

```typescript
interface FeaturedAddon {
  addon_id: string;
  title: string;
  description: string;
  image_url: string;
  banner_url: string;
  display_order: number;
  slug: string;
  active: boolean;
  category: string[] | null;
}
```

### Field Descriptions

- `addon_id`: Unique identifier for the addon
- `title`: Display title for the featured addon
- `description`: Short description (max 500 characters)
- `image_url`: URL to the addon's icon/image
- `banner_url`: URL to the addon's banner image
- `display_order`: Order in which the addon appears in the slideshow (0-20)
- `slug`: URL-friendly identifier
- `active`: Whether the addon is currently featured
- `category`: Optional array of categories the addon belongs to

## API Endpoints

### Fetching Featured Addons

```typescript
// Fetch only active featured addons
const { data: addons, isLoading, error } = useFetchFeaturedAddons();

// Fetch all featured addons (including inactive)
const { data: allAddons } = useFetchAllFeaturedAddons();
```

### Creating a Featured Addon

```typescript
const { mutate: createFeaturedAddon } = useCreateFeaturedAddon();

// Usage
createFeaturedAddon({
  addon_id: "unique_id",
  title: "Addon Name",
  description: "Addon description",
  image_url: "https://example.com/image.png",
  banner_url: "https://example.com/banner.png",
  display_order: 1,
  slug: "addon-slug",
  active: true,
  category: ["tech", "automation"]
});
```

### Updating a Featured Addon

```typescript
const { mutate: updateFeaturedAddon } = useUpdateFeaturedAddon();

// Usage
updateFeaturedAddon({
  $id: "existing_id",
  // ... other fields to update
});
```

## Slideshow Implementation

The slideshow is implemented using Embla Carousel with autoplay functionality. There are two versions:
1. Desktop version (`AddonsSlideshow.tsx`)
2. Mobile version (`AddonsSlideshowMobile.tsx`)

### Key Features

- Automatic slideshow with configurable timing
- Manual navigation controls
- Responsive design for both desktop and mobile
- Loading states with skeleton UI
- Error handling with toast notifications

### Usage Example

```tsx
import { AddonsSlideshow } from '@/components/features/home/AddonsSlideshow';

function HomePage() {
  return (
    <div>
      <AddonsSlideshow />
    </div>
  );
}
```

## Best Practices

### Featured Addon Management

1. **Order Management**
   - Use `display_order` to control the sequence of featured addons
   - Keep orders between 0-20 for optimal performance
   - Leave gaps in ordering for future insertions

2. **Content Guidelines**
   - Keep descriptions concise (max 500 characters)
   - Use high-quality images for both icon and banner
   - Ensure URLs are valid and accessible
   - Use meaningful slugs that match the addon's name

3. **Active State Management**
   - Only set `active: true` for addons that should be displayed
   - Use inactive state for temporarily hidden or upcoming features

### Slideshow Implementation

1. **Performance**
   - Images should be optimized for web
   - Use lazy loading for images
   - Implement proper error boundaries

2. **User Experience**
   - Ensure smooth transitions between slides
   - Provide clear navigation controls
   - Include loading states for better UX
   - Handle errors gracefully with user feedback

3. **Responsive Design**
   - Test on both desktop and mobile devices
   - Use appropriate image sizes for different screen sizes
   - Consider touch interactions for mobile users

## Code Examples

### Creating a Featured Addon Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeaturedAddonFormSchema } from '@/schemas/featuredAddon.schema';

function AddFeaturedAddonForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(FeaturedAddonFormSchema)
  });

  const { mutate: createFeaturedAddon } = useCreateFeaturedAddon();

  const onSubmit = (data) => {
    createFeaturedAddon(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Customizing Slideshow Behavior

```tsx
import Autoplay from 'embla-carousel-autoplay';

function CustomSlideshow() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Custom autoplay options
  const autoplayOptions = {
    delay: 5000, // 5 seconds between slides
    stopOnInteraction: true,
    stopOnMouseEnter: true
  };

  return (
    <Carousel
      setApi={setApi}
      plugins={[Autoplay(autoplayOptions)]}
    >
      {/* Slideshow content */}
    </Carousel>
  );
}
```

## Error Handling

The system includes comprehensive error handling:

1. **API Errors**
   - Network errors
   - Invalid data
   - Permission issues

2. **User Feedback**
   - Toast notifications for errors
   - Loading states
   - Fallback UI for empty states

3. **Validation**
   - Form validation using Zod
   - Type checking with TypeScript
   - Required field validation

## Troubleshooting

Common issues and solutions:

1. **Slideshow Not Working**
   - Check if featured addons are active
   - Verify image URLs are valid
   - Ensure proper initialization of Carousel API

2. **Featured Addon Not Displaying**
   - Verify `active` status is true
   - Check `display_order` is within valid range
   - Confirm all required fields are populated

3. **Performance Issues**
   - Optimize image sizes
   - Implement proper caching
   - Use lazy loading for images

## Security Considerations

1. **API Access**
   - Implement proper authentication
   - Use secure API endpoints
   - Validate all input data

2. **Content Security**
   - Sanitize user input
   - Validate URLs
   - Implement proper CORS policies

## Maintenance

Regular maintenance tasks:

1. **Content Updates**
   - Review and update featured addons regularly
   - Remove outdated content
   - Update display order as needed

2. **Performance Monitoring**
   - Monitor load times
   - Check for broken images
   - Review error logs

3. **Code Updates**
   - Keep dependencies updated
   - Review and update TypeScript types
   - Maintain documentation 