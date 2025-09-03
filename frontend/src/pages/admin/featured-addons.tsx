import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeaturedAddonsList from '@/components/features/admin/addons/FeaturedAddonsList';
import { AddFeaturedAddon } from '@/components/features/admin/addons/AddFeaturedAddon';
import AutoAddFeaturedAddon from '@/components/features/admin/addons/AutoAddFeaturedAddon';

export default function FeaturedAddonsAdmin() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Featured Addons Management</h1>

      <Tabs defaultValue='auto-add' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='auto-add'>Auto Add</TabsTrigger>
          <TabsTrigger value='manual-add'>Manual Add</TabsTrigger>
          <TabsTrigger value='manage'>Manage</TabsTrigger>
        </TabsList>

        <TabsContent value='auto-add'>
          <AutoAddFeaturedAddon />
        </TabsContent>

        <TabsContent value='manual-add'>
          <AddFeaturedAddon />
        </TabsContent>

        <TabsContent value='manage'>
          <FeaturedAddonsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
