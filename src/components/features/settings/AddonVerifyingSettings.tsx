import { useEffect, useMemo, useState } from 'react';
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
import eyes from '@/assets/eyes/eye_squint.gif';
import axios from 'axios';
import { cn } from '@/config/utils';
import { useFetchAddons } from '@/api';
import { Addon } from '@/types';
import { Puzzle } from 'lucide-react';

export default function AddonVerifyingPopup() {
  const [stage, setStage] = useState(0);
  const [platform, setPlatform] = useState<'modrinth' | 'curseforge' | null>(null);
  const [modrinthAuth, setModrinthAuth] = useState<string | null>(null); // Store it at top-level

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
              <ModrinthValidation back={prevStage} next={nextStage} modrinthAuth={modrinthAuth} />
            ),
          },
          { title: 'Modrinth Confirmation', component: <ConfirmationStep back={prevStage} /> },
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

      {/* Debugging: See the stored API Key */}
      {modrinthAuth && <p className='text-red-500'>Stored Modrinth Auth: {modrinthAuth}</p>}

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

function ModrinthValidation({
  next,
  back,
  modrinthAuth,
}: {
  next: () => void;
  back: () => void;
  modrinthAuth: string | null;
}) {
  const { data } = useFetchAddons(1, 5000);
  const addons = useMemo(() => data?.addons ?? [], [data]); // Wrapped in useMemo()

  const [modrinthProjects, setModrinthProjects] = useState<{ slug: string }[]>([]);
  const [matchingProjects, setMatchingProjects] = useState<Addon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        console.log('Found projects: ', modrinthProjects);

        const matchingAddons = addons.filter((addon) =>
          projectsResponse.data.some((project) => project.slug === addon.slug)
        );

        setMatchingProjects(matchingAddons);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch Modrinth projects');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModrinthProjects();
  }, [modrinthAuth, addons]);

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-xl font-bold'>Modrinth Validation</h2>

      {loading ? (
        <p>Loading your projects...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : matchingProjects.length > 0 ? (
        <div className='mt-4'>
          <h3>Matching Projects</h3>
          <ul className='list-disc pl-5'>
            {matchingProjects.map((addon) => (
              <li key={addon.$id}>
                {addon.name} - {addon.slug}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='mt-4 text-gray-500'>No matching projects found.</p>
      )}

      <div className='mt-4 flex w-full justify-between'>
        <button className='btn-outline' onClick={back}>
          Back
        </button>
        <button className='btn-primary' onClick={next} disabled={matchingProjects.length === 0}>
          Next
        </button>
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

// -------------------- Final Step: Confirmation --------------------
function ConfirmationStep({ back }: { back: () => void }) {
  return (
    <div className='flex flex-col gap-3'>
      <h2>Review and Confirm</h2>
      <p>Make sure your details are correct before submitting.</p>
      <div className='flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button variant='destructive'>Submit</Button>
      </div>
    </div>
  );
}
