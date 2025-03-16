# Schematics Feature

The Schematics feature allows users to share, discover, and download Create Mod contraption designs. This document outlines the functionality, components, and implementation details of the Schematics feature.

## Overview

The Schematics feature enables users to:

- Upload Create Mod schematics with metadata
- Search and filter schematics by various criteria
- Preview schematic details and images
- Download schematics for use in Minecraft
- Rate and comment on community schematics

## User Flows

### Browsing Schematics

1. User navigates to the Schematics page
2. User can:
   - Search for schematics by name or description
   - Filter by Minecraft version
   - Filter by Create Mod version
   - Filter by tags/categories
   - Sort by popularity, date, or rating

### Uploading a Schematic

1. User clicks "Upload Schematic" button
2. User is prompted to log in if not already authenticated
3. User fills out the upload form:
   - Schematic name
   - Description
   - Tags/categories
   - Minecraft version
   - Create Mod version
   - Schematic file (.nbt or .schem)
   - Preview image(s)
4. User submits the form
5. System processes and validates the schematic
6. Confirmation is shown to the user

### Viewing Schematic Details

1. User clicks on a schematic card
2. User sees schematic details:
   - Name and description
   - Author information
   - Creation/update date
   - Minecraft and Create Mod version
   - Tags/categories
   - Preview images
   - Download count
   - Ratings and comments
3. User can download the schematic file
4. User can rate the schematic
5. User can leave comments if authenticated

### Managing User Schematics

1. User navigates to their profile
2. User selects "My Schematics" tab
3. User can:
   - View all their uploaded schematics
   - Edit existing schematics
   - Delete their schematics
   - See download and rating statistics

## Components

### Key Components

#### Schematics List

The main component for displaying schematics with filtering and sorting options:

```tsx
// src/components/features/schematics/SchematicsList.tsx
import { useState } from 'react';
import { useSearchSchematics } from '@/api/endpoints/useSearchSchematics';
import { SchematicCard } from './SchematicCard';
import { SchematicsFilters } from './SchematicsFilters';
import { Pagination } from '@/components/common/Pagination';

export const SchematicsList = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    filters: '',
    page: 1,
    hitsPerPage: 20,
    sort: ['created_at:desc'],
  });

  const { data, isLoading, error } = useSearchSchematics(searchParams);

  // Component implementation
  return (
    <div className="container mx-auto">
      <SchematicsFilters 
        onFilterChange={(filters) => setSearchParams(prev => ({ ...prev, filters, page: 1 }))}
        onSearchChange={(query) => setSearchParams(prev => ({ ...prev, query, page: 1 }))}
        onSortChange={(sort) => setSearchParams(prev => ({ ...prev, sort, page: 1 }))}
      />
      
      {isLoading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.hits.map(schematic => (
              <SchematicCard key={schematic.$id} schematic={schematic} />
            ))}
          </div>
          
          <Pagination
            currentPage={data?.page || 1}
            totalPages={data?.totalPages || 1}
            onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
};
```

#### Schematic Card

Card component for displaying schematic previews:

