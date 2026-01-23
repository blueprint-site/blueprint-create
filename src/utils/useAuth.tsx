import { account, teams } from '@/lib/appwrite';

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'admin');
}

export const getGlobalAuthCache = () => {
  if (typeof window === 'undefined') return null;

  if (!window.__authCache) {
    window.__authCache = {
      isAuthenticated: null as boolean | null,
      hasRequiredRole: {} as { [role: string]: boolean },
      timestamp: null as number | null,
    };
  }
  return window.__authCache;
};

declare global {
  interface Window {
    __authCache: {
      isAuthenticated: boolean | null;
      hasRequiredRole: { [role: string]: boolean };
      timestamp: number | null;
    };
  }
}

export interface User {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    roles?: string[];
  };
}

export const CACHE_DURATION_MS = 30 * 60 * 1000;

const ROLE_TO_TEAM_ID: Record<string, string> = {
  admin: 'admin',
};

export interface CachedAuthState {
  isAuthenticated: boolean | null;
  hasRequiredRole: boolean;
  isCacheValid: boolean;
}

export interface AuthRefreshResult {
  isAuthenticated: boolean;
  hasRequiredRole: boolean;
  user: User | null;
}

export function getCachedAuthState(requiredRole?: string): CachedAuthState {
  const cache = getGlobalAuthCache();
  if (!cache) {
    return {
      isAuthenticated: null,
      hasRequiredRole: true,
      isCacheValid: false,
    };
  }

  const isCacheValid = Boolean(
    cache.timestamp &&
    cache.isAuthenticated !== null &&
    Date.now() - cache.timestamp < CACHE_DURATION_MS
  );

  const hasCachedRole =
    requiredRole && cache.hasRequiredRole[requiredRole] !== undefined
      ? cache.hasRequiredRole[requiredRole]
      : true;

  return {
    isAuthenticated: isCacheValid ? cache.isAuthenticated : null,
    hasRequiredRole: isCacheValid ? hasCachedRole : true,
    isCacheValid,
  };
}

export async function refreshAuthState(requiredRole?: string): Promise<AuthRefreshResult> {
  const cache = getGlobalAuthCache();
  if (!cache) {
    return { isAuthenticated: false, hasRequiredRole: false, user: null };
  }

  try {
    const session = await account.getSession({ sessionId: 'current' });

    if (!session) {
      cache.isAuthenticated = false;
      cache.timestamp = Date.now();
      if (requiredRole) cache.hasRequiredRole[requiredRole] = false;
      return { isAuthenticated: false, hasRequiredRole: false, user: null };
    }

    cache.isAuthenticated = true;
    cache.timestamp = Date.now();

    if (!requiredRole) {
      return { isAuthenticated: true, hasRequiredRole: true, user: null };
    }

    const user = (await account.get()) as User;
    const hasRole = await resolveRole(user, requiredRole);

    cache.hasRequiredRole[requiredRole] = hasRole;
    return { isAuthenticated: true, hasRequiredRole: hasRole, user };
  } catch (error) {
    console.error('Failed to refresh auth state:', error);
    cache.isAuthenticated = false;
    cache.timestamp = Date.now();
    if (requiredRole) cache.hasRequiredRole[requiredRole] = false;
    return { isAuthenticated: false, hasRequiredRole: false, user: null };
  }
}

export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user) return false;
  const roles = user.prefs?.roles ?? [];
  const has = roles.includes(role);

  const cache = getGlobalAuthCache();
  if (cache) {
    cache.hasRequiredRole[role] = has;
    cache.timestamp = Date.now();
  }
  return has;
}



export function isAdminFromRoles(roles?: string[] | null): boolean {
  const has = Array.isArray(roles) ? roles.includes('admin') : false;
  const cache = getGlobalAuthCache();
  if (cache) {
    cache.hasRequiredRole['admin'] = has;
    cache.timestamp = Date.now();
  }
  return has;
}

async function resolveRole(user: User, role: string): Promise<boolean> {
  if (hasRole(user, role)) return true;
  return hasTeamRole(user, role);
}

async function hasTeamRole(user: User, role: string): Promise<boolean> {
  const teamId = ROLE_TO_TEAM_ID[role];
  if (!teamId) return false;

  try {
    const memberships = await teams.listMemberships({ teamId });
    return memberships.memberships.some((membership: { userId: string }) => membership.userId === user.$id);
  } catch (error) {
    console.error(`Error checking ${role} team membership:`, error);
    return false;
  }
}