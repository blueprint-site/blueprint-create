import React, { useState } from 'react';
import {
  Download,
  Clock,
  Ruler,
  Blocks,
  Star,
  Calendar,
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Heart,
  Edit,
  Trash2,
  User,
  FileText,
  Layers,
  Box,
  Zap,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import GalleryLazy from '@/components/ui/gallery-lazy';
import VersionsDisplay from '@/components/common/VersionsDisplay';
import ModLoaders from '../../addons/addon-card/ModLoaders';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay';
import { SocialSharingDialog } from '@/components/features/social-sharing/SocialSharingDialog';
import TimerProgress from '@/components/utility/TimerProgress';
import { SchematicVoting } from '@/components/features/schematics/SchematicVoting';
import { useUserStore } from '@/api/stores/userStore';
import { useIncrementDownloads, useFetchSchematic } from '@/api/appwrite/useSchematics';
import { useParams, useNavigate } from 'react-router';
import { useStatsTracking } from '@/providers/StatsTrackingProvider';
import { cn } from '@/config/utils';

const ComplexityBadge = ({ level }: { level: string }) => {
  const config = {
    simple: {
      color: 'bg-green-500/10 text-green-600 border-green-200',
      icon: '🟢',
      label: 'Simple',
    },
    moderate: {
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
      icon: '🟡',
      label: 'Moderate',
    },
    complex: {
      color: 'bg-orange-500/10 text-orange-600 border-orange-200',
      icon: '🟠',
      label: 'Complex',
    },
    extreme: { color: 'bg-red-500/10 text-red-600 border-red-200', icon: '🔴', label: 'Extreme' },
  };

  const cfg = config[level as keyof typeof config] || config.moderate;

  return (
    <Badge variant='outline' className={cn('gap-1', cfg.color)}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </Badge>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={cn('flex items-center gap-2', className)}>
    <Icon className='text-muted-foreground h-4 w-4' />
    <span className='text-muted-foreground text-sm'>{label}:</span>
    <span className='text-sm font-medium'>{value}</span>
  </div>
);

export const SchematicsDetailsEnhancedClean = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: schematic, isLoading } = useFetchSchematic(id);
  const { mutate: incrementDownloads } = useIncrementDownloads();
  const user = useUserStore((state) => state.user);
  const { trackDownload } = useStatsTracking();
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className='container pb-8'>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='space-y-4 text-center'>
            <div className='border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2'></div>
            <p className='text-muted-foreground'>Loading schematic details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!schematic) {
    return (
      <div className='container pb-8'>
        <Alert className='mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Schematic not found or you don&apos;t have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwner = user?.$id === schematic.user_id;
  const createdAtTimestamp = schematic.$createdAt ? new Date(schematic.$createdAt).getTime() : null;
  const isNewUpload = createdAtTimestamp && Date.now() - createdAtTimestamp < 60000;

  const handleDownload = () => {
    window.open(schematic.schematic_url, '_blank');
    incrementDownloads(schematic.$id);

    // Track download stats
    if (schematic.user_id) {
      trackDownload(schematic.user_id, schematic.$id);
    }
  };

  // Calculate complexity score
  const complexityScore = (() => {
    const scores = { simple: 25, moderate: 50, complex: 75, extreme: 100 };
    return scores[schematic.complexity_level as keyof typeof scores] || 50;
  })();

  return (
    <div className='container pb-8'>
      {/* New Upload Timer */}
      {isOwner && isNewUpload && !isTimerComplete && createdAtTimestamp && (
        <div className='mt-8'>
          <TimerProgress
            startTimestamp={createdAtTimestamp}
            countdownTime={60}
            description='Processing your upload... Your schematic will be visible to everyone soon'
            icon={<Clock />}
            onComplete={() => setIsTimerComplete(true)}
          />
        </div>
      )}

      {/* Main Header Card */}
      <Card className='mt-8 overflow-hidden'>
        <CardContent className='p-0'>
          <div className='grid min-h-[400px] grid-cols-1 gap-0 lg:grid-cols-3'>
            {/* Left Section - Image Gallery with Lazy Loading */}
            <div className='bg-muted/30 relative flex flex-col'>
              {schematic.image_urls && schematic.image_urls.length > 0 ? (
                <div className='relative flex-1'>
                  <GalleryLazy
                    images={schematic.image_urls}
                    alt={schematic.title}
                    enableLightbox={true}
                    showNavigation={schematic.image_urls.length > 1}
                    priority={true}
                    className='h-full w-full'
                  />
                </div>
              ) : (
                <div className='bg-muted flex flex-1 items-center justify-center'>
                  <div className='text-center'>
                    <FileText className='text-muted-foreground mx-auto mb-2 h-12 w-12' />
                    <p className='text-muted-foreground text-sm'>No preview available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Section - Main Info */}
            <div className='flex flex-col space-y-4 p-6 lg:col-span-2'>
              {/* Title and Meta */}
              <div className='space-y-3'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h1 className='text-2xl font-bold'>{schematic.title}</h1>
                    <div className='mt-2 flex items-center gap-4'>
                      <InfoItem
                        icon={User}
                        label='Author'
                        value={schematic.authors?.join(', ') || 'Unknown'}
                      />
                      <InfoItem
                        icon={Calendar}
                        label='Published'
                        value={
                          schematic.uploadDate
                            ? new Date(schematic.uploadDate).toLocaleDateString()
                            : 'Recently'
                        }
                      />
                    </div>
                  </div>
                  {schematic.featured && (
                    <Badge variant='default' className='gap-1'>
                      <Star className='h-3 w-3' />
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Categories and Tags */}
                <div className='flex flex-wrap gap-2'>
                  {schematic.categories?.map((cat) => (
                    <Badge key={cat} variant='secondary'>
                      {cat}
                    </Badge>
                  ))}
                  {schematic.sub_categories?.map((subcat) => (
                    <Badge key={subcat} variant='outline'>
                      {subcat}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Key Stats Grid */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='space-y-1'>
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <Box className='h-4 w-4' />
                    <span className='text-xs'>Dimensions</span>
                  </div>
                  <p className='text-sm font-semibold'>
                    {schematic.dimensions_width || 0}×{schematic.dimensions_height || 0}×
                    {schematic.dimensions_depth || 0}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {(schematic.dimensions_blockCount || 0).toLocaleString()} blocks
                  </p>
                </div>

                <div className='space-y-1'>
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span className='text-xs'>Build Time</span>
                  </div>
                  <p className='text-sm font-semibold'>
                    ~{schematic.complexity_buildTime || 30} min
                  </p>
                  <ComplexityBadge level={schematic.complexity_level || 'moderate'} />
                </div>

                <div className='space-y-1'>
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <Heart className='h-4 w-4' />
                    <span className='text-xs'>Engagement</span>
                  </div>
                  <p className='text-sm font-semibold'>{schematic.likes || 0} likes</p>
                  <p className='text-muted-foreground text-xs'>
                    {schematic.rating ? `${schematic.rating.toFixed(1)}/5 rating` : 'Not rated'}
                  </p>
                </div>

                <div className='space-y-1'>
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <Download className='h-4 w-4' />
                    <span className='text-xs'>Downloads</span>
                  </div>
                  <p className='text-sm font-semibold'>
                    {(schematic.downloads || 0).toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-xs'>Total downloads</p>
                </div>
              </div>

              <Separator />

              {/* Quick Info */}
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <Package className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground text-sm'>Minecraft:</span>
                  <div className='flex gap-1'>
                    {schematic.game_versions?.slice(0, 3).map((v) => (
                      <Badge key={v} variant='outline' className='text-xs'>
                        {v}
                      </Badge>
                    ))}
                    {schematic.game_versions && schematic.game_versions.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{schematic.game_versions.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Layers className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground text-sm'>Create:</span>
                  <div className='flex gap-1'>
                    {schematic.create_versions?.slice(0, 2).map((v) => (
                      <Badge key={v} variant='outline' className='text-xs'>
                        {v}
                      </Badge>
                    ))}
                    {schematic.create_versions && schematic.create_versions.length > 2 && (
                      <Badge variant='outline' className='text-xs'>
                        +{schematic.create_versions.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {schematic.requirements_hasRedstone && (
                  <div className='flex items-center gap-2'>
                    <Zap className='h-4 w-4 text-red-500' />
                    <span className='text-sm'>Contains Redstone</span>
                  </div>
                )}

                {schematic.materials_hasModded && (
                  <div className='flex items-center gap-2'>
                    <Blocks className='h-4 w-4 text-purple-500' />
                    <span className='text-sm'>Uses Modded Blocks</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-3'>
                <Button onClick={handleDownload} size='default' className='gap-2'>
                  <Download className='h-4 w-4' />
                  Download
                </Button>

                <SchematicVoting schematic={schematic} size='md' showRating={true} />

                <SocialSharingDialog
                  title={schematic.title}
                  description={`Check out this amazing Minecraft schematic: ${schematic.title}`}
                  triggerText='Share'
                  triggerVariant='outline'
                  showTriggerIcon={true}
                  dialogTitle={`Share "${schematic.title}"`}
                  dialogDescription='Share this schematic with your friends!'
                />

                {isOwner && (
                  <div className='ml-auto flex gap-2'>
                    <Button
                      variant='outline'
                      size='default'
                      onClick={() => navigate(`/schematics/edit/${schematic.$id}`)}
                      className='gap-2'
                    >
                      <Edit className='h-4 w-4' />
                      Edit
                    </Button>
                    <Button variant='destructive' size='default' className='gap-2'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Single Card with Tabs */}
      <Card className='mt-6'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <CardHeader className='pb-3'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='requirements'>Requirements</TabsTrigger>
              <TabsTrigger value='gallery'>Gallery</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* Overview Tab */}
            <TabsContent value='overview' className='mt-0 space-y-6'>
              {/* Description Section */}
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold'>Description</h3>
                <div className='prose prose-sm dark:prose-invert max-w-none'>
                  <MarkdownDisplay content={schematic.description || 'No description provided.'} />
                </div>
              </div>

              <Separator />

              {/* Complexity Analysis */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>
                  <Cpu className='h-5 w-5' />
                  Build Complexity
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Difficulty Level</span>
                    <ComplexityBadge level={schematic.complexity_level || 'moderate'} />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Complexity Score</span>
                      <span className='font-medium'>{complexityScore}%</span>
                    </div>
                    <Progress value={complexityScore} className='h-2' />
                  </div>
                  <div className='grid grid-cols-3 gap-4 pt-2'>
                    <div className='text-center'>
                      <p className='text-muted-foreground text-xs'>Est. Build Time</p>
                      <p className='text-sm font-medium'>
                        {schematic.complexity_buildTime || 30} min
                      </p>
                    </div>
                    <div className='text-center'>
                      <p className='text-muted-foreground text-xs'>Block Count</p>
                      <p className='text-sm font-medium'>
                        {(schematic.dimensions_blockCount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className='text-center'>
                      <p className='text-muted-foreground text-xs'>Volume</p>
                      <p className='text-sm font-medium'>
                        {(
                          (schematic.dimensions_width || 0) *
                          (schematic.dimensions_height || 0) *
                          (schematic.dimensions_depth || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value='details' className='mt-0 space-y-6'>
              {/* Dimensions Section */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>
                  <Ruler className='h-5 w-5' />
                  Dimensions & Structure
                </h3>
                <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                  <div className='text-center'>
                    <p className='text-muted-foreground mb-1 text-sm'>Width</p>
                    <p className='text-2xl font-bold'>{schematic.dimensions_width || 0}</p>
                    <p className='text-muted-foreground text-xs'>blocks</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-muted-foreground mb-1 text-sm'>Height</p>
                    <p className='text-2xl font-bold'>{schematic.dimensions_height || 0}</p>
                    <p className='text-muted-foreground text-xs'>blocks</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-muted-foreground mb-1 text-sm'>Depth</p>
                    <p className='text-2xl font-bold'>{schematic.dimensions_depth || 0}</p>
                    <p className='text-muted-foreground text-xs'>blocks</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-muted-foreground mb-1 text-sm'>Total Blocks</p>
                    <p className='text-2xl font-bold'>
                      {(schematic.dimensions_blockCount || 0).toLocaleString()}
                    </p>
                    <p className='text-muted-foreground text-xs'>count</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Materials Section */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-lg font-semibold'>
                  <Blocks className='h-5 w-5' />
                  Materials & Blocks
                </h3>
                {schematic.materials_primary && schematic.materials_primary.length > 0 ? (
                  <div className='space-y-4'>
                    <div>
                      <p className='mb-2 text-sm font-medium'>Primary Materials</p>
                      <div className='flex flex-wrap gap-2'>
                        {schematic.materials_primary.map((material) => (
                          <Badge key={material} variant='secondary'>
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {schematic.materials_hasModded && (
                      <Alert>
                        <Blocks className='h-4 w-4' />
                        <AlertDescription>
                          This schematic contains modded blocks. Make sure you have the required
                          mods installed.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <p className='text-muted-foreground'>No material information available</p>
                )}
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value='requirements' className='mt-0 space-y-6'>
              {/* Version Compatibility */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Version Compatibility</h3>
                <div className='space-y-4 pl-4'>
                  <div>
                    <p className='mb-2 text-sm font-medium'>Minecraft Versions</p>
                    <VersionsDisplay versions={schematic.game_versions || []} variant='secondary' />
                  </div>
                  <div>
                    <p className='mb-2 text-sm font-medium'>Create Mod Versions</p>
                    <VersionsDisplay versions={schematic.create_versions || []} variant='default' />
                  </div>
                  <div>
                    <p className='mb-2 text-sm font-medium'>Mod Loaders</p>
                    <ModLoaders loaders={schematic.modloaders || []} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Build Requirements */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Build Requirements</h3>
                <div className='space-y-4 pl-4'>
                  {/* Required Mods */}
                  {schematic.requirements_mods && schematic.requirements_mods.length > 0 && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>Required Mods</p>
                      <div className='flex flex-wrap gap-2'>
                        {schematic.requirements_mods.map((mod) => (
                          <Badge key={mod} variant='outline'>
                            {mod}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Features */}
                  <div>
                    <p className='mb-2 text-sm font-medium'>Special Features</p>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        {schematic.requirements_hasRedstone ? (
                          <CheckCircle2 className='h-4 w-4 text-green-500' />
                        ) : (
                          <XCircle className='text-muted-foreground h-4 w-4' />
                        )}
                        <span className='text-sm'>Redstone Mechanisms</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        {schematic.requirements_hasCommandBlocks ? (
                          <CheckCircle2 className='h-4 w-4 text-green-500' />
                        ) : (
                          <XCircle className='text-muted-foreground h-4 w-4' />
                        )}
                        <span className='text-sm'>Command Blocks</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Version */}
                  {schematic.requirements_minecraftVersion && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>Minimum Minecraft Version</p>
                      <Badge variant='outline'>{schematic.requirements_minecraftVersion}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value='gallery' className='mt-0'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Image Gallery</h3>
                  <span className='text-muted-foreground text-sm'>
                    {schematic.image_urls?.length || 0} image(s)
                  </span>
                </div>
                {schematic.image_urls && schematic.image_urls.length > 0 ? (
                  <GalleryLazy
                    images={schematic.image_urls}
                    alt={schematic.title}
                    enableLightbox={true}
                    showNavigation={true}
                  />
                ) : (
                  <div className='bg-muted flex h-64 items-center justify-center rounded-lg'>
                    <div className='text-center'>
                      <FileText className='text-muted-foreground mx-auto mb-2 h-12 w-12' />
                      <p className='text-muted-foreground'>No images available</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Similar Schematics */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Similar Schematics</CardTitle>
          <CardDescription>Other schematics you might like</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
