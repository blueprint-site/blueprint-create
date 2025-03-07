import { ContactLink } from '@/components/features/about/ContactLink';
import { ContributorCard } from '@/components/features/about/ContributorCard';
import DevinsBadges from '@/components/utility/DevinsBadges';
import { ContributorStats, GitHubUser } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { DynamicBg } from '@/components/features/dynamic-bg';
export default function About() {
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();

    const fetchContributors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const getContributors = async (repo: string): Promise<GitHubUser[]> => {
          const response = await fetch(
            `https://api.github.com/repos/blueprint-site/${repo}/contributors?per_page=50`,
            { signal: controller.signal }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${repo} contributors`);
          }

          return response.json();
        };

        const [frontend, api] = await Promise.all([
          getContributors('blueprint-site.github.io'),
          getContributors('blueprint-api'),
        ]);

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
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors().then();
    return () => controller.abort();
  }, []);

  return (
    <>
      <div className='relative z-10 container mx-auto space-y-8 px-4 py-8'>
        <Card>
          <CardContent>
            <Card className={'h-40'}>
              <DynamicBg
                title={'About Blueprint'}
                subtitle={'Probably the best thing that has ever existed since crackers'}
              ></DynamicBg>
            </Card>
            <section className='space-y-6'>
              <div className='space-y-10'>
                <section aria-labelledby='mission'>
                  <h2 id='mission' className='font-minecraft text-2xl font-semibold'>
                    Our Mission
                  </h2>
                  <p className='text-foreground-muted font-minecraft'>
                    Blueprint is the central hub for Create Mod content, bringing together
                    community-made addons and player-designed schematics in one place.
                    <p></p>
                    <p>
                      Our <ContactLink href='/addons'>addons page</ContactLink> helps you discover
                      and manage the growing ecosystem of Create Mod extensions
                    </p>
                    <p>
                      While our <ContactLink href='/schematics'>schematics platform</ContactLink>{' '}
                      lets you explore, share, and showcase your automated contraptions and
                      engineering designs with fellow players.
                    </p>
                  </p>
                </section>

                <section aria-labelledby='contact'>
                  <h2 id='contact' className='text-2xl font-semibold'>
                    How to contact us?
                  </h2>

                  <div className='flex w-full flex-row items-center justify-evenly gap-4 space-y-6'>
                    <div className={'flex flex-col items-center gap-4'}>
                      <h3 className='font-minecraft text-xl font-semibold'>Discord</h3>
                      <DevinsBadges
                        type='compact'
                        category='social'
                        name='discord-plural'
                        format='svg'
                      />
                      <p className='text-foreground-muted font-minecraft'>
                        For updates, sneak peeks, and issue reporting.
                      </p>
                    </div>

                    <div className={'flex flex-col items-center gap-4'}>
                      <h3 className='font-minecraft text-xl font-semibold'>GitHub</h3>
                      <DevinsBadges
                        type='compact'
                        category='social'
                        name='github-plural'
                        format='svg'
                      />
                      <p className='text-foreground-muted font-minecraft'>
                        For the devs out there !
                      </p>
                    </div>

                    <div className={'flex flex-col items-center gap-4'}>
                      <h3 className='font-minecraft text-xl font-semibold'>Email</h3>
                      <DevinsBadges
                        type='compact'
                        category='custom'
                        name='my-custom-badge'
                        customBadgeUrl='/badges/chat-whit-us-by-email_vector.svg'
                        format='svg'
                      />
                      <p className='text-foreground font-minecraft'>
                        Contact us at{' '}
                        <ContactLink href='mailto:blueprint-site@proton.me'>
                          blueprint-site@proton.me
                        </ContactLink>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <section className='space-y-6' aria-labelledby='contributors'>
              <div className='font-minecraft space-y-2 text-center'>
                <h2 id='contributors' className='text-3xl font-bold'>
                  {t('home.contributions.title')}
                </h2>
                <p className='text-foreground-muted text-lg'>
                  {t('home.contributions.subtitle.main')}
                </p>
              </div>

              {error && (
                <div role='alert' className='text-destructive p-4 text-center'>
                  {error}
                </div>
              )}

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {isLoading ? (
                  Array(8)
                    .fill(0)
                    .map((_, i) => <ContributorCard key={i} isLoading />)
                ) : (
                  <>
                    {contributors.map((contributor) => (
                      <ContributorCard
                        key={`${contributor.id}-${contributor.login}`}
                        contributor={contributor}
                      />
                    ))}
                  </>
                )}
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
