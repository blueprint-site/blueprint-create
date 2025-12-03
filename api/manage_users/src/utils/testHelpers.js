// tests/utils/testHelpers.js

/**
 * Creates a mock user object with Appwrite's expected format
 */
export function createMockUser(id, name, email, options = {}) {
  return {
    $id: id,
    $createdAt: options.createdAt || '2023-01-15T06:38:00.000+00:00',
    $updatedAt: options.updatedAt || '2023-01-15T06:38:00.000+00:00',
    name: name,
    email: email,
    status: options.status !== undefined ? options.status : true,
    emailVerification:
      options.emailVerification !== undefined
        ? options.emailVerification
        : true,
    phoneVerification:
      options.phoneVerification !== undefined
        ? options.phoneVerification
        : false,
    labels: options.labels || [],
    prefs: options.prefs || {},
  };
}

/**
 * Creates a mock membership object with Appwrite's expected format
 */
export function createMockMembership(userId, teamId, options = {}) {
  return {
    $id: options.id || `membership-${userId}-${teamId}`,
    $createdAt: options.createdAt || '2023-01-15T06:38:00.000+00:00',
    $updatedAt: options.updatedAt || '2023-01-15T06:38:00.000+00:00',
    userId: userId,
    userName: options.userName || 'Test User',
    userEmail: options.userEmail || 'user@example.com',
    teamId: teamId,
    teamName: options.teamName || 'Test Team',
    invited: options.invited || '2023-01-15T06:38:00.000+00:00',
    joined: options.joined || '2023-01-15T06:38:00.000+00:00',
    confirm: options.confirm !== undefined ? options.confirm : false,
    roles: options.roles || ['member'],
  };
}

/**
 * Creates a mock team object with Appwrite's expected format
 */
export function createMockTeam(id, name, options = {}) {
  return {
    $id: id,
    $createdAt: options.createdAt || '2023-01-15T06:38:00.000+00:00',
    $updatedAt: options.updatedAt || '2023-01-15T06:38:00.000+00:00',
    name: name,
    total: options.total || 1,
    prefs: options.prefs || {},
  };
}

/**
 * Creates mock users list response
 */
export function createMockUsersList(users = []) {
  return {
    total: users.length,
    users: users,
  };
}

/**
 * Creates mock memberships list response
 */
export function createMockMembershipsList(memberships = []) {
  return {
    total: memberships.length,
    memberships: memberships,
  };
}
