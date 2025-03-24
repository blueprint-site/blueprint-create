import { Check, CheckCircle, UserCog, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/api/stores/userStore.ts';
import { OAuthProviders } from '@/data/OAuthProviders.ts';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.tsx';
import { Models } from 'appwrite';
import OAuthProvidersDisplay from '@/components/utility/OAuthProvidersDisplay.tsx';
import ClientDisplay from '@/components/utility/ClientDisplay.tsx';
import { Button } from '@/components/ui/button.tsx';
import LanguageSwitcher from '@/components/features/settings/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';

export default function AccountSettings() {
  const user = useUserStore((state) => state.user);
  const getProviders = useUserStore((state) => state.getProviders);
  const getSessions = useUserStore((state) => state.getUserSessions);
  const getAllUserData = useUserStore((state) => state.getAllUserData);

  const [userProviders, setUserProviders] = useState<string[]>([]);
  const [userSessions, setUserSession] = useState<Models.Session[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      const providers = await getProviders();
      const sessions = await getSessions();
      setUserProviders(providers);
      setUserSession(sessions);
    };
    fetchUserData();
  }, [getProviders, getSessions]);

  return (
    <div>
      <h2 className='text-2xl font-bold'>{t('settings.user-settings.account.title')}</h2>
      <h3 className='text-xl font-bold'>{user?.name}</h3>
      <section className={'space-y-4'}>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>
            {t('settings.user-settings.account.language.title')}
          </div>
        </div>
        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.account.language.description')}
        </p>
        <LanguageSwitcher direction={'down'} />
      </section>

      <section className={'space-y-4'}>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>
            {t('settings.user-settings.account.data.title')}
          </div>
        </div>
        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.account.data.description')}
        </p>
        <Button className={'cursor-pointer'} onClick={() => getAllUserData(user?.$id || '')}>
          {t('settings.user-settings.account.data.button')}
        </Button>
      </section>

      {/* Providers Section */}
      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>
            {t('settings.user-settings.account.auth.title')}
          </div>
        </div>
        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.account.auth.description')}
        </p>
        <div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {OAuthProviders.map((provider) => (
              <Card
                key={provider.id}
                style={{ borderColor: provider.color }}
                className='cursor-pointer border-2 p-4'
              >
                <div className={'relative float-end'}>
                  {userProviders.includes(provider.id) ? (
                    <Check color={'green'}></Check>
                  ) : (
                    <X color={'red'} />
                  )}
                </div>
                <CardHeader className='flex items-center gap-2'>
                  <OAuthProvidersDisplay provider={provider.icon} size={32}></OAuthProvidersDisplay>
                  <span className='text-lg font-semibold'>{provider.name}</span>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Session Section */}
      <section className={'space-y-4'}>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>
            {t('settings.user-settings.account.sessions.title')}
          </div>
        </div>
        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.account.sessions.description')}
        </p>
        <div>
          {userSessions.map((session, index) => (
            <Card className={'bg-surface-1 mt-2 border'} key={index}>
              <CardHeader className={'flex flex-row gap-2'}>
                <OAuthProvidersDisplay
                  provider={session.provider}
                  size={32}
                ></OAuthProvidersDisplay>
                <div>{session.$id}</div>
              </CardHeader>
              <CardContent>
                <ClientDisplay clientName={session.clientName}></ClientDisplay>
                <div className={'relative float-end'}>
                  {session.current ? (
                    <div className={'flex gap-2'}>
                      {t('settings.user-settings.account.sessions.actual')}{' '}
                      <CheckCircle color={'green'}></CheckCircle>{' '}
                    </div>
                  ) : null}
                </div>
                <div className={'flex items-center gap-4'}>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span>{t('settings.user-settings.account.sessions.device')} :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceModel ||
                          t('settings.user-settings.account.sessions.not-provided')}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>{t('settings.user-settings.account.sessions.brand')} :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceBrand ||
                          t('settings.user-settings.account.sessions.not-provided')}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>{t('settings.user-settings.account.sessions.name')} :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceName ||
                          t('settings.user-settings.account.sessions.not-provided')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className={''}>
                  <div className='flex gap-2'>
                    <span>{t('settings.user-settings.account.sessions.created_at')} :</span>
                    <div className='text-foreground-muted'>
                      {new Date(session.$createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      }) || 'Not provided'}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <span>{t('settings.user-settings.account.sessions.expire')} :</span>
                    <div className='text-foreground-muted'>
                      {new Date(session.expire).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      }) || 'Not provided'}
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
