import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { useFetchAllFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';
import { useCreateFeaturedAddon } from '@/api/endpoints/useFeaturedAddons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/useToast';
import type { AddonWithParsedFields } from '@/types';

interface GalleryImageItemProps {
  imageUrl: string;
  index: number;
  isSelected: boolean;
  onSelect: (url: string) => void;
}

function GalleryImageItem({ imageUrl, index, isSelected, onSelect }: GalleryImageItemProps) {
  const [isFullRes, setIsFullRes] = useState(true);
  const rawUrl = imageUrl.replace(/_\d+\.webp$/, '.webp');

  useEffect(() => {
    fetch(rawUrl, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          setIsFullRes(false);
          console.log(`[GalleryImageItem - ${index}] Full res check failed for: ${rawUrl}`);
        } else {
          console.log(`[GalleryImageItem - ${index}] Full res exists for: ${rawUrl}`);
        }
      })
      .catch(() => {
        setIsFullRes(false);
        console.log(`[GalleryImageItem - ${index}] Full res check error for: ${rawUrl}`);
      });
  }, [rawUrl]);

  return (
    <button
      onClick={() => {
        const selectedUrl = isFullRes ? rawUrl : imageUrl;
        console.log(`[GalleryImageItem - ${index}] Calling onSelect with: ${selectedUrl}`);
        onSelect(selectedUrl);
      }}
      className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-primary scale-105 shadow-md'
          : 'hover:border-primary/30 border-transparent'
      }`}
    >
      <img
        src={isFullRes ? rawUrl : imageUrl}
        alt={`Modrinth gallery image ${index + 1}`}
        className='h-full w-full object-cover'
        loading='lazy'
      />
      {!isFullRes && (
        <div className='absolute right-0 bottom-0 left-0 bg-black/50 p-1 text-xs text-white'>
          Lower resolution image
        </div>
      )}
    </button>
  );
}

export default function AutoAddFeaturedAddon() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddon, setSelectedAddon] = useState<AddonWithParsedFields | null>(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [imageSource, setImageSource] = useState<'gallery' | 'url'>('gallery');

  const { data: addons, isLoading: isLoadingAddons } = useSearchAddons({
    query: searchQuery,
    page: 1,
    limit: 10,
  });

  const { data: featuredAddons } = useFetchAllFeaturedAddons();
  const { mutate: createFeaturedAddon } = useCreateFeaturedAddon();

  // Get used display orders
  const usedDisplayOrders = featuredAddons?.map((addon) => addon.display_order) || [];
  const availableDisplayOrders = Array.from({ length: 21 }, (_, i) => i).filter(
    (order) => !usedDisplayOrders.includes(order)
  );

  // Handle addon selection
  const handleAddonSelect = (addon: AddonWithParsedFields) => {
    console.log('Selected addon:', addon);
    console.log('Modrinth raw:', addon.modrinth_raw);
    console.log('Modrinth raw parsed:', addon.modrinth_raw_parsed);
    console.log('Gallery data:', addon.modrinth_raw_parsed?.gallery);
    setSelectedAddon(addon);
    setSelectedBannerImage('');
  };

  // Handle image selection
  const handleBannerImageSelect = (imageUrl: string) => {
    setSelectedBannerImage(imageUrl);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedAddon) {
      toast({
        title: 'Error',
        description: 'Please select an addon',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedBannerImage) {
      toast({
        title: 'Error',
        description: 'Please select a banner image',
        variant: 'destructive',
      });
      return;
    }
    const newFeaturedAddon = {
      addon_id: selectedAddon.$id,
      title: selectedAddon.name,
      description: selectedAddon.description,
      image_url: selectedAddon.icon,
      banner_url: selectedBannerImage,
      display_order: displayOrder,
      slug: selectedAddon.slug,
      active: isActive,
      category: selectedAddon.categories || [],
    };

    createFeaturedAddon(newFeaturedAddon, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Featured addon created successfully',
        });
        setSelectedAddon(null);
        setSelectedBannerImage('');
        setDisplayOrder(0);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: 'Failed to create featured addon ' + error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Auto Add Featured Addon</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Addon Search */}
        <div className='space-y-2'>
          <Label>Search Addon</Label>
          <Input
            placeholder='Search addons...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoadingAddons ? (
            <div>Loading...</div>
          ) : (
            <div className='grid max-h-60 grid-cols-1 gap-2 overflow-y-auto'>
              {addons?.map((addon) => (
                <Button
                  key={addon.$id}
                  variant={selectedAddon?.$id === addon.$id ? 'default' : 'outline'}
                  className='justify-start'
                  onClick={() => handleAddonSelect(addon)}
                >
                  {addon.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Banner Image Selection */}
        {selectedAddon && (
          <div className='space-y-2'>
            <Label>Banner Image Source</Label>
            <Select
              value={imageSource}
              onValueChange={(value: 'gallery' | 'url') => setImageSource(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select image source' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gallery'>Choose from gallery</SelectItem>
                <SelectItem value='url'>Use URL</SelectItem>
              </SelectContent>
            </Select>

            {imageSource === 'gallery' && selectedAddon && (
              <div className='grid grid-cols-3 gap-2'>
                {(() => {
                  const modrinthData =
                    typeof selectedAddon.modrinth_raw_parsed === 'string'
                      ? JSON.parse(selectedAddon.modrinth_raw_parsed)
                      : selectedAddon.modrinth_raw_parsed;

                  const gallery = modrinthData?.gallery as string[] | undefined;
                  const hasModrinthImages = gallery && gallery.length > 0;

                  if (!hasModrinthImages) {
                    return (
                      <div className='text-muted-foreground col-span-3 py-4 text-center'>
                        No gallery images available for this addon
                      </div>
                    );
                  }

                  return gallery.map((imageUrl: string, index: number) => (
                    <GalleryImageItem
                      key={`mr-${index}`}
                      imageUrl={imageUrl}
                      index={index}
                      isSelected={
                        selectedBannerImage === imageUrl.replace(/_\d+\.webp$/, '.webp') ||
                        selectedBannerImage === imageUrl
                      }
                      onSelect={handleBannerImageSelect}
                    />
                  ));
                })()}
              </div>
            )}

            {imageSource === 'url' && (
              <Input
                placeholder='Enter banner image URL'
                value={selectedBannerImage}
                onChange={(e) => setSelectedBannerImage(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Display Order */}
        {selectedAddon && (
          <div className='space-y-2'>
            <Label>Display Order</Label>
            <Select
              value={displayOrder.toString()}
              onValueChange={(value) => setDisplayOrder(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select display order' />
              </SelectTrigger>
              <SelectContent>
                {availableDisplayOrders.map((order) => (
                  <SelectItem key={order} value={order.toString()}>
                    Position {order}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='text-muted-foreground text-sm'>
              Used positions: {usedDisplayOrders.join(', ')}
            </div>
          </div>
        )}

        {/* Active Toggle */}
        {selectedAddon && (
          <div className='flex items-center space-x-2'>
            <Switch id='active' checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor='active'>Active</Label>
          </div>
        )}

        {/* Submit Button */}
        {selectedAddon && (
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={!selectedBannerImage || !selectedAddon}
          >
            Create Featured Addon
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
