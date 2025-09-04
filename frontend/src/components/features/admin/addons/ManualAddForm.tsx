import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Upload,
  Link2,
  Package,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  X,
  Image,
  FileText,
  Globe,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Save,
  Eye,
} from 'lucide-react';
import { ValidationScore } from './ValidationScore';
import { addonValidator } from '@/utils/validation/addonValidator';
import { cn } from '@/config/utils';
import { toast } from '@/hooks/useToast';

const addonFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  author: z.string().min(2, 'Author name is required'),
  icon: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  minecraft_versions: z.array(z.string()).min(1, 'Select at least one Minecraft version'),
  create_versions: z.array(z.string()).min(1, 'Select at least one Create mod version'),
  loaders: z.array(z.string()).min(1, 'Select at least one mod loader'),
  sources: z.array(z.string().url()).optional(),
  curseforge_url: z.string().url().optional().or(z.literal('')),
  modrinth_url: z.string().url().optional().or(z.literal('')),
  isValid: z.boolean().default(false),
  isChecked: z.boolean().default(false),
  downloads: z.number().int().min(0).default(0),
});

type AddonFormData = z.infer<typeof addonFormSchema>;

interface ManualAddFormProps {
  onSubmit: (data: AddonFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<AddonFormData>;
}

const CATEGORIES = [
  'create-addon',
  'automation',
  'trains',
  'decoration',
  'storage',
  'technology',
  'utility',
  'adventure',
  'magic',
  'optimization',
];

const MINECRAFT_VERSIONS = ['1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.16.5'];

const CREATE_VERSIONS = ['0.5.1f', '0.5.1e', '0.5.1d', '0.5.1c', '0.5.1b', '0.5.1a', '0.5.0'];

const MOD_LOADERS = ['forge', 'fabric', 'neoforge', 'quilt'];

export function ManualAddForm({ onSubmit, onCancel, initialData }: ManualAddFormProps) {
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [validationScore, setValidationScore] = useState<ReturnType<
    typeof addonValidator.validateAddon
  > | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddonFormData>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: {
      categories: [],
      minecraft_versions: [],
      create_versions: [],
      loaders: [],
      sources: [],
      isValid: false,
      isChecked: false,
      downloads: 0,
      ...initialData,
    },
  });

  const formData = watch();

  useEffect(() => {
    if (formData.icon) {
      setImagePreview(formData.icon);
    }
  }, [formData.icon]);

  useEffect(() => {
    if (formData.name && formData.description) {
      const mockAddon = {
        ...formData,
        $id: 'temp',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };
      const score = addonValidator.validateAddon(mockAddon as any);
      setValidationScore(score);
    }
  }, [formData]);

  const handleImport = async () => {
    if (!importUrl) return;

    setImporting(true);
    try {
      if (importUrl.includes('curseforge.com')) {
        const projectId = importUrl.match(/\/minecraft\/mc-mods\/([^\/]+)/)?.[1];
        if (projectId) {
          const response = await fetch(`/api/curseforge/${projectId}`);
          const data = await response.json();

          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('description', data.summary);
          setValue('author', data.authors[0]?.name || '');
          setValue('icon', data.logo?.url || '');
          setValue('downloads', data.downloadCount);
          setValue('curseforge_url', importUrl);

          const categories = data.categories?.map((cat: any) => cat.slug) || [];
          setValue('categories', categories);

          const gameVersions = data.latestFiles?.[0]?.gameVersions || [];
          const mcVersions = gameVersions.filter((v: string) => v.match(/^\d+\.\d+(\.\d+)?$/));
          setValue('minecraft_versions', mcVersions);

          const loaders = data.latestFiles?.[0]?.modLoader
            ? [data.latestFiles[0].modLoader.toLowerCase()]
            : [];
          setValue('loaders', loaders);
        }
      } else if (importUrl.includes('modrinth.com')) {
        const projectId = importUrl.match(/\/mod\/([^\/\?]+)/)?.[1];
        if (projectId) {
          const response = await fetch(`/api/modrinth/project/${projectId}`);
          const data = await response.json();

          setValue('name', data.title);
          setValue('slug', data.slug);
          setValue('description', data.description);
          setValue('author', data.team || '');
          setValue('icon', data.icon_url || '');
          setValue('downloads', data.downloads);
          setValue('modrinth_url', importUrl);

          setValue('categories', data.categories || []);
          setValue('minecraft_versions', data.game_versions || []);
          setValue('loaders', data.loaders || []);
        }
      }

      toast({
        title: 'Import Successful',
        description: 'Addon data has been imported. Please review and complete any missing fields.',
      });
      setImportUrl('');
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Could not import addon data. Please fill the form manually.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const onSubmitForm = async (data: AddonFormData) => {
    if (validationScore && validationScore.autoApprovalReady) {
      data.isValid = true;
      data.isChecked = true;
    }
    await onSubmit(data);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Addon</CardTitle>
          <CardDescription>
            Manually add a Create mod addon or import from CurseForge/Modrinth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='import' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='import'>
                <Download className='mr-2 h-4 w-4' />
                Import
              </TabsTrigger>
              <TabsTrigger value='manual'>
                <FileText className='mr-2 h-4 w-4' />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value='import' className='space-y-4'>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Paste a CurseForge or Modrinth project URL to auto-import addon data
                </AlertDescription>
              </Alert>

              <div className='flex gap-2'>
                <Input
                  placeholder='https://www.curseforge.com/minecraft/mc-mods/...'
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  disabled={importing}
                />
                <Button onClick={handleImport} disabled={!importUrl || importing}>
                  {importing ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className='mr-2 h-4 w-4' />
                      Import
                    </>
                  )}
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => setImportUrl('https://www.curseforge.com/minecraft/mc-mods/')}
                >
                  <Package className='mr-2 h-4 w-4' />
                  CurseForge Template
                </Button>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => setImportUrl('https://modrinth.com/mod/')}
                >
                  <Globe className='mr-2 h-4 w-4' />
                  Modrinth Template
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='manual'>
              <Alert>
                <Sparkles className='h-4 w-4' />
                <AlertDescription>
                  Fill out the form below to manually add an addon. Auto-validation will run as you
                  type.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <Separator className='my-6' />

          <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name *</Label>
                <Input id='name' {...register('name')} placeholder="Create: Steam 'n Rails" />
                {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug *</Label>
                <Input id='slug' {...register('slug')} placeholder='create-steam-n-rails' />
                {errors.slug && <p className='text-destructive text-xs'>{errors.slug.message}</p>}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                {...register('description')}
                placeholder='A comprehensive addon that adds trains and railway systems...'
                rows={4}
              />
              {errors.description && (
                <p className='text-destructive text-xs'>{errors.description.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='author'>Author *</Label>
                <Input id='author' {...register('author')} placeholder='ModAuthor123' />
                {errors.author && (
                  <p className='text-destructive text-xs'>{errors.author.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='icon'>Icon URL</Label>
                <div className='flex gap-2'>
                  <Input
                    id='icon'
                    {...register('icon')}
                    placeholder='https://example.com/icon.png'
                  />
                  {imagePreview && (
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={() => setPreviewMode(true)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                {errors.icon && <p className='text-destructive text-xs'>{errors.icon.message}</p>}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Categories *</Label>
              <div className='flex flex-wrap gap-2'>
                {CATEGORIES.map((category) => (
                  <Controller
                    key={category}
                    name='categories'
                    control={control}
                    render={({ field }) => {
                      const isSelected = field.value?.includes(category);
                      return (
                        <Badge
                          variant={isSelected ? 'default' : 'outline'}
                          className='cursor-pointer'
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter((c) => c !== category)
                              : [...(field.value || []), category];
                            field.onChange(newValue);
                          }}
                        >
                          {isSelected && <CheckCircle2 className='mr-1 h-3 w-3' />}
                          {category}
                        </Badge>
                      );
                    }}
                  />
                ))}
              </div>
              {errors.categories && (
                <p className='text-destructive text-xs'>{errors.categories.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Minecraft Versions *</Label>
                <Controller
                  name='minecraft_versions'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-1'>
                      {MINECRAFT_VERSIONS.map((version) => (
                        <label key={version} className='flex items-center space-x-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={field.value?.includes(version)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), version]
                                : field.value?.filter((v) => v !== version) || [];
                              field.onChange(newValue);
                            }}
                          />
                          <span>{version}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.minecraft_versions && (
                  <p className='text-destructive text-xs'>{errors.minecraft_versions.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Create Versions *</Label>
                <Controller
                  name='create_versions'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-1'>
                      {CREATE_VERSIONS.map((version) => (
                        <label key={version} className='flex items-center space-x-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={field.value?.includes(version)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), version]
                                : field.value?.filter((v) => v !== version) || [];
                              field.onChange(newValue);
                            }}
                          />
                          <span>{version}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.create_versions && (
                  <p className='text-destructive text-xs'>{errors.create_versions.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Mod Loaders *</Label>
                <Controller
                  name='loaders'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-1'>
                      {MOD_LOADERS.map((loader) => (
                        <label key={loader} className='flex items-center space-x-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={field.value?.includes(loader)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), loader]
                                : field.value?.filter((l) => l !== loader) || [];
                              field.onChange(newValue);
                            }}
                          />
                          <span className='capitalize'>{loader}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.loaders && (
                  <p className='text-destructive text-xs'>{errors.loaders.message}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='curseforge_url'>CurseForge URL</Label>
                <Input
                  id='curseforge_url'
                  {...register('curseforge_url')}
                  placeholder='https://www.curseforge.com/minecraft/mc-mods/...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='modrinth_url'>Modrinth URL</Label>
                <Input
                  id='modrinth_url'
                  {...register('modrinth_url')}
                  placeholder='https://modrinth.com/mod/...'
                />
              </div>
            </div>

            <div className='bg-muted/50 flex items-center justify-between rounded-lg p-4'>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='isValid'
                    {...register('isValid')}
                    disabled={validationScore?.autoApprovalReady}
                  />
                  <Label htmlFor='isValid' className='cursor-pointer'>
                    Mark as Valid
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='isChecked'
                    {...register('isChecked')}
                    disabled={validationScore?.autoApprovalReady}
                  />
                  <Label htmlFor='isChecked' className='cursor-pointer'>
                    Mark as Checked
                  </Label>
                </div>
              </div>
              {validationScore?.autoApprovalReady && (
                <Badge variant='default' className='bg-green-600'>
                  <Sparkles className='mr-1 h-3 w-3' />
                  Will Auto-Approve
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => reset()}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Reset
            </Button>
            <Button onClick={handleSubmit(onSubmitForm)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Adding...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Add Addon
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {validationScore && (
        <Card className='mt-4'>
          <ValidationScore score={validationScore} showActions={false} />
        </Card>
      )}

      <Dialog open={previewMode} onOpenChange={setPreviewMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Icon Preview</DialogTitle>
            <DialogDescription>Preview how the icon will appear</DialogDescription>
          </DialogHeader>
          <div className='flex justify-center p-4'>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt='Icon preview'
                className='max-h-[200px] max-w-[200px] rounded-lg shadow-lg'
                onError={() => {
                  setImagePreview('');
                  toast({
                    title: 'Invalid Image',
                    description: 'Could not load the image from the provided URL',
                    variant: 'destructive',
                  });
                }}
              />
            ) : (
              <div className='bg-muted flex h-[200px] w-[200px] items-center justify-center rounded-lg'>
                <Image className='text-muted-foreground h-12 w-12' />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewMode(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
