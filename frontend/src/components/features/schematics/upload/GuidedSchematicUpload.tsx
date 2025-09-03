import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Upload,
  CheckCircle2,
  Info,
  Rocket,
  Image,
  PenTool,
  Tag,
  Package,
  Puzzle,
  FileText,
} from 'lucide-react';
import { toast } from '@/hooks/useToast';
import { cn } from '@/config/utils';
import { useUserStore } from '@/api/stores/userStore';
import { useSaveSchematics } from '@/api/appwrite/useSchematics';
import { schematicFormSchema } from '@/schemas/schematic.schema';
import type { SchematicFormValues, Schematic } from '@/types';
import confetti from 'canvas-confetti';

// Import step components
import { StepFile } from './steps/StepFile';
import { StepImages } from './steps/StepImages';
import { StepTitle } from './steps/StepTitle';
import { StepDescription } from './steps/StepDescription';
import { StepCategories } from './steps/StepCategories';
import { StepMinecraft } from './steps/StepMinecraft';
import { StepMods } from './steps/StepMods';
import { StepTechnicalDetails } from './steps/StepTechnicalDetails';
import { StepReview } from './steps/StepReview';

interface GuidedSchematicUploadProps {
  existingSchematic?: Schematic;
  isEditMode?: boolean;
  onClose?: () => void;
}

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Schematic Upload',
    subtitle: "Let's share your amazing creation with the community!",
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'file',
    title: 'Upload Your File',
    subtitle: 'Select your schematic NBT file',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'images',
    title: 'Add Screenshots',
    subtitle: 'Show off your creation with images',
    icon: Image,
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'title',
    title: 'Name Your Creation',
    subtitle: 'Give it a memorable title',
    icon: PenTool,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'description',
    title: 'Describe Your Build',
    subtitle: 'Tell us what makes it special',
    icon: PenTool,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'categories',
    title: 'Choose Categories',
    subtitle: 'Help others find your creation',
    icon: Tag,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'minecraft',
    title: 'Minecraft Versions',
    subtitle: 'Select compatible game versions',
    icon: Package,
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'mods',
    title: 'Mod Compatibility',
    subtitle: 'Create Mod and loader versions',
    icon: Puzzle,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'technical',
    title: 'Technical Details',
    subtitle: 'Optional specifications',
    icon: Info,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'review',
    title: 'Final Review',
    subtitle: 'Almost there! Review your submission',
    icon: Rocket,
    color: 'from-indigo-500 to-purple-500',
  },
];

// Animation variants for smooth transitions
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Draft management
const DRAFT_KEY = 'schematic_guided_upload_draft';

const saveDraft = (data: Partial<SchematicFormValues>) => {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...data,
        lastSaved: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Failed to save draft:', error);
    return false;
  }
};

const loadDraft = (): Partial<SchematicFormValues> | null => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

