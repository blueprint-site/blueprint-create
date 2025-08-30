import { useQuery } from '@tanstack/react-query';
import { databases, teams } from '@/config/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = 'main';

interface AdminStats {
  users: {
    total: number;
    newThisWeek: number;
    activeToday: number;
  };
  addons: {
    total: number;
    validated: number;
    pending: number;
    featured: number;
  };
  schematics: {
    total: number;
    featured: number;
    totalDownloads: number;
    averageComplexity: string;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
    totalLikes: number;
  };
}

/**
 * Hook to fetch admin dashboard statistics
 */
export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      // Get current date info for time-based queries
      // const now = new Date();
      // const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Fetch users stats
      const usersResponse = await teams.listMemberships('admin', [Query.limit(100)]);
      const totalUsers = usersResponse.total;

      // Fetch addons stats
      const addonsResponse = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.limit(1000),
      ]);
      const validatedAddons = addonsResponse.documents.filter((a) => a.isValid === true).length;
      const pendingAddons = addonsResponse.documents.filter((a) => !a.isChecked).length;

      // Fetch featured addons
      const featuredAddonsResponse = await databases.listDocuments(DATABASE_ID, 'featured_addons', [
        Query.equal('active', true),
      ]);

      // Fetch schematics stats
      const schematicsResponse = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.limit(1000),
      ]);

      const featuredSchematics = schematicsResponse.documents.filter(
        (s) => s.featured === true
      ).length;
      const totalSchematicDownloads = schematicsResponse.documents.reduce(
        (sum, s) => sum + (s.downloads || 0),
        0
      );

      // Calculate average complexity
      const complexityLevels = schematicsResponse.documents
        .map((s) => s.complexity_level)
        .filter(Boolean);
      const complexityCounts: Record<string, number> = {};
      complexityLevels.forEach((level) => {
        complexityCounts[level] = (complexityCounts[level] || 0) + 1;
      });
      const mostCommonComplexity =
        Object.entries(complexityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'moderate';

      // Fetch blogs stats
      const blogsResponse = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.limit(1000),
      ]);
      const publishedBlogs = blogsResponse.documents.filter((b) => b.status === 'published').length;
      const draftBlogs = blogsResponse.documents.filter((b) => b.status === 'draft').length;
      const totalBlogLikes = blogsResponse.documents.reduce((sum, b) => sum + (b.likes || 0), 0);

      return {
        users: {
          total: totalUsers,
          newThisWeek: 0, // Would need to track registration dates
          activeToday: 0, // Would need session tracking
        },
        addons: {
          total: addonsResponse.total,
          validated: validatedAddons,
          pending: pendingAddons,
          featured: featuredAddonsResponse.total,
        },
        schematics: {
          total: schematicsResponse.total,
          featured: featuredSchematics,
          totalDownloads: totalSchematicDownloads,
          averageComplexity: mostCommonComplexity,
        },
        blogs: {
          total: blogsResponse.total,
          published: publishedBlogs,
          draft: draftBlogs,
          totalLikes: totalBlogLikes,
        },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

/**
 * Hook to fetch recent activity for admin dashboard
 */
export const useAdminRecentActivity = () => {
  return useQuery({
    queryKey: ['admin', 'recentActivity'],
    queryFn: async () => {
      // Fetch recent schematics
      const recentSchematics = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.orderDesc('$createdAt'),
        Query.limit(5),
      ]);

      // Fetch recent addons
      const recentAddons = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.orderDesc('$createdAt'),
        Query.limit(5),
      ]);

      // Fetch recent blogs
      const recentBlogs = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.orderDesc('$createdAt'),
        Query.limit(5),
      ]);

      return {
        schematics: recentSchematics.documents,
        addons: recentAddons.documents,
        blogs: recentBlogs.documents,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch content pending moderation
 */
export const useAdminPendingContent = () => {
  return useQuery({
    queryKey: ['admin', 'pendingContent'],
    queryFn: async () => {
      // Fetch unchecked addons
      const pendingAddons = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.equal('isChecked', false),
        Query.limit(10),
      ]);

      // Fetch draft blogs
      const draftBlogs = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.equal('status', 'draft'),
        Query.limit(10),
      ]);

      // Fetch unvalidated schematics
      const unvalidatedSchematics = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.equal('isValid', false),
        Query.limit(10),
      ]);

      return {
        addons: pendingAddons.documents,
        blogs: draftBlogs.documents,
        schematics: unvalidatedSchematics.documents,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
