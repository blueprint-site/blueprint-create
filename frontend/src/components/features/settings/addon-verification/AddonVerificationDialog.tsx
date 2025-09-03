import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import type { VerificationPlatform } from './types';
import PlatformSelectionStep from './steps/PlatformSelectionStep';
import ModrinthAuthStep from './steps/ModrinthAuthStep';
import ModrinthProfileStep from './steps/ModrinthProfileStep';
import ModrinthValidationStep from './steps/ModrinthValidationStep';
import ConfirmationStep from './steps/ConfirmationStep';
import ClaimAddonsStep from './steps/ClaimAddonsStep';
import CurseForgeStep from './steps/CurseForgeStep';

export default function AddonVerificationDialog() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [platform, setPlatform] = useState<VerificationPlatform>(null);
  const [modrinthToken, setModrinthToken] = useState<string>('');
  const [selectedAddonSlugs, setSelectedAddonSlugs] = useState<string[]>([]);

  const nextStage = () => setStage((prev) => Math.min(prev + 1, stages.length - 1));
  const prevStage = () => setStage((prev) => Math.max(prev - 1, 0));

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      setStage(0);
      setPlatform(null);
      setModrinthToken('');
      setSelectedAddonSlugs([]);
    }
  };

  const stages = [
    <PlatformSelectionStep
      selectPlatform={setPlatform}
      next={nextStage}
      key='platform-selection'
    />,
    ...(platform === 'modrinth'
      ? [
          <ModrinthAuthStep
            key='modrinth-auth-step'
            next={nextStage}
            back={prevStage}
            setModrinthToken={setModrinthToken}
            modrinthToken={modrinthToken}
          />,
          <ModrinthProfileStep
            key='modrinth-profile-step'
            next={nextStage}
            back={prevStage}
            modrinthToken={modrinthToken}
          />,
          <ModrinthValidationStep
            key='modrinth-validation-step'
            back={prevStage}
            next={nextStage}
            modrinthToken={modrinthToken}
            selectedAddonSlugs={selectedAddonSlugs}
            setSelectedAddonSlugs={setSelectedAddonSlugs}
          />,
          <ConfirmationStep
            key='confirmation-step'
            back={prevStage}
            next={nextStage}
            selectedAddonSlugs={selectedAddonSlugs}
          />,
          <ClaimAddonsStep
            key='push-changes-step'
            back={prevStage}
            selectedAddonSlugs={selectedAddonSlugs}
          />,
        ]
      : [<CurseForgeStep next={nextStage} back={prevStage} key='curseforge-step' />]),
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Verify my addon</Button>
      </DialogTrigger>
      <DialogContent className='min-h-80 w-full max-w-md p-6 sm:max-w-lg'>
        <div className='relative'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='w-full'
            >
              {stages[stage]}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