export const GuidedSchematicUpload: React.FC<GuidedSchematicUploadProps> = ({
  existingSchematic,
  isEditMode = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { mutateAsync: saveSchematic } = useSaveSchematics();

  // Initialize form
  const methods = useForm<SchematicFormValues>({
    resolver: zodResolver(schematicFormSchema),
    defaultValues: existingSchematic
      ? {
          title: existingSchematic.title || '',
          description: existingSchematic.description || '',
          categories: existingSchematic.categories || [],
          game_versions: existingSchematic.game_versions || [],
          create_versions: existingSchematic.create_versions || [],
          modloaders: existingSchematic.modloaders || [],
          schematicFile: undefined as any,
          imageFiles: [],
        }
      : {
          title: '',
          description: '',
          categories: [],
          game_versions: [],
          create_versions: [],
          modloaders: [],
          schematicFile: undefined as any,
          imageFiles: [],
        },
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = methods;
  const watchedValues = watch();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        handleClose();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        if (currentStep < STEPS.length - 1) {
          handleNext();
        }
      } else if (e.key === 'ArrowRight' && e.altKey) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onClose]);

  // Auto-save draft
  useEffect(() => {
    if (!isEditMode && isDirty && currentStep > 0) {
      const timer = setTimeout(() => {
        if (saveDraft(watchedValues)) {
          toast({
            title: 'Progress Saved',
            description: 'Your work is automatically saved.',
            duration: 2000,
          });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEditMode, isDirty, watchedValues, currentStep]);

  // Load draft on mount
  useEffect(() => {
    if (!isEditMode) {
      const draft = loadDraft();
      if (draft && draft.lastSaved) {
        const timeSince = Date.now() - new Date(draft.lastSaved).getTime();
        if (timeSince < 24 * 60 * 60 * 1000) {
          toast({
            title: 'Welcome Back!',
            description: 'We found your previous work. Would you like to continue?',
            action: (
              <Button
                size='sm'
                onClick={() => {
                  Object.entries(draft).forEach(([key, value]) => {
                    if (key !== 'lastSaved') {
                      setValue(key as keyof SchematicFormValues, value);
                    }
                  });
                  setCurrentStep([1, 1]);
                }}
              >
                Continue
              </Button>
            ),
            duration: 8000,
          });
        }
      }
    }
  }, [isEditMode, setValue]);

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep([currentStep + 1, 1]);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep([currentStep - 1, -1]);
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= currentStep || index === 0) {
      setCurrentStep([index, index - currentStep]);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        setIsOpen(false);
        setTimeout(() => {
          if (onClose) onClose();
          else navigate('/schematics');
        }, 200);
      }
    } else {
      setIsOpen(false);
      setTimeout(() => {
        if (onClose) onClose();
        else navigate('/schematics');
      }, 200);
    }
  };

  // Form submission
  const onSubmit = async (data: SchematicFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upload schematics.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!data.schematicFile && !existingSchematic?.schematic_url) {
      toast({
        title: 'Missing Schematic File',
        description: 'Please upload a schematic file.',
        variant: 'destructive',
      });
      setCurrentStep([1, -1]);
      return;
    }

    setIsSubmitting(true);

    try {
      const schematicData = {
        ...data,
        $id: existingSchematic?.$id,
      } as any;

      const result = await saveSchematic(schematicData);

      // Success celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearDraft();
      toast({
        title: '🎉 Success!',
        description: 'Your schematic has been uploaded successfully!',
      });

      setTimeout(() => {
        navigate(`/schematics/${result.$id}`);
      }, 1500);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current step is valid
  const isStepValid = useCallback(
    (stepIndex: number): boolean => {
      switch (stepIndex) {
        case 0: // Welcome
          return true;
        case 1: // File upload
          return !!(watchedValues.schematicFile || watchedValues.files?.length);
        case 2: // Images
          return true; // Images are optional but recommended
        case 3: // Title
          return !!(watchedValues.title && watchedValues.title.length >= 5);
        case 4: // Description
          return !!(watchedValues.description && watchedValues.description.length >= 10);
        case 5: // Categories
          return !!watchedValues.categories?.length;
        case 6: // Minecraft versions
          return !!watchedValues.game_versions?.length;
        case 7: // Mod compatibility
          return !!(watchedValues.create_versions?.length && watchedValues.modloaders?.length);
        case 8: // Technical details
          return true; // Optional step
        case 9: // Review
          return true;
        default:
          return false;
      }
    },
    [watchedValues]
  );

  const currentStepData = STEPS[currentStep];
  const progressPercentage = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            // Only allow closing through the close button or Escape key, not by clicking outside
            if (!open) {
              // This will be triggered by Escape key
              handleClose();
            }
          }}
        >
          <DialogOverlay className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm' />

          <DialogPrimitive.Portal>
            <DialogPrimitive.Content
              className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent p-0 shadow-none'
              onPointerDownOutside={(e) => {
                // Prevent closing when clicking outside
                e.preventDefault();
              }}
              onInteractOutside={(e) => {
                // Prevent any interaction outside from closing the dialog
                e.preventDefault();
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='relative'>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Close button */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute -top-12 right-0 z-10 text-white hover:bg-white/10'
                      onClick={handleClose}
                    >
                      <X className='h-6 w-6' />
                    </Button>

                    {/* Progress dots */}
                    <div className='mb-8 flex justify-center space-x-2'>
                      {STEPS.map((step, index) => (
                        <button
                          key={step.id}
                          type='button'
                          onClick={() => handleStepClick(index)}
                          className={cn(
                            'h-3 w-3 rounded-full transition-all duration-300',
                            index === currentStep
                              ? 'w-8 bg-white'
                              : index < currentStep
                                ? 'bg-white/60'
                                : 'bg-white/20',
                            (index <= currentStep || index === 0) &&
                              'cursor-pointer hover:bg-white/80'
                          )}
                          disabled={index > currentStep && index !== 0}
                        />
                      ))}
                    </div>

                    {/* Main card container - increased dimensions */}
                    <div className='w-full' style={{ minHeight: '700px' }}>
                      <AnimatePresence mode='wait' custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={cardVariants}
                          initial='enter'
                          animate='center'
                          exit='exit'
                          transition={{
                            x: { type: 'spring', stiffness: 500, damping: 35 },
                            opacity: { duration: 0.1 },
                          }}
                          className='bg-background w-full overflow-hidden rounded-2xl shadow-2xl'
                        >
                          {/* Card header with gradient - more compact */}
                          <div
                            className={cn(
                              'bg-gradient-to-br px-6 py-3 text-white',
                              currentStepData.color
                            )}
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <motion.div
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.05 }}
                                  className='mb-1 flex items-center gap-2'
                                >
                                  <currentStepData.icon className='h-5 w-5' />
                                  <span className='text-xs opacity-90'>
                                    Step{' '}
                                    {currentStep === 0
                                      ? 'Welcome'
                                      : `${currentStep} of ${STEPS.length - 1}`}
                                  </span>
                                </motion.div>
                                <motion.h2
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                  className='text-lg font-bold'
                                >
                                  {currentStepData.title}
                                </motion.h2>
                                <motion.p
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.15 }}
                                  className='text-xs opacity-90'
                                >
                                  {currentStepData.subtitle}
                                </motion.p>
                              </div>
                            </div>
                          </div>

                          {/* Card content - increased height for more space */}
                          <div className='h-[600px] overflow-y-auto p-8'>
                            <AnimatePresence mode='wait'>
                              {currentStep === 0 && (
                                <motion.div
                                  key='welcome'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className='py-4 text-center'
                                >
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.05, 1],
                                      rotate: [0, 2, -2, 0],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatType: 'reverse',
                                    }}
                                    className='mb-6 inline-block'
                                  >
                                    <Upload className='text-primary mx-auto h-20 w-20' />
                                  </motion.div>
                                  <h3 className='mb-4 text-2xl font-bold'>
                                    Ready to Share Your Creation?
                                  </h3>
                                  <p className='text-muted-foreground mx-auto mb-8 max-w-md'>
                                    This guided wizard will help you upload your schematic in just a
                                    few simple steps. Your progress is automatically saved, so you
                                    can take your time.
                                  </p>
                                  <div className='mx-auto grid max-w-lg grid-cols-2 gap-4 text-left'>
                                    <div className='relative overflow-hidden rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5 backdrop-blur-sm'>
                                      <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
                                      <div className='relative flex items-start gap-3 p-4'>
                                        <div className='mt-0.5 flex-shrink-0'>
                                          <CheckCircle2 className='h-5 w-5 text-green-500' />
                                        </div>
                                        <div>
                                          <p className='bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-sm font-semibold text-transparent'>
                                            Auto-save
                                          </p>
                                          <p className='text-foreground/70 mt-1 text-xs'>
                                            Never lose your progress
                                          </p>
                                        </div>
                                      </div>
                                      <div className='absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent'></div>
                                    </div>
                                    <div className='relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 backdrop-blur-sm'>
                                      <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
                                      <div className='relative flex items-start gap-3 p-4'>
                                        <div className='mt-0.5 flex-shrink-0'>
                                          <Sparkles className='h-5 w-5 text-yellow-500' />
                                        </div>
                                        <div>
                                          <p className='bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-sm font-semibold text-transparent'>
                                            Smart Validation
                                          </p>
                                          <p className='text-foreground/70 mt-1 text-xs'>
                                            Helpful tips along the way
                                          </p>
                                        </div>
                                      </div>
                                      <div className='absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent'></div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {currentStep === 1 && (
                                <motion.div
                                  key='file'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepFile />
                                </motion.div>
                              )}

                              {currentStep === 2 && (
                                <motion.div
                                  key='images'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepImages />
                                </motion.div>
                              )}

                              {currentStep === 3 && (
                                <motion.div
                                  key='title'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepTitle />
                                </motion.div>
                              )}

                              {currentStep === 4 && (
                                <motion.div
                                  key='description'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepDescription />
                                </motion.div>
                              )}

                              {currentStep === 5 && (
                                <motion.div
                                  key='categories'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepCategories />
                                </motion.div>
                              )}

                              {currentStep === 6 && (
                                <motion.div
                                  key='minecraft'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepMinecraft />
                                </motion.div>
                              )}

                              {currentStep === 7 && (
                                <motion.div
                                  key='mods'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepMods />
                                </motion.div>
                              )}

                              {currentStep === 8 && (
                                <motion.div
                                  key='technical'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepTechnicalDetails />
                                </motion.div>
                              )}

                              {currentStep === 9 && (
                                <motion.div
                                  key='review'
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <StepReview />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Card footer with navigation */}
                          <div className='bg-muted/30 border-t p-6'>
                            <div className='flex items-center justify-between'>
                              <Button
                                type='button'
                                variant='ghost'
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className='gap-2'
                              >
                                <ChevronLeft className='h-4 w-4' />
                                {currentStep === 0 ? 'Back' : 'Previous'}
                              </Button>

                              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                {currentStep > 0 && currentStep < STEPS.length - 1 && (
                                  <>
                                    <kbd className='bg-background rounded border px-2 py-1 text-xs'>
                                      Alt
                                    </kbd>
                                    <span>+</span>
                                    <kbd className='bg-background rounded border px-2 py-1 text-xs'>
                                      ←→
                                    </kbd>
                                    <span className='ml-2'>to navigate</span>
                                  </>
                                )}
                              </div>

                              {currentStep === STEPS.length - 1 ? (
                                <Button
                                  type='submit'
                                  disabled={isSubmitting || !isStepValid(currentStep)}
                                  className='gap-2'
                                >
                                  {isSubmitting ? (
                                    <>
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                          ease: 'linear',
                                        }}
                                      >
                                        <Upload className='h-4 w-4' />
                                      </motion.div>
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Rocket className='h-4 w-4' />
                                      {isEditMode ? 'Update' : 'Upload'} Schematic
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  type='button'
                                  onClick={handleNext}
                                  disabled={currentStep > 0 && !isStepValid(currentStep)}
                                  className='gap-2'
                                >
                                  {currentStep === 0 ? "Let's Start" : 'Next'}
                                  <ChevronRight className='h-4 w-4' />
                                </Button>
                              )}
                            </div>

                            {/* Progress bar */}
                            {currentStep > 0 && (
                              <div className='mt-4'>
                                <Progress value={progressPercentage} className='h-1' />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </form>
              </FormProvider>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default GuidedSchematicUpload;
