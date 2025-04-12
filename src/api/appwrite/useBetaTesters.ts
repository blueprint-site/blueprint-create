import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks';
import { teams } from '@/config/appwrite';
import type { Models } from 'appwrite';

// Constants
const BETA_TEAM_ID = 'your-team-id-here'; // Replace with actual team ID from Appwrite console
const BETA_DEFAULT_ROLE = 'tester';

// Types
export interface BetaTesterMembership extends Models.Membership {
  userEmail: string;
  userName: string;
  userId: string;
}

/**
 * Hook to fetch all beta testers
 * @returns Query result with list of beta testers
 */
export const useFetchBetaTesters = () => {
  return useQuery<{
    testers: BetaTesterMembership[];
    total: number;
  }>({
    queryKey: ['betaTesters', 'list'],
    queryFn: async () => {
      try {
        const response = await teams.listMemberships(BETA_TEAM_ID);

        return {
          testers: response.memberships as BetaTesterMembership[],
          total: response.total,
        };
      } catch (error) {
        console.error('Error fetching beta testers:', error);
        throw new Error('Failed to fetch beta testers');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to invite a user to become a beta tester
 * @returns Mutation function for inviting beta testers
 */
export const useInviteBetaTester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      name,
      roles = [BETA_DEFAULT_ROLE],
    }: {
      email: string;
      name: string;
      roles?: string[];
    }) => {
      try {
        // Create URL for redirection after invitation acceptance
        const url = new URL(window.location.origin);
        url.pathname = '/beta/welcome';

        const result = await teams.createMembership(
          BETA_TEAM_ID,
          roles,
          email,
          url.toString(),
          name
        );

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Beta tester invitation sent ✅',
        });

        return result;
      } catch (error) {
        console.error('Error inviting beta tester:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Failed to send invitation ❌',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['betaTesters', 'list'] });
    },
  });
};

/**
 * Hook to remove a user from the beta testing program
 * @returns Mutation function for removing beta testers
 */
export const useRemoveBetaTester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (membershipId: string) => {
      try {
        const result = await teams.deleteMembership(BETA_TEAM_ID, membershipId);

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Beta tester removed ✅',
        });

        return result;
      } catch (error) {
        console.error('Error removing beta tester:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Failed to remove beta tester ❌',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['betaTesters', 'list'] });
    },
  });
};

/**
 * Helper function to get beta tester team details
 * @returns Promise with team details
 */
export const getBetaTeamDetails = async () => {
  try {
    return await teams.get(BETA_TEAM_ID);
  } catch (error) {
    console.error('Error getting beta team details:', error);
    throw error;
  }
};
