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

export default function AccountSettings() {
  const user = useUserStore((state) => state.user);
  const getProviders = useUserStore((state) => state.getProviders);
  const getSessions = useUserStore((state) => state.getUserSessions);
  const getAllUserData = useUserStore((state) => state.getAllUserData);

  const [userProviders, setUserProviders] = useState<string[]>([]);
  const [userSessions, setUserSession] = useState<Models.Session[]>([]);

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
      <h2 className='text-2xl font-bold'>Account security</h2>
      <h3 className='text-xl font-bold'>{user?.name}</h3>
      <section className={'space-y-4'}>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>Account Language</div>
        </div>
        <p className='text-foreground-muted text-sm'>Change the language of your app </p>
        <LanguageSwitcher direction={'down'} />
      </section>

      <section className={'space-y-4'}>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>Account Data</div>
        </div>
        <p className='text-foreground-muted text-sm'>Retrieve all your data !</p>
        <Button className={'cursor-pointer'} onClick={() => getAllUserData(user?.$id || '')}>
          Get My Data
        </Button>
      </section>

      {/* Providers Section */}
      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>Manage authentication providers</div>
        </div>
        <p className='text-foreground-muted text-sm'>
          Add or remove sign-on methods from your account, including GitHub, GitLab, Microsoft,
          Discord, Steam, and Google.
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
          <div className='text-lg font-semibold'>Manage Sessions</div>
        </div>
        <p className='text-foreground-muted text-sm'>See your session trough all your device !</p>
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
                      Actual <CheckCircle color={'green'}></CheckCircle>{' '}
                    </div>
                  ) : null}
                </div>
                <div className={'flex items-center gap-4'}>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span>Device :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceModel || 'Not provided'}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>Brand :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceBrand || 'Not provided'}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>Name :</span>
                      <div className='text-foreground-muted'>
                        {session.deviceName || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className={''}>
                  <div className='flex gap-2'>
                    <span>Created at :</span>
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
                    <span>Expire :</span>
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
