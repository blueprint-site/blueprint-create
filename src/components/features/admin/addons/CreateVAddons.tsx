import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import SupportedAddons from './CreateVComponents/SupportedAddons';
import ModifyVersions from './CreateVComponents/ModifyVersions';
import ModifyCreateData from './CreateVComponents/ModifyCreateData';

export default function CreateVAddons() {
  const [view, setView] = useState<'supported' | 'versions' | 'createData'>('supported');
  return (
    <div className='ml-7'>
      <h2>Validating Create Compatibility</h2>
      <span className='opacity-70'>
        Addons that are known to support said Create Mod versions and modifying them
      </span>
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'supported' | 'versions' | 'createData')}
        className='w-full'
        defaultValue='supported'
      >
        <br />
        <div className='mb-4 flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='supported'>Supported addons</TabsTrigger>
            <TabsTrigger value='versions'>Modify Versions</TabsTrigger>
            <TabsTrigger value='createData'>Modify Create Data</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='supported'>
          <SupportedAddons />
        </TabsContent>
        <TabsContent value='versions'>
          <ModifyVersions />
        </TabsContent>
        <TabsContent value='createData'>
          <ModifyCreateData />
        </TabsContent>
      </Tabs>
    </div>
  );
}
