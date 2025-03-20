import { Lock, Monitor, User } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { useNavigate, useParams } from 'react-router';

import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const DisplaySettings = lazy(() => import('@/components/features/settings/DisplaySettings.tsx'));
const AccountSettings = lazy(() => import('@/components/features/settings/AccountSettings.tsx'));
const ProfileSettings = lazy(() => import('@/components/features/settings/ProfileSettings.tsx'));

const SettingsPage = () => {
  const { section = 'profile' } = useParams(); // Get the section from URL params
  const navigate = useNavigate();
  const { t } = useTranslation();

  const settingsSections = [
    {
      id: 'profile',
      label: t('navigation.userSettings.public'),
      icon: User,
      component: ProfileSettings,
    },
    {
      id: 'account',
      label: t('navigation.userSettings.account'),
      icon: Lock,
      component: AccountSettings,
    },
    {
      id: 'display',
      label: t('navigation.userSettings.display'),
      icon: Monitor,
      component: DisplaySettings,
    },
  ];

  const ActiveSection =
    settingsSections.find((s) => s.id === section)?.component || ProfileSettings;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6 md:flex-row'>
        {/* Sidebar Navigation */}
        <Card className='shrink-0 self-start md:w-64'>
          <div className='space-y-2 p-4'>
            <h2 className='mb-4 text-lg font-bold'>{t('settings.settings')}</h2>
            {settingsSections.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={section === id ? 'secondary' : 'ghost'}
                className='w-full justify-start gap-2'
                onClick={() => navigate(`/settings/${id}`)}
              >
                <Icon className='h-4 w-4' />
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Content Area */}
        <Card className='flex-1 p-6'>
          <Suspense fallback={<LoadingOverlay />}>
            <ActiveSection key={section} /> {/* Force re-render of the section */}
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
