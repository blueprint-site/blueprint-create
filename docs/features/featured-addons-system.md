# Featured Addons System Documentation

## System Overview

The Featured Addons system is a core feature of Blueprint that allows administrators to highlight exceptional addons on the homepage through an interactive slideshow. This document provides a comprehensive overview of the system architecture, implementation details, and best practices.

## Architecture

### Key Components

1. **Data Layer**
   - Appwrite Collection: `featured_addons`
   - Meilisearch Index: `featured_addons`
   - Storage Bucket: `featured_addon_images`

2. **API Layer**
   - TanStack Query hooks for data fetching
   - Zustand store for state management
   - TypeScript interfaces for type safety

3. **UI Layer**
   - Desktop Slideshow Component
   - Mobile Slideshow Component
   - Admin Interface Components

## Appwrite Collection Schema

### Collection: `featured_addons`

```typescript
interface FeaturedAddon {
  $id: string;              // Appwrite document ID
  $createdAt: string;       // Creation timestamp
  $updatedAt: string;       // Last update timestamp
  addon_id: string;         // Reference to the addon
  title: string;            // Display title
  description: string;      // Short description (max 500 chars)
  image_url: string;        // Icon/thumbnail URL
  banner_url: string;       // Banner image URL
  display_order: number;    // Order in slideshow (0-20)
  slug: string;             // URL-friendly identifier
  active: boolean;          // Whether to display
  category: string[];       // Optional categories
}
```

### Indexes

1. **Primary Index**
   - Field: `$id`
   - Type: Key
   - Attributes: Unique

2. **Display Order Index**
   - Field: `display_order`
   - Type: Key
   - Attributes: Unique

3. **Active Status Index**
   - Field: `active`
   - Type: Key

4. **Compound Index**
   - Fields: `active`, `display_order`
   - Type: Key

## TypeScript Interfaces

### Core Interfaces

```typescript
// Canonical type for Appwrite
export interface FeaturedAddon extends Models.Document {
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

// Form validation schema
export const FeaturedAddonFormSchema = z.object({
  addon_id: z.string().min(1),
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(500),
  image_url: z.string().url(),
  banner_url: z.string().url(),
  display_order: z.number().int().min(0).max(20),
  slug: z.string().min(1).max(100),
  active: z.boolean(),
  category: z.array(z.string()).nullable(),
});

// API response type
export interface FeaturedAddonResponse {
  documents: FeaturedAddon[];
  total: number;
}
```

## API Hooks

### Fetching Featured Addons

```typescript
// Fetch active featured addons
const { data: addons, isLoading, error } = useFetchFeaturedAddons();

// Fetch all featured addons (admin)
const { data: allAddons } = useFetchAllFeaturedAddons();

// Create a new featured addon
const { mutate: createFeaturedAddon } = useCreateFeaturedAddon();

// Update an existing featured addon
const { mutate: updateFeaturedAddon } = useUpdateFeaturedAddon();
```

### Example Usage

```tsx
// Homepage slideshow
function HomeSlideshow() {
  const { data: addons, isLoading } = useFetchFeaturedAddons();

  if (isLoading) return <LoadingSpinner />;
  if (!addons?.length) return <EmptyState />;

  return (
    <Carousel>
      {addons.map(addon => (
        <FeaturedAddonCard key={addon.$id} addon={addon} />
      ))}
    </Carousel>
  );
}

// Admin panel
function AddFeaturedAddonForm() {
  const { mutate: createAddon } = useCreateFeaturedAddon();
  
  const onSubmit = (data: FeaturedAddonFormData) => {
    createAddon(data, {
      onSuccess: () => {
        toast.success('Featured addon created');
      },
      onError: (error) => {
        toast.error('Failed to create featured addon');
      }
    });
  };

  return <Form onSubmit={onSubmit} />;
}
```

## Admin Interface Guide

### Accessing the Admin Panel

1. Navigate to `/admin/featured-addons`
2. Ensure you have admin privileges
3. Use the interface to:
   - View all featured addons
   - Create new featured addons
   - Edit existing featured addons
   - Toggle addon visibility
   - Reorder addons

### Creating a Featured Addon

1. Click "Add Featured Addon"
2. Fill in the required fields:
   - Addon ID (select from existing addons)
   - Title
   - Description (max 500 characters)
   - Upload banner image
   - Set display order
   - Add categories (optional)
3. Click "Save"

### Managing Featured Addons

1. **Reordering**
   - Drag and drop addons to change order
   - Use the display order field for precise control

2. **Visibility**
   - Toggle the active switch to show/hide addons
   - Inactive addons won't appear in the slideshow

3. **Editing**
   - Click on an addon to edit its details
   - Update any field as needed
   - Save changes to update immediately

## Best Practices

### Banner Images

1. **Dimensions**
   - Desktop: 1920x1080px (16:9)
   - Mobile: 1080x1920px (9:16)
   - File size: < 500KB

2. **Content Guidelines**
   - Use high-quality screenshots
   - Include the addon name clearly
   - Show key features or gameplay
   - Maintain consistent branding
   - Avoid text-heavy designs

3. **Technical Requirements**
   - Format: WebP or PNG
   - Compression: Optimize for web
   - Alt text: Include descriptive alt text
   - Loading: Use lazy loading

### Content Guidelines

1. **Titles**
   - Keep under 50 characters
   - Be descriptive and engaging
   - Include version if relevant

2. **Descriptions**
   - Maximum 500 characters
   - Focus on key features
   - Use clear, concise language
   - Include compatibility info

3. **Categories**
   - Use existing category system
   - Maximum 3 categories per addon
   - Choose relevant categories

## Testing Checklist

### Functional Testing

- [ ] Slideshow navigation works
- [ ] Auto-play functions correctly
- [ ] Manual navigation controls work
- [ ] Mobile responsiveness
- [ ] Image loading and display
- [ ] Error handling
- [ ] Loading states

### Edge Cases

- [ ] Empty featured addons list
- [ ] Single featured addon
- [ ] Maximum number of featured addons
- [ ] Invalid image URLs
- [ ] Network errors
- [ ] Permission errors

### Visual Testing

- [ ] Banner image quality
- [ ] Text readability
- [ ] Responsive layout
- [ ] Loading animations
- [ ] Error states
- [ ] Dark/light mode

## Known Limitations

1. **Current Limitations**
   - Maximum 20 featured addons
   - No scheduled publishing
   - Basic image optimization
   - Limited analytics

2. **Future Improvements**
   - Scheduled publishing
   - Advanced analytics
   - A/B testing
   - Custom transitions
   - Performance optimizations
   - Enhanced mobile experience

## Quick Reference

### Admin Commands

```bash
# Create featured addon
POST /v1/databases/{databaseId}/collections/{collectionId}/documents

# Update featured addon
PUT /v1/databases/{databaseId}/collections/{collectionId}/documents/{documentId}

# List featured addons
GET /v1/databases/{databaseId}/collections/{collectionId}/documents
```

### Common Tasks

1. **Add Featured Addon**
   - Navigate to admin panel
   - Click "Add Featured Addon"
   - Fill in details
   - Upload images
   - Save

2. **Reorder Addons**
   - Open admin panel
   - Drag and drop items
   - Or edit display_order
   - Save changes

3. **Toggle Visibility**
   - Open admin panel
   - Find addon
   - Toggle active switch
   - Save changes 