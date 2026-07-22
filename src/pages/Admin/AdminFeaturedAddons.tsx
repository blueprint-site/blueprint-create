import {
  addFeaturedAddon,
  deleteFeaturedAddon,
  useFetchAddonBySlug,
  useGetFeaturedAddons,
} from '@/utils/useAddons';
import AdminBackButton from './AdminBackButton';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { toast } from 'sonner';
export default function AdminFeaturedAddons() {
  const { data: addons = [], refetch } = useGetFeaturedAddons();
  const [searchSlug, setSearchSlug] = useState('');
  const [debouncedSlug, setDebouncedSlug] = useState('');
  const { data: addonResult } = useFetchAddonBySlug(debouncedSlug);
  const [chosenDisplayOrder, setChosenDisplayOrder] = useState(0);
  const [chosenBanner, setChosenBanner] = useState('https://placehold.co/400x300');

  async function destroy(addonId: string) {
    await deleteFeaturedAddon(addonId);
    refetch();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(searchSlug);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchSlug]);
  function submitAddon() {
    addFeaturedAddon({
      active: true,
      display_order: chosenDisplayOrder,
      banner_url: chosenBanner,
      addon_id: addonResult?.slug || '',
      title: addonResult?.name || '',
      description: addonResult?.description || '',
      image_url: addonResult?.icon || '',
      slug: addonResult?.slug || '',
    })
      .then(() => {
        toast.success('Uploaded addon');
        refetch();
      })
      .catch((error) => {
        toast.error(`Failed to upload: ${error.message}`);
      });
  }
  return (
    <div className='p-4 flex flex-col'>
      <AdminBackButton />
      <span className='font-minecraft text-3xl font-bold mb-2'>Featured addons management</span>
      {addons?.length == 0 && (
        <div className=''>
          <span>No addons found</span>
        </div>
      )}
      <div className='flex flex-col gap-2 relative'>
        {addons
          ?.sort((a, b) => a.display_order - b.display_order)
          .map((addon) => (
            <div
              style={{
                backgroundImage: `url(${addon.banner_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className='p-4 bg-surface-1 max-w-150  relative'
              key={addon.$id}
            >
              <div className='absolute inset-0 bg-black/30'></div>
              <div className='relative z-10 flex flex-col text-white'>
                <img src={addon.image_url} className='w-25' />
                <span className='mt-1 font-minecraft text-xl'>{addon.title}</span>
                <span>{addon.description}</span>
                <span className='opacity-80'>Record_id {addon.$id}</span>
                <span className='opacity-80'>Record_id {addon.active ? 'active' : 'disabled'}</span>
                <div className='ml-auto flex items-center gap-4'>
                  <span className='text-5xl '>{addon.display_order}</span>
                  <Button variant={'destructive'} onClick={() => destroy(addon.$id)}>
                    delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className='mt-5'>
        <span className='text-xl font-minecraft'>Add new featured addon</span>
        <div className='flex gap-2'>
          <div className='flex flex-col w-1/2'>
            <span className='text-sm font-minecraft'>Search to fill out gaps</span>
            <Input
              placeholder='Pull info from slug'
              className='w-full'
              value={searchSlug}
              onChange={(e) => setSearchSlug(e.target.value)}
            />
          </div>
          <div className='ml-auto w-1/2'>
            {addonResult && (
              <div className='flex flex-col w-full'>
                <span className='text-sm font-minecraft'>Compile your entry</span>
                <div className='flex flex-col gap-2'>
                  <img src={addonResult.icon} className='w-50' />
                  <span>
                    Name:
                    <Input disabled placeholder='Name' className='mt-1' value={addonResult.name} />
                  </span>
                  <span>
                    Description:
                    <Input
                      disabled
                      placeholder='Description'
                      className='mt-1'
                      value={addonResult.description}
                    />
                  </span>
                  <span>
                    Slug:
                    <Input disabled placeholder='slug' className='mt-1' value={addonResult.slug} />
                  </span>
                  <span>
                    Sources:
                    <Input
                      disabled
                      placeholder='Sources'
                      className='mt-1'
                      value={addonResult.sources.join(', ')}
                    />
                  </span>
                  <span>
                    Display order:
                    <Input
                      placeholder='Display order'
                      type='number'
                      value={chosenDisplayOrder}
                      onChange={(e) => setChosenDisplayOrder(Number(e.target.value))}
                      className='mt-1'
                    />
                  </span>
                  <span>
                    Banner:
                    <img
                      src={chosenBanner ? chosenBanner : 'https://http.cat/404'}
                      className='aspect-video'
                    />
                    <Input
                      placeholder='Display order'
                      value={chosenBanner}
                      onChange={(e) => setChosenBanner(e.target.value)}
                      className='mt-1'
                    />
                  </span>
                </div>
                <Button className='mt-5' onClick={submitAddon}>
                  SUBMIT
                </Button>
              </div>
            )}
            {!addonResult && (
              <div className='opacity-50 font-minecraft text-sm'>
                <span>Start typing in search to find addon data...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
