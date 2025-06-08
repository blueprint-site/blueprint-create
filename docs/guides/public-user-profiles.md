# Public User Profile Setup Guide

This guide explains how to set up public user profile pages and fetch user schematics by user ID in the Blueprint Create application.

## Overview

The codebase now includes infrastructure for public user profiles that can display any user's schematics. Here's how the system works:

## Key Components

### 1. Hooks for Data Fetching

#### `useFetchUserSchematics(user_id: string)`
Located in `/src/api/appwrite/useSchematics.ts`

```typescript
// Fetch schematics for any user by their ID
const { data: userSchematics } = useFetchUserSchematics(userId);
```

This hook fetches all schematics uploaded by a specific user using their user ID.

#### `usePublicUser(userId: string)` (New)
Located in `/src/api/appwrite/usePublicUsers.ts`

```typescript
// Fetch public user data (limited for privacy)
const { data: publicUser } = usePublicUser(userId);
```

**Note**: Currently returns null as it needs a custom server endpoint to safely return public user data without exposing private information.

### 2. Components

#### `PublicProfile`
Located in `/src/pages/PublicProfile.tsx`

A React component that displays a user's public profile including their schematics. Handles both viewing your own profile and other users' profiles.

#### `PublicUserSchematicList`
Located in `/src/components/features/schematics/PublicUserSchematicList.tsx`

Displays a grid of schematics for a given user, similar to `UserSchematicList` but without edit/delete functionality for non-owners.

## How to Use

### 1. Basic Usage - Fetch User Schematics

```typescript
import { useFetchUserSchematics } from '@/api/appwrite/useSchematics';

function UserSchematicsPage() {
  // Replace 'user-id-here' with the actual user ID
  const { data: schematics, isLoading } = useFetchUserSchematics('user-id-here');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>User's Schematics</h2>
      {schematics?.map(schematic => (
        <div key={schematic.$id}>
          <h3>{schematic.title}</h3>
          <p>{schematic.description}</p>
          <p>Downloads: {schematic.downloads || 0}</p>
          <p>Likes: {schematic.likes || 0}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Using the Public Profile Component

```typescript
import PublicProfile from '@/pages/PublicProfile';

// Method 1: Use with user ID prop
<PublicProfile userId="specific-user-id" />

// Method 2: Use with URL routing (username in URL)
// Route: /user/:username
// The component will extract username from URL params
<PublicProfile />
```

### 3. Setting Up Routes

Update your routes to include public profile support:

```typescript
// In your router configuration
import PublicProfile from '@/pages/PublicProfile';

