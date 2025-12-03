// tests/services/teamsService.test.js
import { updateTeamMembership } from '../../src/services/teamsService';
import { appwrite } from '../../src/utils/appwrite';
import { getUserMemberships } from '../../src/services/userService';
import { ConflictError, NotFoundError } from '../../src/utils/errors';

jest.mock('../utils/config', () => ({
  adminTeamId: 'admin-team-id',
  betaTesterTeamId: 'beta-tester-id',
  MEMBERSHIP_REDIRECT_URL: 'https://example.com',
  config: {
    apiKey: 'test-api-key',
    projectId: 'test-project-id',
    endpoint: 'https://test-endpoint.appwrite.io/v1',
    adminTeamId: 'admin-team-id',
    betaTesterTeamId: 'beta-tester-id',
    MEMBERSHIP_REDIRECT_URL: 'https://example.com',
  },
}));

// Mock dependencies
jest.mock('../../src/utils/appwrite', () => ({
  appwrite: {
    teamsSdk: {
      createMembership: jest.fn(),
      deleteMembership: jest.fn(),
    },
  },
}));

jest.mock('../../src/services/userService', () => ({
  getUserMemberships: jest.fn(),
}));

describe('teamsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTeamMembership', () => {
    it('should add a user to a team', async () => {
      // Setup - use the proper response format
      appwrite.teamsSdk.createMembership.mockResolvedValue({
        $id: 'new-membership-id',
        $createdAt: '2023-01-20T12:00:00.000+00:00',
        $updatedAt: '2023-01-20T12:00:00.000+00:00',
        userId: 'user1',
        userName: 'Test User 1',
        userEmail: 'user1@example.com',
        teamId: 'team1',
        teamName: 'Developers',
        invited: '2023-01-20T12:00:00.000+00:00',
        joined: null,
        confirm: true,
        roles: ['member'],
      });

      // Execute
      const result = await updateTeamMembership({
        payload: { userId: 'user1', teamId: 'team1', add: true },
      });

      // Verify
      expect(appwrite.teamsSdk.createMembership).toHaveBeenCalled();
      expect(result.message).toContain('User user1 added to team team1');
      expect(result.message).toContain('new-membership-id');
    });

    it('should throw ConflictError if user already in team', async () => {
      // Setup - simulate 409 conflict response from Appwrite
      const conflictError = {
        response: {
          code: 409,
          message: 'User with the requested email already exists in this team',
        },
      };
      appwrite.teamsSdk.createMembership.mockRejectedValue(conflictError);

      // Execute & Verify
      await expect(
        updateTeamMembership({
          payload: { userId: 'user1', teamId: 'team1', add: true },
        })
      ).rejects.toBeInstanceOf(ConflictError);
    });

    it('should remove a user from a team', async () => {
      // Setup - mock the memberships with proper format
      getUserMemberships.mockResolvedValue([
        {
          $id: 'membership1',
          $createdAt: '2023-01-15T06:38:00.000+00:00',
          $updatedAt: '2023-01-15T06:38:00.000+00:00',
          userId: 'user1',
          teamId: 'team1',
          teamName: 'Developers',
        },
      ]);
      appwrite.teamsSdk.deleteMembership.mockResolvedValue({});

      // Execute
      const result = await updateTeamMembership({
        payload: { userId: 'user1', teamId: 'team1', add: false },
      });

      // Verify
      expect(appwrite.teamsSdk.deleteMembership).toHaveBeenCalled();
      expect(result.message).toContain('User user1 removed from team team1');
    });
  });
});
