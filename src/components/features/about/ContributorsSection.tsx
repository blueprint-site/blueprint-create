import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContributorCard } from './ContributorCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ContributorStats {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
}

interface ContributorsSectionProps {
  contributors: ContributorStats[];
  isLoading: boolean;
  error: string | null;
}

// Simple contributor skeleton component
function ContributorSkeleton() {
  return (
    <Card className='bg-surface-1 overflow-hidden'>
      <CardContent className='flex items-center space-y-2 p-4 sm:flex-col'>
        <Skeleton className='h-12 w-12 rounded-full sm:h-24 sm:w-24' />
        <div className='flex w-full flex-col space-y-3 pl-4 sm:mt-4 sm:items-center sm:pl-0'>
          <Skeleton className='h-5 w-24 sm:w-32' />
          <div className='flex gap-2 sm:gap-4'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContributorsSection({
  contributors,
  isLoading,
  error,
}: Readonly<ContributorsSectionProps>) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby='contributors'>
      <div className='font-minecraft mb-6 space-y-2 text-center'>
        <h2 id='contributors' className='text-3xl font-bold'>
          {t('about.contributions.title')}
        </h2>
        <p className='text-foreground-muted text-lg'>{t('about.contributions.subtitle.main')}</p>
      </div>

      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <ContributorSkeleton key={`skeleton-${i}`} />)
          : contributors.map((contributor) => (
              <ContributorCard
                key={`${contributor.id}-${contributor.login}`}
                contributor={contributor}
              />
            ))}
      </div>

      {/* Empty state when no contributors are found */}
      {!isLoading && !error && contributors.length === 0 && (
        <div className='py-10 text-center'>
          <p className='text-muted-foreground'>{t('about.contributions.noContributors')}</p>
        </div>
      )}
    </section>
  );
}
