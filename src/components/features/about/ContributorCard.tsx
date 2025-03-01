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
const getBackgroundColor = (points: number): string => {
  if (points >= 90) {
    return 'bg-brass_casing ';
  } else if (points >= 70) {
    return 'bg-copper_casing';
  } else if (points >= 50) {
    return 'bg-dark_oak_planks-copper_block ';
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
  const points = contributor.frontendContributions + contributor.apiContributions
  const backgroundColorClass = getBackgroundColor(points);
  const borderColor = getBorderColor(points);
  return (
    <Card className={`bg-surface-1 border bg-dark_oak_planks-iron_block  overflow-hidden transition-colors ${backgroundColorClass} `}>
      <CardContent className='flex items-center space-y-2 p-4 sm:flex-col'>
        <img
          loading='lazy'
          src={`https://avatars.githubusercontent.com/u/${contributor.id}?size=160`}
          alt={`${contributor.login}'s profile picture`}
          className={`w-12 rounded-full sm:w-auto shadow border-2 ${borderColor} `}
        />
        <div className={`flex flex-col space-y-1 pl-4 sm:pl-0 text-center shadow-lg`}>
          <a
            href={`https://github.com/${contributor.login}`}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline text-center mx-2 text-foreground text-shadow-md'
          >
            <h3> {contributor.login} </h3>
          </a>

          <div className={`space-y-1 flex flex-center  gap-4 text-sm `}>
            {contributor.frontendContributions > 0 && (
              <div className={"mx-2"}> Frontend : <b> {contributor.frontendContributions} </b> </div>
            )}
            {contributor.apiContributions > 0 && <div className={"mx-2"}> Backend : <b> {contributor.apiContributions} </b> </div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