const routes = [
  {
    path: '/user/:username',
    element: <PublicProfile />
  },
  {
    path: '/profile/:userId', 
    element: <PublicProfile />
  }
];
```

## Current Route Structure

The existing routes in `/src/routes/userRoutes.tsx`:

```typescript
export const userRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> }, // Current implementation
  { path: 'user', element: <Profile /> },           // Current user profile
];
```

## Database Schema

The schematic documents should have these fields for user association:

```typescript
interface Schematic {
  $id: string;
  user_id: string;        // The user who created the schematic
  user_name?: string;     // Cached username for display
  user_avatar?: string;   // Cached avatar URL for display
  title: string;
  description?: string;
  downloads?: number;
  likes?: number;
  categories?: string[];
  image_urls?: string[];
  $createdAt: string;
  // ... other fields
}
```

## Security Considerations

### Current Implementation
- ✅ Schematics are public by default (anyone can view)
- ✅ No private user data is exposed
- ❌ Public user profiles need safe endpoint (currently not implemented)

### Recommended Improvements

1. **Create a Public User Endpoint**: Implement a server function that returns only safe user data:
   ```typescript
   interface SafePublicUser {
     $id: string;
     name: string;
     $createdAt: string;
     avatar?: string;
     bio?: string;
   }
   ```

2. **Add Privacy Controls**: Allow users to set their profile as private

3. **Implement Username Resolution**: Create a way to convert usernames to user IDs

## Appwrite Function Implementation

For better security and performance, consider implementing an Appwrite function to handle public user profile data. This approach provides several benefits:

### Benefits of Using Appwrite Functions

1. **Security**: Server-side filtering ensures only safe data is returned
2. **Performance**: Combine multiple queries into a single request
3. **Caching**: Implement server-side caching for frequently accessed profiles
4. **Username Resolution**: Handle username-to-userID mapping securely
5. **Privacy Controls**: Respect user privacy settings on the server side

### Example Appwrite Function Structure

Create a new function in your `/functions` directory:

```bash
# Create the function
mkdir -p functions/GetPublicUserProfile/src
```

**Function Code (`/functions/GetPublicUserProfile/src/main.js`):**

```javascript
import { Client, Databases, Query, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);

  try {
    const { username, userId } = JSON.parse(req.body);
    let targetUserId = userId;

    // Step 1: Resolve username to userId if needed
    if (username && !userId) {
      // You could implement a username lookup here
      // For now, assuming username === userId
      targetUserId = username;
    }

    if (!targetUserId) {
      return res.json({ error: 'User identifier required' }, 400);
    }

    // Step 2: Get user data (only safe fields)
    let userData = null;
    try {
      const user = await users.get(targetUserId);
      userData = {
        $id: user.$id,
        name: user.name,
        $createdAt: user.$createdAt,
        // Only include safe preferences
        avatar: user.prefs?.avatar,
        bio: user.prefs?.bio,
        // Check if profile is public (default: true)
        isPublic: user.prefs?.isPublic !== false
      };

      // Respect privacy settings
      if (!userData.isPublic) {
        return res.json({ error: 'Profile is private' }, 403);
      }
    } catch (userError) {
      log('User not found or error:', userError);
      return res.json({ error: 'User not found' }, 404);
    }

    // Step 3: Get user's public content counts
    const [schematics, addons, badges] = await Promise.all([
      databases.listDocuments('main', 'schematics', [
        Query.equal('user_id', targetUserId),
        Query.limit(1) // Just count, don't fetch all
      ]),
      databases.listDocuments('main', 'addons', [
        Query.equal('user_id', targetUserId),
        Query.limit(1)
      ]),
      databases.listDocuments('main', 'badges', [
        Query.equal('user_id', targetUserId),
        Query.limit(1)
      ])
    ]);

    // Step 4: Compile response
    const publicProfile = {
      user: userData,
      stats: {
        schematicsCount: schematics.total || 0,
        addonsCount: addons.total || 0,
        badgesCount: badges.total || 0,
        // You could add followers count here if implemented
        followersCount: 0
      },
      // Add timestamp for caching
      lastUpdated: new Date().toISOString()
    };

    log('Public profile retrieved for user:', targetUserId);
    return res.json(publicProfile);

  } catch (err) {
    error('Function error:', err);
    return res.json({ error: 'Internal server error' }, 500);
  }
};
```

**Package.json (`/functions/GetPublicUserProfile/package.json`):**

```json
{
  "name": "get-public-user-profile",
  "version": "1.0.0",
  "description": "Get public user profile data safely",
  "main": "src/main.js",
  "type": "module",
  "dependencies": {
    "node-appwrite": "^13.0.0"
  }
}
```

### Frontend Integration

Update your `usePublicUser` hook to use the function:

```typescript
// In /src/api/appwrite/usePublicUsers.ts
export const usePublicUser = (userId?: string) => {
  return useQuery<PublicUserProfile | null>({
    queryKey: ['publicUser', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const response = await functions.createExecution(
          'getPublicUserProfile', // Function ID
          JSON.stringify({ userId }),
          false, // Not async
          '/', // Path
          'POST'
        );

        if (response.responseStatusCode === 200) {
          return JSON.parse(response.responseBody);
        }
        throw new Error('Failed to fetch public user profile');
      } catch (error) {
        console.error('Error fetching public user:', error);
        return null;
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: false,
  });
};
```

### Deployment

Deploy the function using Appwrite CLI:

```bash
# Deploy the function
appwrite functions createDeployment \
  --functionId=getPublicUserProfile \
  --code="./functions/GetPublicUserProfile" \
  --activate=true
```

### Additional Enhancements

1. **Caching Layer**: Add Redis or in-memory caching for frequently accessed profiles
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Analytics**: Track profile view counts
4. **Username Indexing**: Create a separate collection for username-to-userID mapping
5. **Privacy Controls**: Add more granular privacy settings (e.g., hide stats, hide bio)

This approach provides a much more robust and secure way to handle public user profiles compared to direct database queries from the frontend.

## Example Implementation

Here's a complete example of how to create a public profile page:

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUserSchematics } from '@/api/appwrite/useSchematics';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: schematics, isLoading, error } = useFetchUserSchematics(userId);

  if (isLoading) return <div>Loading user schematics...</div>;
  if (error) return <div>Error loading schematics</div>;
  if (!schematics?.length) return <div>No schematics found</div>;

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <div className="schematics-grid">
        {schematics.map(schematic => (
          <div key={schematic.$id} className="schematic-card">
            <h3>{schematic.title}</h3>
            <p>{schematic.description}</p>
            <div className="stats">
              <span>👥 {schematic.downloads || 0} downloads</span>
              <span>❤️ {schematic.likes || 0} likes</span>
            </div>
            {schematic.image_urls?.[0] && (
              <img src={schematic.image_urls[0]} alt={schematic.title} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfilePage;
```

## Next Steps

1. **Update Routes**: Modify `/src/routes/userRoutes.tsx` to use the new `PublicProfile` component
2. **Implement User Lookup**: Create a server function to safely resolve usernames to user IDs
3. **Add Privacy Settings**: Allow users to control profile visibility
4. **Cache User Data**: Consider caching user names and avatars in schematic documents for better performance

## API Reference

### Key Functions

- `useFetchUserSchematics(userId: string)` - Fetches all schematics for a user
- `usePublicUser(userId: string)` - Fetches safe public user data (needs implementation)
- `PublicProfile` - Component for displaying public user profiles
- `PublicUserSchematicList` - Component for displaying user's schematics

### Database Queries

The system uses Appwrite's query system:

```typescript
// Query schematics by user ID
Query.equal('user_id', userId)
```

This guide should help you implement public user profiles and schematic fetching in your Blueprint Create application!
