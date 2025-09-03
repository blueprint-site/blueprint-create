import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Eye, Save, Upload, Check } from 'lucide-react';
import { toast } from '@/hooks/useToast';
import { cn } from '@/config/utils';
import { useUserStore } from '@/api/stores/userStore';
import { useSaveSchematics } from '@/api/appwrite/useSchematics';
import { schematicFormSchema } from '@/schemas/schematic.schema';
import type { SchematicFormValues, Schematic } from '@/types';

// Import step components (to be created)
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepVersionCompatibility } from './steps/StepVersionCompatibility';
import { StepTechnicalDetails } from './steps/StepTechnicalDetails';
import { StepReview } from './steps/StepReview';
import { SchematicPreview } from './SchematicUploadPreview';

interface MultiStepSchematicUploadProps {
  existingSchematic?: Schematic;
  isEditMode?: boolean;
}

const STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Upload files and add basic details',
    icon: Upload,
  },
  {
    id: 'versions',
    title: 'Version Compatibility',
    description: 'Select compatible versions',
    icon: Check,
  },
  {
    id: 'technical',
    title: 'Technical Details',
    description: 'Add materials, mods, and dimensions',
    icon: Check,
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your schematic before submitting',
    icon: Eye,
  },
];

// Draft management functions
const DRAFT_KEY = 'schematic_upload_draft';

