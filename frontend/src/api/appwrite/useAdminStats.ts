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
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Fetch users stats from team memberships
      // Since we can't access users collection directly from client SDK,
      // we use team memberships as a proxy for user count
      let totalUsers = 0;
      let newUsersThisWeek = 0;

      try {
        // Get total team members count
        const teamMembersResponse = await teams.listMemberships('blueprint', [
          Query.limit(100), // Get more to check registration dates
        ]);
        totalUsers = teamMembersResponse.total;

        // Count new members this week
        if (teamMembersResponse.memberships) {
          newUsersThisWeek = teamMembersResponse.memberships.filter((membership) => {
            const joinedDate = new Date(membership.$createdAt);
            return joinedDate >= weekAgo;
          }).length;
        }
      } catch (error) {
        console.warn('Could not fetch team membership count:', error);
        // Set to 0 if can't fetch
        totalUsers = 0;
        newUsersThisWeek = 0;
      }

      // Fetch total addons count first
      const totalAddonsResponse = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.limit(1), // Just to get total
      ]);

      // Fetch validated addons count
      const validatedAddonsResponse = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.equal('isValid', true),
        Query.limit(1), // Just to get count
      ]);

      // Fetch pending (unchecked) addons count
      const pendingAddonsResponse = await databases.listDocuments(DATABASE_ID, 'addons', [
        Query.equal('isChecked', false),
        Query.limit(1), // Just to get count
      ]);

      // Fetch featured addons
      const featuredAddonsResponse = await databases.listDocuments(DATABASE_ID, 'featured_addons', [
        Query.equal('active', true),
        Query.limit(100),
      ]);

      // Fetch total schematics count
      const totalSchematicsResponse = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.limit(1), // Just to get total
      ]);

      // Fetch featured schematics count
      const featuredSchematicsResponse = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.equal('featured', true),
        Query.limit(1), // Just to get count
      ]);

      // Calculate total downloads (need to fetch actual documents for this)
      const schematicsForDownloads = await databases.listDocuments(DATABASE_ID, 'schematics', [
        Query.limit(500), // Fetch reasonable amount for calculation
      ]);
      const totalSchematicDownloads = schematicsForDownloads.documents.reduce(
        (sum, s) => sum + (s.downloads || 0),
        0
      );

      // Calculate average complexity
      const complexityLevels = schematicsForDownloads.documents
        .map((s) => s.complexity_level)
        .filter(Boolean);
      const complexityCounts: Record<string, number> = {};
      complexityLevels.forEach((level) => {
        complexityCounts[level] = (complexityCounts[level] || 0) + 1;
      });
      const mostCommonComplexity =
        Object.entries(complexityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'moderate';

      // Fetch total blogs count
      const totalBlogsResponse = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.limit(1), // Just to get total
      ]);

      // Fetch published blogs count
      const publishedBlogsResponse = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.equal('status', 'published'),
        Query.limit(1), // Just to get count
      ]);

      // Fetch draft blogs count
      const draftBlogsResponse = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.equal('status', 'draft'),
        Query.limit(1), // Just to get count
      ]);

      // Calculate total likes (need to fetch actual documents)
      const blogsForLikes = await databases.listDocuments(DATABASE_ID, 'blogs', [
        Query.limit(500), // Fetch reasonable amount for calculation
      ]);
      const totalBlogLikes = blogsForLikes.documents.reduce((sum, b) => sum + (b.likes || 0), 0);

      return {
        users: {
          total: totalUsers,
          newThisWeek: newUsersThisWeek,
          activeToday: 0, // Would need session tracking
        },
        addons: {
          total: totalAddonsResponse.total,
          validated: validatedAddonsResponse.total,
          pending: pendingAddonsResponse.total,
          featured: featuredAddonsResponse.total,
        },
        schematics: {
          total: totalSchematicsResponse.total,
          featured: featuredSchematicsResponse.total,
          totalDownloads: totalSchematicDownloads,
          averageComplexity: mostCommonComplexity,
        },
        blogs: {
          total: totalBlogsResponse.total,
          published: publishedBlogsResponse.total,
          draft: draftBlogsResponse.total,
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
