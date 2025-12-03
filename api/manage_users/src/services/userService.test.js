// tests/services/userService.test.js
import { fetchUsers, getUserMemberships } from '../../src/services/userService';
import { appwrite } from '../../src/utils/appwrite';

// Mock the appwrite module
jest.mock('../../src/utils/appwrite', () => ({
  appwrite: {
    usersSdk: {
      list: jest.fn(),
      listMemberships: jest.fn(),
    },
  },
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch users with the correct query parameters', async () => {
      // Setup
      const mockUserList = {
        total: 2,
        users: [
          {
            $id: 'user1',
            $createdAt: '2023-01-15T06:38:00.000+00:00',
            $updatedAt: '2023-01-15T06:38:00.000+00:00',
            name: 'Test User 1',
            email: 'user1@example.com',
            status: true,
          },
          {
            $id: 'user2',
            $createdAt: '2023-01-16T09:42:00.000+00:00',
            $updatedAt: '2023-01-16T09:42:00.000+00:00',
            name: 'Test User 2',
            email: 'user2@example.com',
            status: true,
          },
        ],
      };

      const mockMemberships = {
        total: 1,
        memberships: [
          {
            $id: 'membership1',
            $createdAt: '2023-01-15T06:38:00.000+00:00',
            $updatedAt: '2023-01-15T06:38:00.000+00:00',
            userId: 'user1',
            teamId: 'team1',
            teamName: 'Developers',
            roles: ['member'],
          },
        ],
      };

      appwrite.usersSdk.list.mockResolvedValue(mockUserList);
      appwrite.usersSdk.listMemberships.mockResolvedValue(mockMemberships);

      // Execute
      const result = await fetchUsers({
        payload: { search: 'test', limit: 10, offset: 0 },
      });

      // Verify
      expect(appwrite.usersSdk.list).toHaveBeenCalled();
      expect(result.total).toBe(2);
      expect(result.users).toHaveLength(2);
      // Check that teams were added to user objects
      expect(result.users[0].teams).toBeDefined();
    });

    // Other tests remain similar but with updated mock structures
  });

  describe('getUserMemberships', () => {
    it('should return user memberships', async () => {
      // Setup
      const mockMemberships = {
        total: 2,
        memberships: [
          {
            $id: 'membership1',
            $createdAt: '2023-01-15T06:38:00.000+00:00',
            $updatedAt: '2023-01-15T06:38:00.000+00:00',
            userId: 'user1',
            teamId: 'team1',
            teamName: 'Developers',
            roles: ['member'],
          },
          {
            $id: 'membership2',
            $createdAt: '2023-01-15T06:40:00.000+00:00',
            $updatedAt: '2023-01-15T06:40:00.000+00:00',
            userId: 'user1',
            teamId: 'adminTeamId',
            teamName: 'Administrators',
            roles: ['owner'],
          },
        ],
      };

      appwrite.usersSdk.listMemberships.mockResolvedValue(mockMemberships);

      // Execute
      const result = await getUserMemberships('user1');

      // Verify
      expect(appwrite.usersSdk.listMemberships).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockMemberships.memberships);
      expect(result).toHaveLength(2);
      expect(result[0].$id).toBe('membership1');
      expect(result[1].teamId).toBe('adminTeamId');
    });
  });
});
