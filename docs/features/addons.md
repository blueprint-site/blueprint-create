# Addons Feature

The Addons feature is a core part of Blueprint, allowing users to discover, browse, and filter Create Mod addons.

## Overview

The Addons feature provides a comprehensive browsing experience for Create Mod addons, including filtering by version, category, and mod loader compatibility. It integrates data from multiple sources like CurseForge and Modrinth, providing a unified interface for addon discovery.

## User Flows

### Browsing Addons

1. User navigates to the Addons page (`/addons`)
2. User can:
   - Search for addons by name
   - Filter by Minecraft version
   - Filter by Create Mod version
   - Filter by mod loader (Forge, Fabric, NeoForge)
   - Filter by category
3. Results update in real-time as filters are applied
4. Clicking on an addon navigates to its details page

### Viewing Addon Details

1. User navigates to an addon details page (`/addons/:slug`)
2. User sees addon details:
   - Name and description
   - Screenshots gallery
   - Downloads count and statistics
   - Author information
   - Compatible Minecraft versions
   - Compatible Create Mod versions
   - Supported mod loaders
   - External links (website, source, issues)
3. User can download the addon from the original source
4. User can add the addon to a personal collection

### Adding to Collection

1. User clicks "Add to Collection" button on an addon card or details page
2. If not logged in, user is prompted to log in
3. User selects an existing collection or creates a new one
4. Addon is added to the collection
5. Confirmation is shown to the user

## Components

### Key Components

#### AddonList
- Main component for displaying the list of addons
- Located at `/src/components/features/addons/AddonList.tsx`
- Responsibilities:
  - Displaying a grid of addon cards
  - Handling pagination
  - Managing loading states
  - Empty state handling

#### AddonCard
- Card component for individual addon display in lists
- Located at `/src/components/features/addons/addon-card/AddonCard.tsx`
- Subcomponents:
  - `AddonStats.tsx` - Downloads and other metrics
  - `CategoryBadges.tsx` - Visual indicators for categories
  - `ModLoaders.tsx` - Icons for supported mod loaders
  - `VersionBadges.tsx` - Compatible versions display
  - `ExternalLinks.tsx` - Links to external resources

#### AddonDetails
- Detailed view of an addon
- Located at `/src/components/features/addons/addon-details/AddonDetailsContent.tsx`
- Subcomponents:
  - `AddonDetailsHeader.tsx` - Title, author, and key stats
  - `AddonDetailsGallery.tsx` - Screenshot gallery
  - `AddonDetailsDescription.tsx` - Markdown description
  - `AddonDetailsFooter.tsx` - Actions and additional info

#### FiltersContainer
- Container for all filter components
- Located at `/src/components/layout/FiltersContainer.tsx`
- Used by:
  - `SearchFilter.tsx` - Search input
  - `SelectFilter.tsx` - Dropdown filters for version and categories

### State Management

Addon state is managed through custom hooks:

```tsx
// Example usage
const AddonListPage = () => {
  const { filters, setFilter, resetFilters } = useFilters();
  const { data, isLoading, error } = useSearchAddons(filters);
  
  // Component implementation
}
```

#### useAddons
- Located at `/src/api/endpoints/useAddons.tsx`
- Purpose: Fetches and manages addon data from Appwrite
- Key functions:
  - `getAddon`: Get a single addon by ID or slug
  - `getAddons`: Get multiple addons with pagination

#### useSearchAddons
- Located at `/src/api/endpoints/useSearchAddons.tsx`
- Purpose: Handles search and filtering using Meilisearch
- Key parameters:
  - `query`: Search text
  - `category`: Filter by category
  - `version`: Filter by Minecraft version
  - `createVersion`: Filter by Create Mod version
  - `loaders`: Filter by mod loader

#### useFilters
- Located at `/src/hooks/useFilters.ts`
- Purpose: Manages filter state and URL query params
- Key functions:
  - `setFilter`: Update a specific filter
  - `resetFilters`: Clear all filters
  - `getFilterValues`: Get current filter values

## Data Model

Addons follow the `AddonSchema` defined in `/src/schemas/addon.schema.tsx`:

```typescript
export const AddonSchema = z.object({
  $id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  author: z.string(),
  categories: z.array(z.string()),
  downloads: z.number(),
  icon: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  curseforge_raw: CurseForgeAddonSchema.optional().nullable(),
  modrinth_raw: ModrinthAddonSchema.optional().nullable(),
  sources: z.array(z.string()),
  isValid: z.boolean(),
  loaders: z.array(z.string()).nullable(),
  isChecked: z.boolean(),
  minecraft_versions: z.array(z.string()).optional().nullable(),
  create_versions: z.array(z.string()).optional().nullable(),
});
```