```tsx
// src/components/features/schematics/SchematicCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Schematic } from '@/types';
import { Link } from 'react-router-dom';
import { formatDate, formatNumber } from '@/lib/utils';

interface SchematicCardProps {
  schematic: Schematic;
}

export const SchematicCard: React.FC<SchematicCardProps> = ({ schematic }) => {
  return (
    <Link to={`/schematics/${schematic.$id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={schematic.preview || '/placeholders/schematic.png'}
              alt={schematic.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-bold text-lg line-clamp-1">{schematic.name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{schematic.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {schematic.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {schematic.tags.length > 3 && (
              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                +{schematic.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex justify-between w-full">
            <span>By {schematic.author}</span>
            <span>{formatNumber(schematic.downloads)} downloads</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
```

#### Schematic Upload Form

Form for uploading new schematics:

```tsx
// src/components/features/schematics/SchematicUploadForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schematicSchema } from '@/schemas/schematic.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUploadSchematic } from '@/api/endpoints/useSchematics';
import { FileUploader } from '@/components/ui/file-uploader';
import { useToast } from '@/hooks/useToast';

export const SchematicUploadForm = () => {
  const { toast } = useToast();
  const [schematicFile, setSchematicFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schematicSchema),
  });
  
  const uploadMutation = useUploadSchematic();
  
  const onSubmit = async (data) => {
    if (!schematicFile) {
      toast({
        title: "Error",
        description: "Please upload a schematic file",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({
        ...data,
        schematicFile,
        previewImage,
      });
      
      toast({
        title: "Success",
        description: "Your schematic has been uploaded",
      });
      
      // Reset form or redirect
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload schematic: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  // Form implementation
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields */}
    </form>
  );
};
```

#### Schematic Detail View

Component for displaying detailed schematic information:

```tsx
// src/components/features/schematics/SchematicDetail.tsx
import { useParams } from 'react-router-dom';
import { useFetchSchematic } from '@/api/endpoints/useSchematics';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { SchematicRating } from './SchematicRating';
import { SchematicComments } from './SchematicComments';

export const SchematicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schematic, isLoading, error } = useFetchSchematic(id);
  
  if (isLoading) return <LoadingOverlay />;
  if (error) return <ErrorMessage error={error} />;
  if (!schematic) return <NotFound message="Schematic not found" />;
  
  return (
    <div className="container mx-auto py-6">
      {/* Schematic details implementation */}
    </div>
  );
};
```

### State Management

Schematic state is managed through custom hooks:

- `useSchematics`: Handles CRUD operations for schematics
- `useSearchSchematics`: Manages search and filtering
- `useSchematicRating`: Handles rating functionality

## Data Model

Schematics follow the `SchematicSchema` defined in `/src/schemas/schematic.schema.ts`:

```typescript
// src/schemas/schematic.schema.ts
import { z } from 'zod';

export const schematicSchema = z.object({
  $id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  author: z.string(),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  minecraft_version: z.string(),
  create_version: z.string(),
  file_url: z.string().optional(),
  preview_url: z.string().optional(),
  downloads: z.number().default(0),
  ratings: z.number().default(0),
  rating_count: z.number().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Schematic = z.infer<typeof schematicSchema>;
```

## API Integration

### Appwrite Integration

Schematics are stored in the Appwrite database in the `schematics` collection, with schematic files and preview images stored in Appwrite Storage.

### Meilisearch Integration

Schematics are indexed in Meilisearch for fast search and filtering by name, description, tags, and other attributes.

## Implementation Details

### File Handling

Schematic files (.nbt or .schem) are handled specially:

1. **Upload Process**:
   - File is uploaded to Appwrite Storage
   - File URL is stored in the schematic document
   - Preview image is processed and optimized

```typescript
// Example file upload implementation
const uploadFile = async (file: File, bucketId: string) => {
  try {
    const compressedFile = await compressImage(file);
    const fileId = ID.unique();
    const result = await storage.createFile(bucketId, fileId, compressedFile);
    return storage.getFileView(bucketId, fileId);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
};
```

2. **Download Process**:
   - User requests download
   - Download count is incremented
   - File is served from Appwrite Storage

```typescript
// Example download implementation
const downloadSchematic = async (schematicId: string) => {
  try {
    // Get schematic data
    const schematic = await databases.getDocument(
      DATABASE_ID,
      SCHEMATICS_COLLECTION_ID,
      schematicId
    );
    
    // Increment download count
    await databases.updateDocument(
      DATABASE_ID,
      SCHEMATICS_COLLECTION_ID,
      schematicId,
      {
        downloads: schematic.downloads + 1
      }
    );
    
    // Return file URL
    return schematic.file_url;
  } catch (error) {
    console.error('Error downloading schematic:', error);
    throw new Error('Failed to download schematic. Please try again.');
  }
};
```

### Rating System

The rating system allows users to rate schematics:

1. **Rating Process**:
   - User submits a rating (1-5 stars)
   - System checks if user has already rated
   - Rating is stored and average is updated

```typescript
// Example rating implementation
const rateSchematic = async (schematicId: string, rating: number, userId: string) => {
  try {
    // Check if user has already rated
    const existingRating = await databases.listDocuments(
      DATABASE_ID,
      RATINGS_COLLECTION_ID,
      [
        Query.equal('schematic_id', schematicId),
        Query.equal('user_id', userId)
      ]
    );
    
    // Handle existing rating (update) or create new rating
    if (existingRating.documents.length > 0) {
      // Update existing rating
    } else {
      // Create new rating
    }
    
    // Update schematic average rating
    // ...
    
    return { success: true };
  } catch (error) {
    console.error('Error rating schematic:', error);
    throw new Error('Failed to submit rating. Please try again.');
  }
};
```

## Security Considerations

1. **File Validation**: Schematic files are validated for format and size
   ```typescript
   const validateSchematicFile = (file: File) => {
     // Check file size
     if (file.size > MAX_SCHEMATIC_SIZE) {
       throw new Error(`File too large. Maximum size is ${MAX_SCHEMATIC_SIZE / 1024 / 1024}MB`);
     }
     
     // Check file extension
     const extension = file.name.split('.').pop()?.toLowerCase();
     if (!['nbt', 'schem', 'schematic'].includes(extension || '')) {
       throw new Error('Invalid file format. Only .nbt, .schem, or .schematic files are allowed.');
     }
     
     return true;
   };
   ```

2. **Permission Management**: Only owners can edit/delete schematics
   ```typescript
   // Check if user is the owner of the schematic
   const isOwner = (schematic, userId) => {
     return schematic.user_id === userId;
   };
   ```

3. **Content Moderation**: Reporting system for inappropriate content
   ```typescript
   const reportSchematic = async (schematicId: string, reason: string, userId: string) => {
     // Create report in database
     // ...
   };
   ```

## Performance Considerations

1. **Lazy Loading**: Images are lazy-loaded for better performance
   ```tsx
   <img 
     src={schematic.preview_url} 
     alt={schematic.name} 
     loading="lazy" 
     className="..."
   />
   ```

2. **Pagination**: Results are paginated to improve load times
   ```tsx
   <Pagination
     currentPage={page}
     totalPages={totalPages}
     onPageChange={setPage}
   />
   ```

3. **Image Optimization**: Preview images are optimized before upload
   ```typescript
   const optimizeImage = async (file: File): Promise<File> => {
     // Image compression logic
     // ...
     return compressedFile;
   };
   ```

## Routing

Schematics feature uses the following routes:

```typescript
// src/routes/schematicRoutes.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router';

const SchematicDetail = lazy(() => import('@/pages/schematics/SchematicDetail'));
const SchematicUpload = lazy(() => import('@/pages/schematics/SchematicUpload'));
const SchematicEdit = lazy(() => import('@/pages/schematics/SchematicEdit'));
const UserSchematics = lazy(() => import('@/pages/schematics/UserSchematics'));

export const schematicRoutes: RouteObject[] = [
  {
    path: 'schematics/:id',
    element: <SchematicDetail />,
  },
  {
    path: 'schematics/upload',
    element: <SchematicUpload />,
  },
  {
    path: 'schematics/edit/:id',
    element: <SchematicEdit />,
  },
  {
    path: 'user/schematics',
    element: <UserSchematics />,
  },
];
```

## Best Practices

1. **Validate User Input**: Always validate input on both client and server
   ```typescript
   // Client-side validation with Zod
   const schema = z.object({
     name: z.string().min(3).max(100),
     // Other validations
   });
   ```

2. **Optimize Images**: Compress and resize images before upload
   ```typescript
   import imageCompression from 'browser-image-compression';
   
   const compressImage = async (file: File): Promise<File> => {
     const options = {
       maxSizeMB: 1,
       maxWidthOrHeight: 1200,
       useWebWorker: true,
     };
     
     try {
       return await imageCompression(file, options);
     } catch (error) {
       console.error('Error compressing image:', error);
       return file;
     }
   };
   ```

3. **Handle File Downloads Properly**: Track downloads and provide feedback
   ```typescript
   const handleDownload = async (schematicId: string) => {
     setDownloading(true);
     try {
       const url = await downloadSchematic(schematicId);
       
       // Create a hidden link element
       const a = document.createElement('a');
       a.href = url;
       a.download = 'schematic.nbt';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       
       toast({
         title: "Success",
         description: "Download started",
       });
     } catch (error) {
       toast({
         title: "Error",
         description: `Download failed: ${error.message}`,
         variant: "destructive",
       });
     } finally {
       setDownloading(false);
     }
   };
   ```

## Related Documentation

- [API Endpoints](../api/endpoints.md)
- [File Uploads](../guides/file-uploads.md)
- [Data Models](../architecture/data-flow.md)
