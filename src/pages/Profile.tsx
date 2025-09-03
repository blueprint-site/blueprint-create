import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Layers, BarChart3, Trophy } from 'lucide-react';
import { useState } from 'react';
import { ProfileInfoTab } from '@/components/features/profile/ProfileInfoTab';
import { ProfileSchematicsTab } from '@/components/features/profile/ProfileSchematicsTab';
import { ProfileStatsTab } from '@/components/features/profile/ProfileStatsTab';
import { ProfileRewardsTab } from '@/components/features/profile/ProfileRewardsTab';

const Profile = () => {
  const [error] = useState<string | null>(null);

  if (error) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    );
  }

  return (
    <div className='bg-background'>
      <div className='container mx-auto pt-8 sm:px-6 lg:px-8'>
        {/* Tabbed Content */}
        <div>
          <Tabs defaultValue='info' className='w-full'>
            <TabsList className='grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4'>
              <TabsTrigger value='info' className='flex items-center gap-2'>
                <Info className='h-4 w-4' />
                <span className='hidden sm:inline'>Info</span>
              </TabsTrigger>
              <TabsTrigger value='schematics' className='flex items-center gap-2'>
                <Layers className='h-4 w-4' />
                <span className='hidden sm:inline'>Schematics</span>
              </TabsTrigger>
              <TabsTrigger value='stats' className='flex items-center gap-2'>
                <BarChart3 className='h-4 w-4' />
                <span className='hidden sm:inline'>Stats</span>
              </TabsTrigger>
              <TabsTrigger value='rewards' className='flex items-center gap-2'>
                <Trophy className='h-4 w-4' />
                <span className='hidden sm:inline'>Rewards</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='mt-6'>
              <ProfileInfoTab />
            </TabsContent>

            <TabsContent value='schematics' className='mt-6'>
              <ProfileSchematicsTab />
            </TabsContent>

            <TabsContent value='stats' className='mt-6'>
              <ProfileStatsTab />
            </TabsContent>

            <TabsContent value='rewards' className='mt-6'>
              <ProfileRewardsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div id='TOREMOVETHHEYSUCKS' className='h-50'></div>
    </div>
  );
};

export default Profile;
