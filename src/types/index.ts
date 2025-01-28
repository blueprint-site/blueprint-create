// GitHub Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface ContributorStats {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
}

// Auth Types
export interface UserData {
  id: string;
  email?: string;
  created_at: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    custom_claims?: {
      global_name?: string;
    };
    preferred_username?: string;
  };
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
}

// Addon Types
export interface Addon {
  id: number;
  project_id: string;
  slug: string;
  author: string;
  title: string;
  description: string;
  categories: string[];
  display_categories: string[];
  versions: string[];
  downloads: number;
  follows: number;
  icon_url: string;
  date_created: string;
  date_modified: string;
  latest_version: string;
  license: string;
  gallery: string[];
  featured_gallery: string | null;
  color: string;
}