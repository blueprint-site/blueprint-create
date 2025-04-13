import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AddonsTable, FeaturedAddonsTable } from '@/components/features/admin/addons';

export const AdminAddonsMain = () => {
  return (
    <Tabs defaultValue='addons' className='p-6'>
      <TabsList>
        <TabsTrigger className={'cursor-pointer'} value='addons'>
          All Addons
        </TabsTrigger>
        <TabsTrigger className={'cursor-pointer'} value='featured'>
          Featured
        </TabsTrigger>
      </TabsList>
      <TabsContent value='addons'>
        <AddonsTable />
      </TabsContent>
      <TabsContent value='featured'>
        <FeaturedAddonsTable />
      </TabsContent>
    </Tabs>
  );
};
