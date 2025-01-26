import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ContributorStats {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
}

interface ContributorCardProps {
  contributor?: ContributorStats;
  isLoading?: boolean;
}

export const ContributorCard = ({ contributor, isLoading }: ContributorCardProps) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="space-y-0 p-10">
          <Skeleton className="aspect-square w-full rounded-full" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!contributor) return null;

  return (
    <Card className="overflow-hidden bg-blueprint transition-colors">
      <CardHeader className="space-y-0 p-10">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={`https://avatars.githubusercontent.com/u/${contributor.id}?size=200`}
            alt={`${contributor.login}'s profile picture`}
            className="h-full w-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-1">
          <a 
            href={`https://github.com/${contributor.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:underline"
          >
            {contributor.login}
          </a>
        </CardTitle>
        <div className="space-y-1 text-sm text-white/60">
          {contributor.frontendContributions > 0 && (
            <div>Frontend: {contributor.frontendContributions}</div>
          )}
          {contributor.apiContributions > 0 && (
            <div>API: {contributor.apiContributions}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ContributorCard;