const saveDraft = (data: Partial<SchematicFormValues>) => {
  try {
    const existingDraft = localStorage.getItem(DRAFT_KEY);
    const draft = existingDraft ? JSON.parse(existingDraft) : {};
    const updatedDraft = { ...draft, ...data, lastSaved: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDraft));
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

const MultiStepSchematicUpload: React.FC<MultiStepSchematicUploadProps> = ({
  existingSchematic,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const { mutateAsync: saveSchematic } = useSaveSchematics();

  // Initialize form with react-hook-form
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

  // Load draft on mount
  useEffect(() => {
    if (!isEditMode && !draftLoaded) {
      const draft = loadDraft();
      if (draft && draft.lastSaved) {
        const lastSaved = new Date(draft.lastSaved);
        const timeSinceLastSave = Date.now() - lastSaved.getTime();
        const hoursSinceLastSave = timeSinceLastSave / (1000 * 60 * 60);

        if (hoursSinceLastSave < 24) {
          toast({
            title: 'Draft Found',
            description: `Would you like to continue from your previous session? (Saved ${new Date(draft.lastSaved).toLocaleString()})`,
            action: (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => {
                    Object.entries(draft).forEach(([key, value]) => {
                      if (key !== 'lastSaved') {
                        setValue(key as keyof SchematicFormValues, value);
                      }
                    });
                    toast({
                      title: 'Draft Restored',
                      description: 'Your previous work has been restored.',
                    });
                  }}
                >
                  Restore
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    clearDraft();
                    toast({
                      title: 'Draft Discarded',
                      description: 'Starting with a fresh form.',
                    });
                  }}
                >
                  Discard
                </Button>
              </div>
            ),
            duration: 10000,
          });
        }
      }
      setDraftLoaded(true);
    }
  }, [isEditMode, draftLoaded, setValue]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isEditMode && isDirty) {
      const autoSaveInterval = setInterval(() => {
        if (saveDraft(watchedValues)) {
          toast({
            title: 'Draft Saved',
            description: 'Your progress has been saved automatically.',
            duration: 2000,
          });
        }
      }, 30000);

      return () => clearInterval(autoSaveInterval);
    }
  }, [isEditMode, isDirty, watchedValues]);

  // Handle manual draft save
  const handleSaveDraft = () => {
    if (saveDraft(watchedValues)) {
      toast({
        title: 'Draft Saved',
        description: 'You can safely leave and return later to continue.',
      });
    } else {
      toast({
        title: 'Failed to Save Draft',
        description: 'Please try again or copy your content manually.',
        variant: 'destructive',
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: SchematicFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to upload schematics.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!data.schematicFile && !existingSchematic?.schematic_url) {
      toast({
        title: 'Missing Schematic File',
        description: 'Please upload a schematic file (.nbt) before submitting.',
        variant: 'destructive',
      });
      setCurrentStep(0);
      return;
    }

    setIsSubmitting(true);

    try {
      const schematicData = {
        ...data,
        $id: existingSchematic?.$id,
      } as any;

      const result = await saveSchematic(schematicData);

      clearDraft();
      toast({
        title: isEditMode ? 'Schematic Updated!' : 'Schematic Uploaded!',
        description: 'Your schematic has been successfully published.',
      });
      navigate(`/schematics/${result.$id}`);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current step is valid
  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(
          watchedValues.title &&
          watchedValues.description &&
          watchedValues.categories?.length > 0
        );
      case 1:
        return !!(
          watchedValues.game_versions?.length &&
          watchedValues.create_versions?.length &&
          watchedValues.modloaders?.length
        );
      case 2:
        return true; // Technical details are optional
      case 3:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-background min-h-screen'>
        {/* Progress Bar */}
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur'>
          <div className='container mx-auto px-4 py-4'>
            <div className='mb-4 flex items-center justify-between'>
              <h1 className='text-2xl font-bold'>
                {isEditMode ? 'Edit Schematic' : 'Upload Schematic'}
              </h1>
              <div className='flex items-center gap-2'>
                {/* Mobile Preview Button */}
                <Sheet open={showMobilePreview} onOpenChange={setShowMobilePreview}>
                  <SheetTrigger asChild>
                    <Button variant='outline' size='sm' className='md:hidden'>
                      <Eye className='mr-2 h-4 w-4' />
                      Preview
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='bottom' className='h-[80vh]'>
                    <SheetHeader>
                      <SheetTitle>Preview</SheetTitle>
                      <SheetDescription>
                        This is how your schematic will appear to others
                      </SheetDescription>
                    </SheetHeader>
                    <div className='mt-4 h-[calc(100%-80px)] overflow-y-auto'>
                      <SchematicPreview formData={watchedValues} />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Save Draft Button */}
                {!isEditMode && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleSaveDraft}
                    disabled={!isDirty}
                  >
                    <Save className='mr-2 h-4 w-4' />
                    Save Draft
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Indicator */}
            <Progress value={progressPercentage} className='mb-4 h-2' />

            {/* Step Tabs */}
            <Tabs value={STEPS[currentStep].id} className='w-full'>
              <TabsList className='grid w-full grid-cols-2 md:grid-cols-4'>
                {STEPS.map((step, index) => (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    onClick={() => goToStep(index)}
                    className={cn(
                      'relative',
                      index <= currentStep && 'cursor-pointer',
                      index > currentStep && 'cursor-not-allowed opacity-50'
                    )}
                    disabled={index > currentStep}
                  >
                    <div className='flex items-center gap-2'>
                      {index < currentStep ? (
                        <Check className='text-primary h-4 w-4' />
                      ) : (
                        <step.icon className='h-4 w-4' />
                      )}
                      <span className='hidden md:inline'>{step.title}</span>
                      <span className='md:hidden'>{index + 1}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Form Section */}
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>{STEPS[currentStep].title}</CardTitle>
                  <CardDescription>{STEPS[currentStep].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Step Content */}
                  {currentStep === 0 && <StepBasicInfo />}
                  {currentStep === 1 && <StepVersionCompatibility />}
                  {currentStep === 2 && <StepTechnicalDetails />}
                  {currentStep === 3 && <StepReview />}

                  {/* Navigation Buttons */}
                  <div className='mt-8 flex justify-between'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className='mr-2 h-4 w-4' />
                      Previous
                    </Button>

                    {currentStep === STEPS.length - 1 ? (
                      <Button
                        type='submit'
                        disabled={isSubmitting || !isStepValid(currentStep)}
                        className='ml-auto'
                      >
                        {isSubmitting ? (
                          <>Submitting...</>
                        ) : (
                          <>
                            <Upload className='mr-2 h-4 w-4' />
                            {isEditMode ? 'Update Schematic' : 'Upload Schematic'}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type='button'
                        onClick={goToNextStep}
                        disabled={!isStepValid(currentStep)}
                        className='ml-auto'
                      >
                        Next
                        <ChevronRight className='ml-2 h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Preview Section */}
            <div className='hidden lg:block'>
              <Card className='sticky top-24'>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    This is how your schematic will appear to others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchematicPreview formData={watchedValues} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepSchematicUpload;
