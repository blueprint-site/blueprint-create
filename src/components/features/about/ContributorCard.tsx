import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/config/utils';

interface ContributorStats {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
}

interface ContributorCardProps {
  contributor: ContributorStats;
  className?: string;
}

const getBackgroundColor = (points: number): string => {
  if (points >= 90) {
    return 'bg-brass_casing ';
  } else if (points >= 50) {
    return 'bg-dark_oak_planks-copper_block';
  } else {
    return 'bg-dark_oak_planks-iron_block';
  }
};

const getBorderColor = (points: number): string => {
  if (points >= 90) {
    return 'border-yellow-600'; // A slightly softer yellow for brass
  } else if (points >= 70) {
    return 'border-red-600'; // A deeper red for copper
  } else if (points >= 50) {
    return 'border-amber-700'; // A darker amber for the oak/copper mix
  } else {
    return 'border-gray-600'; // A medium gray for the oak/iron mix
  }
};

export const ContributorCard = ({ contributor, className }: ContributorCardProps) => {
  const points = contributor.frontendContributions + contributor.apiContributions;
  const backgroundColorClass = getBackgroundColor(points);
  const borderColor = getBorderColor(points);

  return (
    <Card
      className={cn(
        'bg-surface-1 overflow-hidden border transition-colors',
        backgroundColorClass,
        className
      )}
    >
      <CardContent className='flex items-center space-y-2 p-4 sm:flex-col'>
        <img
          loading='lazy'
          src={`https://avatars.githubusercontent.com/u/${contributor.id}?size=160`}
          alt={`${contributor.login}'s avatar`}
          className={cn('w-12 rounded-full border-2 shadow sm:w-auto', borderColor)}
        />
        <div className='flex flex-col space-y-1 pl-4 text-center shadow-lg sm:pl-0'>
          <a
            href={`https://github.com/${contributor.login}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-foreground m-2 text-center text-shadow-md hover:underline'
          >
            <h6>{contributor.login}</h6>
          </a>

          <div className='flex-center flex gap-4 space-y-1 text-sm'>
            {contributor.frontendContributions > 0 && (
              <div className='mx-2'>
                Frontend: <b>{contributor.frontendContributions}</b>
              </div>
            )}
            {contributor.apiContributions > 0 && (
              <div className='mx-2'>
                Backend: <b>{contributor.apiContributions}</b>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
