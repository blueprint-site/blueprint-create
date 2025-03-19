import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import eyes from '@/assets/eyes/eye_squint.gif';

export default function AddonVerifyingPopup() {
  const [stage, setStage] = useState(0);
  const [platform, setPlatform] = useState<'modrinth' | 'curseforge' | null>(null);

  const nextStage = () => setStage((prev) => Math.min(prev + 1, stages.length - 1));
  const prevStage = () => setStage((prev) => Math.max(prev - 1, 0));

  // Define stages based on the selected platform
  const stages = [
    {
      title: 'Select Platform',
      component: <StepOne selectPlatform={setPlatform} next={nextStage} />,
    },
    ...(platform === 'modrinth'
      ? [
          {
            title: 'Modrinth Verification',
            component: <ModrinthStep next={nextStage} back={prevStage} />,
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

      {/* Verification Popup */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Verify my addon</Button>
        </DialogTrigger>
        <DialogContent className='w-[400px] p-6'>
          <DialogHeader>
            <DialogTitle>{stages[stage].title}</DialogTitle>
          </DialogHeader>

          {/* Animated Content */}
          <div className='relative h-100 overflow-hidden'>
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
      <Button
        className='h-20 rounded-2xl bg-green-500'
        onClick={() => {
          selectPlatform('modrinth');
          next();
        }}
      >
        Modrinth
      </Button>
      <Button
        className='h-20 rounded-2xl bg-orange-500'
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
function ModrinthStep({ next, back }: { next: () => void; back: () => void }) {
  return (
    <div className='flex flex-col gap-3'>
      <h2>Modrinth Verification</h2>
      <img src={eyes} className='w-20' />
      <h4>
        How to get your Modrinth API Key: <a href='/blog/howto-modrinth-pat'>Read our blogpost</a>
      </h4>
      <p>Enter your Modrinth API Key:</p>
      <input type='text' className='w-full border p-2' placeholder='Your Modrinth API Key' />
      <div className='flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  );
}

// -------------------- Step 2: CurseForge Verification --------------------
function CurseForgeStep({ next, back }: { next: () => void; back: () => void }) {
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
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  );
}

// -------------------- Step 3: Confirmation --------------------
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
