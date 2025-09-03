import { useState, useEffect } from 'react';

// Define types
interface GitHubUser {
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

const GITHUB_API_BASE = 'https://api.github.com/repos/blueprint-site';

export function useGitHubContributors() {
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchContributors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Helper function to fetch contributors for a specific repo
        const getContributors = async (repo: string): Promise<GitHubUser[]> => {
          const response = await fetch(`${GITHUB_API_BASE}/${repo}/contributors?per_page=50`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${repo} contributors`);
          }

          return response.json();
        };

        // Fetch contributors from both repositories concurrently
        const [frontend, api] = await Promise.all([
          getContributors('blueprint-create'),
          getContributors('blueprint-api'),
        ]);

        // Process frontend contributors first
        const allContributors: ContributorStats[] = frontend
          .filter((user: GitHubUser) => user.login !== 'blueprint-site')
          .map((user: GitHubUser) => ({
            login: user.login,
            id: user.id,
            avatar_url: user.avatar_url,
            frontendContributions: user.contributions,
            apiContributions:
              api.find((u: GitHubUser) => u.login === user.login)?.contributions || 0,
          }));

        // Add API-only contributors
        const apiOnlyContributors: ContributorStats[] = api
          .filter(
            (user: GitHubUser) =>
              user.login !== 'blueprint-site' &&
              !frontend.some((u: GitHubUser) => u.login === user.login)
          )
          .map((user: GitHubUser) => ({
            login: user.login,
            id: user.id,
            avatar_url: user.avatar_url,
            frontendContributions: 0,
            apiContributions: user.contributions,
          }));

        // Sort by total contributions (descending)
        setContributors(
          [...allContributors, ...apiOnlyContributors].sort(
            (a, b) =>
              b.frontendContributions +
              b.apiContributions -
              (a.frontendContributions + a.apiContributions)
          )
        );
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to load contributors. Please try again later.');
          console.error('Error fetching contributors:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
    return () => controller.abort();
  }, []);

  return { contributors, isLoading, error };
}
