import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';
import { ModrinthValidationProps } from '../types';
import { useModrinthProfile, useModrinthProjects } from '@/api/endpoints/useModrinth';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ModrinthValidationStep({
  next,
  back,
  modrinthToken,
  selectedAddonSlugs,
  setSelectedAddonSlugs,
}: Readonly<ModrinthValidationProps>) {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useModrinthProfile(modrinthToken);

  const {
    data: fetchedAddons,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useModrinthProjects(profileData?.id ?? null);

  const handleCheckboxChange = (slug: string, checked: boolean) => {
    setSelectedAddonSlugs((prev) => (checked ? [...prev, slug] : prev.filter((s) => s !== slug)));
  };

  const isLoading = isLoadingProfile || isLoadingProjects;
  const hasError = profileError || projectsError;

  const renderAddonList = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <LoadingSpinner className='h-10 w-10' />
          <div className='space-y-1 text-center'>
            <p className='text-muted-foreground text-sm'>
              {isLoadingProfile ? 'Loading your profile...' : 'Loading your projects...'}
            </p>
            <p className='text-muted-foreground text-xs'>
              This may take a moment depending on the number of projects
            </p>
          </div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <p className='text-sm text-red-500'>
            {profileError ? 'Failed to load profile' : 'Failed to load projects'}
          </p>
          <p className='text-muted-foreground text-xs'>Please check your API key and try again</p>
        </div>
      );
    }

    if (fetchedAddons?.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <p className='text-sm'>
            No addons found in our system that match your Modrinth projects.
          </p>
          <p className='text-muted-foreground text-sm'>
            Make sure your addons are published on Blueprint.
          </p>
        </div>
      );
    }

    return (
      <div className='mt-2 space-y-2'>
        <p className='text-sm font-medium'>Found Addons:</p>
        <div className='max-h-48 space-y-2 overflow-y-auto'>
          {fetchedAddons?.map((addon) => (
            <div key={addon.slug} className='flex items-center space-x-3 rounded-md border p-2'>
              <Checkbox
                id={`addon-${addon.slug}`}
                checked={selectedAddonSlugs.includes(addon.slug)}
                onCheckedChange={(checked) => handleCheckboxChange(addon.slug, checked === true)}
              />
              {addon.icon_url && (
                <img src={addon.icon_url} alt={addon.title} className='h-8 w-8 rounded' />
              )}
              <label
                htmlFor={`addon-${addon.slug}`}
                className='flex-1 cursor-pointer text-sm font-medium'
              >
                {addon.title}
              </label>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground text-xs'>
          Selected: {selectedAddonSlugs.length} of {fetchedAddons?.length ?? 0}
        </p>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-4'>
      <DialogHeader>
        <DialogTitle>Select Addons</DialogTitle>
        <DialogDescription>Select the addons you want to verify.</DialogDescription>
      </DialogHeader>

      {renderAddonList()}

      <DialogFooter>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button onClick={next} disabled={isLoading || selectedAddonSlugs.length === 0}>
          Next
        </Button>
      </DialogFooter>
    </div>
  );
}