Each addon contains:
- Basic information (name, description, slug)
- Author information
- Category tags
- Download statistics
- Compatibility information (Minecraft versions, Create versions, mod loaders)
- Raw data from original sources (CurseForge, Modrinth)
- Validation flags

## API Integration

### Appwrite Integration

Addons are stored in the Appwrite database in the `addons` collection:

```typescript
// Example of fetching an addon from Appwrite
const getAddon = async (slug: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADDONS_COLLECTION_ID,
      [
        Query.equal("slug", slug)
      ]
    );
    
    if (response.documents.length === 0) {
      throw new Error('Addon not found');
    }
    
    return response.documents[0];
  } catch (error) {
    console.error('Error fetching addon:', error);
    throw error;
  }
};
```

### Meilisearch Integration

Addons are indexed in Meilisearch for fast search and filtering:

```typescript
// Example of searching addons with Meilisearch
const searchAddons = async (
  query = '',
  filters = {},
  page = 1,
  limit = 20
) => {
  try {
    const index = searchClient.index('addons');
    const filterStr = buildFilterString(filters);
    
    return index.search(query, {
      filter: filterStr,
      limit,
      offset: (page - 1) * limit
    });
  } catch (error) {
    console.error('Error searching addons:', error);
    throw error;
  }
};
```

## Implementation Details

### Data Sources

Addon data is sourced from:

1. **CurseForge API**
   - Provides comprehensive addon metadata
   - Includes download statistics
   - Offers detailed version compatibility

2. **Modrinth API**
   - Alternative source for modding content
   - Different community focus
   - Additional compatibility information

3. **Manual Submissions**
   - For addons not available on major platforms
   - Community-contributed information
   - Admin-verified data

### Synchronization Process

Addon data is synchronized between Appwrite and Meilisearch:

1. Data is written to or updated in Appwrite
2. A background process detects changes
3. Updated data is sent to Meilisearch
4. Search index is updated with new information

There is approximately a 1-minute delay between updates in Appwrite and their availability in Meilisearch search results.

### Caching Strategy

- **Meilisearch results**: Cached for 5 minutes (staleTime in TanStack Query)
- **Appwrite detailed data**: Cached for 10 minutes
- **Images and assets**: Cached according to browser defaults
- **Invalidation**: Triggered on mutations or manual refresh

## Best Practices

### Component Usage

Always use the existing component hierarchy:

```tsx
// ✅ Good - Using the proper components
<AddonList>
  {addons.map(addon => (
    <AddonCard key={addon.$id} addon={addon} />
  ))}
</AddonList>

// ❌ Bad - Bypassing the component structure
<div className="grid">
  {addons.map(addon => (
    <div key={addon.$id} className="card">
      {/* Custom implementation */}
    </div>
  ))}
</div>
```

### Data Validation

Always validate addon data against the schema:

```typescript
// ✅ Good - Using schema validation
const parseAddon = (data: unknown) => {
  try {
    return AddonSchema.parse(data);
  } catch (error) {
    console.error('Invalid addon data:', error);
    return null;
  }
};

// ❌ Bad - Not validating data
const addon = data as Addon; // Unsafe type assertion
```

### Search and Filter Implementation

Use the designated hooks for search and filter operations:

```tsx
// ✅ Good - Using the search hooks
const { data, isLoading } = useSearchAddons(filters);

// ❌ Bad - Direct API calls
const [addons, setAddons] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    const results = await searchClient.index('addons').search(query);
    setAddons(results.hits);
  };
  fetchData();
}, [query]);
```

## Troubleshooting

### Common Issues

#### No Addons Appearing
- Check if Meilisearch is properly configured
- Verify the index exists and contains data
- Ensure filters aren't too restrictive
- Check console for API errors

#### Addon Details Not Loading
- Verify the slug is correct
- Check if the addon exists in Appwrite
- Ensure all required fields are present
- Check for permissions issues

#### Filters Not Working
- Verify filterable attributes in Meilisearch
- Check the filter syntax
- Ensure the filter values exist in the data
- Look for JavaScript errors in the console

#### Images Not Loading
- Check if image URLs are correct
- Verify CORS settings on the image host
- Check network tab for 404 errors
- Ensure the storage bucket is accessible

## Future Enhancements

Planned improvements for the Addons feature:

1. **Version Compatibility Matrix**: Visual display of compatibility across versions
2. **Change Tracking**: History of updates and changes to addons
3. **Dependency Visualization**: Graph view of addon dependencies
4. **Community Ratings**: User-provided ratings and reviews
5. **Collection Sharing**: Public sharing of addon collections
6. **Mod Pack Integration**: Creating mod packs from addon collections
