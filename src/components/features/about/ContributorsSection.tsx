import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContributorCard } from './ContributorCard';

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
          ? Array(8)
              .fill(0)
              .map((_, i) => <ContributorCard key={i} isLoading />)
          : contributors.map((contributor) => (
              <ContributorCard
                key={`${contributor.id}-${contributor.login}`}
                contributor={contributor}
              />
            ))}
      </div>
    </section>
  );
}
