import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import eyes from '@/assets/eyes/eye_squint.gif'; // This file needs to be copied from the addonverify branch
import axios from 'axios';
import { cn } from '@/config/utils';
import { useFetchAddon, useSaveAddon } from '@/api';
import { Addon } from '@/types';
import { Puzzle, RefreshCcw } from 'lucide-react';
import { useUserStore } from '@/api/stores/userStore';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';
import TimerProgress from '@/components/utility/TimerProgress';
import cronParser from 'cron-parser';

export default function AddonVerifyingPopup() {
  const [stage, setStage] = useState(0);
  const [platform, setPlatform] = useState<'modrinth' | 'curseforge' | null>(null);
  const [modrinthAuth, setModrinthAuth] = useState<string | null>(null); // Store it at top-level
  const [selectedAddonSlugs, setSelectedAddonSlugs] = useState<string[]>([]);

  const nextStage = () => setStage((prev) => Math.min(prev + 1, stages.length - 1));
  const prevStage = () => setStage((prev) => Math.max(prev - 1, 0));

  const stages = [
    {
      title: 'Select Platform',
      component: <StepOne selectPlatform={setPlatform} next={nextStage} />,
    },
    ...(platform === 'modrinth'
      ? [
          {
            title: 'Modrinth Verification',
            component: (
              <ModrinthStep
                next={nextStage}
                back={prevStage}
                setModrinthAuth={setModrinthAuth}
                modrinthAuth={modrinthAuth !== null ? modrinthAuth : ''}
              />
            ),
          },
          {
            title: 'Is this Your Profile',
            component: (
              <ModrinthProfile next={nextStage} back={prevStage} modrinthAuth={modrinthAuth} />
            ),
          },
          {
            title: 'Modrinth Validation',
            component: (
              <ModrinthValidation
                back={prevStage}
                next={nextStage}
                modrinthAuth={modrinthAuth}
                selectedAddonSlugs={selectedAddonSlugs}
                setSelectedAddonSlugs={setSelectedAddonSlugs}
              />
            ),
          },
          {
            title: 'Modrinth Confirmation',
            component: (
              <ConfirmationStep
                back={prevStage}
                next={nextStage}
                selectedAddonSlugs={selectedAddonSlugs}
              />
            ),
          },
          {
            title: 'Pushing changes',
            component: (
              <ModrinthPushChanges back={prevStage} selectedAddonSlugs={selectedAddonSlugs} />
            ),
          },
        ]
      : platform === 'curseforge'
        ? [
            {
              title: 'CurseForge Verification',
              component: <CurseForgeStep next={nextStage} back={prevStage} />,
            },
          ]
        : []),
  ];

  return (
    <>
      {/* UI Header */}
      <div className='flex flex-col items-center space-x-0 md:flex-row md:items-start md:space-x-4'>
        <Puzzle />
        <h2 className='inline-flex text-2xl font-bold'>Addon Verifying</h2>
        <Badge variant='outline' className='mt-1 md:mt-0'>
          Beta
        </Badge>
      </div>
      <h3>Hey modder! </h3>
      <h4>Do you want your addon to be verified?</h4>
      <h4>
        Verifying your addon gives you:
        <ul className='list-inside list-disc'>
          <li>A cool badge</li>
          <li>Verified Addon Maker role in Discord</li>
          <li>Allows users to see your addon in your Blueprint profile</li>
          <li>+10 points to your ego</li>
        </ul>
      </h4>
      <br />

      {/* Dialog and UI */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Verify my addon</Button>
        </DialogTrigger>
        <DialogContent className='w-[400px] p-6'>
          <DialogHeader>
            <DialogTitle>{stages[stage].title}</DialogTitle>
          </DialogHeader>

          {/* Animated Content */}
          <div className='relative h-120 overflow-hidden'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={stage}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='absolute w-full'
              >
                {stages[stage]?.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// -------------------- Step 1: Select Platform --------------------
function StepOne({
  selectPlatform,
  next,
}: {
  selectPlatform: (platform: 'modrinth' | 'curseforge') => void;
  next: () => void;
}) {
  return (
    <div className='flex flex-col gap-3'>
      <h1>What platform?</h1>
      <h4>Choose where is your addon published</h4>
      <Button
        className='h-40 rounded-2xl bg-green-500'
        onClick={() => {
          selectPlatform('modrinth');
          next();
        }}
      >
        Modrinth
      </Button>
      <Button
        className='h-40 rounded-2xl bg-orange-500'
        onClick={() => {
          selectPlatform('curseforge');
          next();
        }}
      >
        CurseForge
      </Button>
    </div>
  );
}
// -------------------- Step 2: Modrinth Verification --------------------
function ModrinthStep({
  next,
  back,
  setModrinthAuth,
  modrinthAuth,
}: {
  next: () => void;
  back: () => void;
  setModrinthAuth: (auth: string) => void;
  modrinthAuth: string;
}) {
  // To remove mrp_WkMF1b6NBLhVltEySGMCFzHZTIKvC0r6QdNJKjAUoVaNqKuh8mZrLBlRvd6R
  return (
    <div className='flex flex-col gap-3'>
      <h2>Modrinth Verification</h2>
      <img src={eyes} className='w-20' />
      <h4>
        How to get your Modrinth PAT Token: <a href='/blog/howto-modrinth-pat'>Read our blogpost</a>
      </h4>
      <p>Enter your Modrinth PAT Token:</p>
      <input
        type='text'
        className='w-full border p-2'
        placeholder='Your Modrinth API Key'
        onChange={(e) => setModrinthAuth(e.target.value)} // Store API key globally
      />
      {modrinthAuth.length !== 64 && (
        <p className='text-red-500'>* PAT Token should be 64 characters long</p>
      )}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button
          className={cn(
            modrinthAuth.length === 64
              ? 'bg-primary text-primary-foreground'
              : 'text-red-foreground bg-red-500',
            'px-4 py-2'
          )}
          onClick={next}
          disabled={modrinthAuth.length !== 64}
        >
          {modrinthAuth.length === 64 ? 'Next' : 'Invalid Key'}
        </Button>
      </div>
    </div>
  );
}

// -------------------- Step 3: Modrinth Profile confirmation --------------
function ModrinthProfile({
  next,
  back,
  modrinthAuth,
}: {
  next: () => void;
  back: () => void;
  modrinthAuth: string | null;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modrinthAuth) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const response = await axios.get('https://api.modrinth.com/v2/user', {
          headers: { Authorization: modrinthAuth },
        });

        if (!response.data || !response.data.username) {
          throw new Error('Invalid response from Modrinth API');
        }

        if (response.status !== 200) {
          console.error(
            'Unexpected error: ',
            response.data?.error || response.data?.message || 'Unknown error'
          );
        }

        setUsername(response.data.username);
        setAvatar(response.data.avatar_url);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [modrinthAuth]);

  return (
    <div className='flex flex-col items-center gap-3'>
      <h2 className='text-xl font-bold'>Modrinth Profile Confirmation</h2>

      {loading ? (
        <p>Loading your profile...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : username ? (
        <div className='flex flex-col items-center'>
          {avatar && <img src={avatar} alt='Profile' className='h-20 w-20 rounded-full' />}
          <p className='mt-2 text-lg'>
            Found your profile: <b>@{username}</b>
          </p>
        </div>
      ) : (
        <p className='text-gray-500'>
          Could not retrieve your Modrinth profile. Double-check your API key.
        </p>
      )}

      <div className='mt-4 flex w-full justify-between'>
        <Button variant='outline' onClick={back}>
          Nope, Back
        </Button>
        <Button onClick={next} disabled={!username}>
          Yes, It's me
        </Button>
      </div>
    </div>
  );
}

// -------------------- Step 4: Modrinth addons validation -----------------
interface AddonFetcherProps {
  slug: string;
  onAddonFetched: (addon: Addon) => void;
}
// A separate component that uses the useFetchAddon hook
function AddonFetcher({ slug, onAddonFetched }: AddonFetcherProps) {
  // Call useFetchAddon at the component level where it's allowed
  const { data: addon } = useFetchAddon(slug);

  useEffect(() => {
    if (addon) {
      // Pass the fetched addon back to the parent
      onAddonFetched(addon);
      console.log('Found addon:', addon);
    } else {
      console.log('No addon found for:', slug);
    }
  }, [addon, slug, onAddonFetched]);

  // This component doesn't render anything
  return null;
}

function ModrinthValidation({
  next,
  back,
  modrinthAuth,
  selectedAddonSlugs,
  setSelectedAddonSlugs,
}: {
  next: () => void;
  back: () => void;
  modrinthAuth: string | null;
  selectedAddonSlugs: string[];
  setSelectedAddonSlugs: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [modrinthProjects, setModrinthProjects] = useState<{ slug: string }[]>([]);
  const [fetchedAddons, setFetchedAddons] = useState<Addon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [projectsLoaded, setProjectsLoaded] = useState<boolean>(false);
  // Add state for selected addons

  // First useEffect to fetch Modrinth projects
  useEffect(() => {
    if (!modrinthAuth) return;

    const fetchModrinthProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const userResponse = await axios.get<{ id: string }>('https://api.modrinth.com/v2/user', {
          headers: { Authorization: modrinthAuth },
        });

        if (!userResponse.data.id) throw new Error('User ID not found.');

        const projectsResponse = await axios.get<{ slug: string }[]>(
          `https://api.modrinth.com/v2/user/${userResponse.data.id}/projects`
        );

        setModrinthProjects(projectsResponse.data);
        console.log('Fetched projects:', projectsResponse.data);
        setProjectsLoaded(true);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Modrinth API error:', err.response?.data || err.message);
          setError(err.response?.data?.message || 'Failed to fetch Modrinth projects');
        } else {
          console.error('Unexpected error:', err);
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModrinthProjects();
  }, [modrinthAuth]);

  // Callback function for when an addon is fetched
  const handleAddonFetched = useCallback((addon: Addon) => {
    setFetchedAddons((prev) => {
      // Avoid duplicates
      if (prev.some((a) => a.slug === addon.slug)) {
        return prev;
      }
      return [...prev, addon];
    });

    // Auto-select newly fetched addons
    setSelectedAddonSlugs((prev) => {
      if (prev.includes(addon.slug)) {
        return prev;
      }
      return [...prev, addon.slug];
    });
  }, []);

  // Handler for checkbox changes
  const handleCheckboxChange = (slug: string, checked: boolean) => {
    setSelectedAddonSlugs((prev) => {
      if (checked) {
        // Add the slug if checked
        return [...prev, slug];
      } else {
        // Remove the slug if unchecked
        return prev.filter((s) => s !== slug);
      }
    });
    console.log(
      'Selected addons updated:',
      checked ? [...selectedAddonSlugs, slug] : selectedAddonSlugs.filter((s) => s !== slug)
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-xl font-bold'>Modrinth Validation</h2>

      {/* Render AddonFetcher components for each project */}
      {projectsLoaded &&
        modrinthProjects.map((project) => (
          <AddonFetcher
            key={project.slug}
            slug={project.slug}
            onAddonFetched={handleAddonFetched}
          />
        ))}

      {loading && modrinthProjects.length === 0 ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : fetchedAddons.length === 0 ? (
        <p>No addons found. {projectsLoaded ? 'Searching for addons...' : 'Loading projects...'}</p>
      ) : (
        <div>
          <h3 className='font-semibold'>Found Projects:</h3>
          <p className='mb-2 text-sm text-gray-500'>Select the addons you want to include</p>
          <ul className='mt-2 space-y-2'>
            {fetchedAddons.map((addon) => (
              <li key={addon.slug} className='flex items-center rounded border p-2'>
                <input
                  type='checkbox'
                  id={`addon-${addon.slug}`}
                  checked={selectedAddonSlugs.includes(addon.slug)}
                  onChange={(e) => handleCheckboxChange(addon.slug, e.target.checked)}
                  className='mr-2 h-4 w-4'
                />
                {addon.icon && (
                  <img src={addon.icon} alt={`${addon.name} icon`} className='mr-3 h-10 w-10' />
                )}
                <label htmlFor={`addon-${addon.slug}`} className='font-medium'>
                  {addon.name}
                </label>
              </li>
            ))}
          </ul>

          <div className='mt-3'>
            <p className='text-sm'>
              Selected addons: <span className='font-medium'>{selectedAddonSlugs.length}</span>
            </p>
          </div>
        </div>
      )}

      <div className='mt-5 flex justify-between'>
        <Button onClick={back}>Back</Button>
        <Button
          onClick={() => {
            console.log('Selected addon slugs:', selectedAddonSlugs);
            next();
          }}
          disabled={loading && fetchedAddons.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// -------------------- Step 2: CurseForge Verification --------------------
function CurseForgeStep({ back }: { next: () => void; back: () => void }) {
  return (
    <div className='flex flex-col gap-3'>
      <h2>Uh oh!</h2>
      <h4>Sorry, CurseForge verification isn't implemented yet</h4>
      <h5>
        Temporary fixes:
        <ul className='list-inside list-disc'>
          <li>
            Get verified manually on our <a href='https://discord.gg/AvAWFU5rhB'>Discord</a>
          </li>
          <li>
            Publish your addon on <a href='https://modrinth.com/'>Modrinth</a>
          </li>
          <li>
            <a href='emailto:contact@blueprint-create.com'>Email us</a> to verify. We need
            legitimate proof of you creating the addon
          </li>
        </ul>
      </h5>
      <div className='mt-5 flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
      </div>
    </div>
  );
}

// ---------------------------- Step  5: Confirmation --------------------------------
function ConfirmationStep({
  back,
  next,
  selectedAddonSlugs,
}: {
  back: () => void;
  next: () => void;
  selectedAddonSlugs: string[];
}) {
  return (
    <div className='flex flex-col gap-3'>
      <h2>Review and Confirm</h2>
      <p>Make sure your details are correct before submitting.</p>
      <h3>What happens next?</h3>
      <p>We show that u made the addon 100%</p>
      <p style={{ marginTop: '-1.25rem', fontSize: '0.8rem' }} className='text-s'>
        Your user id gets added to addon data
      </p>
      <h3 className='font-semibold'>Selected Addons:</h3>
      <div className='max-h-[15rem] overflow-y-auto'>
        <ul className='list-inside list-disc'>
          {selectedAddonSlugs.map((slug) => (
            <li key={slug}>{slug}</li>
          ))}
        </ul>
      </div>
      <div className='flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button onClick={next}>Submit</Button>
      </div>
    </div>
  );
}

// ------------------------ Step 6: Pushing changes to API ------------------------

function ModrinthPushChanges({
  back,
  selectedAddonSlugs,
}: {
  back: () => void;
  selectedAddonSlugs: string[];
}) {
  const saveAddon = useSaveAddon();
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [processedAddons, setProcessedAddons] = useState<string[]>([]);

  const handleAddonFetched = (addon: Addon) => {
    console.log('Addon fetched in parent:', addon);
    setIsLoading(false);
    handleClaim(addon);
  };

  const handleClaim = (addon: Addon) => {
    saveAddon.mutate({
      ...addon,
      claimed_by: user?.$id, // Updating the claimed_by field
    });
    setProcessedAddons((prev) => [...prev, addon.slug]);
  };

  const getNextCronDate = (cronExpression: string) => {
    const interval = cronParser.parse(cronExpression);
    const nextExecution = interval.next(); // Get next execution time as a Date object
    return nextExecution; // Return as Date object
  };

  // Example usage
  const cronExpression = '0 * * * *'; // Every hour at the top of the hour
  const nextExecutionDate = getNextCronDate(cronExpression);
  const countdownTime = (nextExecutionDate.getTime() - Date.now()) / 1000;
  const roundedCountdownTime = Math.round(countdownTime);

  return (
    <div className='flex flex-col gap-3'>
      <h2>Syncing your changes with our API</h2>

      {/* Render AddonFetcher components for each addon slug that hasn't been processed yet */}
      {selectedAddonSlugs.map((slug) =>
        !processedAddons.includes(slug) ? (
          <AddonFetcher key={slug} slug={slug} onAddonFetched={handleAddonFetched} />
        ) : null
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <p className='text-sm'>
          All done! You can safely close this window. Your addon will be on in:
        </p>
      )}
      <TimerProgress
        startTimestamp={Date.now()}
        countdownTime={roundedCountdownTime}
        description='Syncing happens exactly at this time:'
        icon={<RefreshCcw size={18} />}
      />
      <h3>Frequently asked questions</h3>
      <p>When will it show up? It takes one hour to sync the addons</p>
      <p>Do i get the +10 ego boost? Yes</p>
      <p>What to do to undo?: Contact us</p>
      <div className='flex justify-between'>
        <Button variant='outline' onClick={back} disabled={true}>
          There is no going back
        </Button>
        <Button variant='success'>Press X to close</Button>
      </div>
    </div>
  );
}
