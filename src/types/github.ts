export type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
};

export type ContributorStats = {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[] | null;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
};

export type GitHubContributorsResponse = GitHubUser[];
