import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Card className='bg-surface-1 overflow-hidden'>
        <CardHeader className='space-y-0 p-10'>
          <Skeleton className='aspect-square w-full rounded-full' />
        </CardHeader>
        <CardContent className='p-4'>
          <Skeleton className='mb-2 h-6 w-24' />
          <Skeleton className='h-4 w-32' />
        </CardContent>
      </Card>
    );
  }

  if (!contributor) return null;

  return (
    <Card className='bg-surface-1 overflow-hidden transition-colors'>
      <CardContent className='flex items-center space-y-2 p-4 sm:flex-col'>
        <img
          loading='lazy'
          src={`https://avatars.githubusercontent.com/u/${contributor.id}?size=160`}
          alt={`${contributor.login}'s profile picture`}
          className='w-12 rounded-full sm:w-auto'
        />
        <div className='flex flex-col space-y-1 pl-4 sm:pl-0'>
          <a
            href={`https://github.com/${contributor.login}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blueprint-foreground hover:underline'
          >
            {contributor.login}
          </a>
          <div className='text-blueprint-foreground-muted space-y-1 text-sm'>
            {contributor.frontendContributions > 0 && (
              <div>Frontend: {contributor.frontendContributions}</div>
            )}
            {contributor.apiContributions > 0 && <div>API: {contributor.apiContributions}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
