import React, { useState } from 'react';
import {
  Download,
  Clock,
  Ruler,
  Blocks,
  Star,
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Heart,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Gallery from '@/components/ui/gallery';
import VersionsDisplay from '@/components/common/VersionsDisplay';
import ModLoaders from '../../addons/addon-card/ModLoaders';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay';
import { SocialSharingDialog } from '@/components/features/social-sharing/SocialSharingDialog';
import TimerProgress from '@/components/utility/TimerProgress';
import { SchematicVoting } from '@/components/features/schematics/SchematicVoting';
import { useUserStore } from '@/api/stores/userStore';
import { useIncrementDownloads, useFetchSchematic } from '@/api/appwrite/useSchematics';
import { useParams, useNavigate } from 'react-router';
import { cn } from '@/config/utils';

const ComplexityBadge = ({ level }: { level: string }) => {
  const config = {
    simple: { color: 'bg-green-500', icon: '🟢', label: 'Simple' },
    moderate: { color: 'bg-yellow-500', icon: '🟡', label: 'Moderate' },
    complex: { color: 'bg-orange-500', icon: '🟠', label: 'Complex' },
    extreme: { color: 'bg-red-500', icon: '🔴', label: 'Extreme' },
  };

  const cfg = config[level as keyof typeof config] || config.moderate;

  return (
    <Badge variant='outline' className='gap-1'>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </Badge>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}) => (
  <Card className={cn('', className)}>
    <CardContent className='flex items-start gap-3 p-4'>
      <div className='bg-muted rounded-lg p-2'>
        <Icon className='text-muted-foreground h-4 w-4' />
      </div>
      <div className='flex-1'>
        <p className='text-muted-foreground text-sm'>{label}</p>
        <p className='text-lg font-semibold'>{value}</p>
        {subValue && <p className='text-muted-foreground mt-1 text-xs'>{subValue}</p>}
      </div>
    </CardContent>
  </Card>
);

export const SchematicsDetailsEnhanced = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: schematic, isLoading } = useFetchSchematic(id);
  const { mutate: incrementDownloads } = useIncrementDownloads();
  const user = useUserStore((state) => state.user);
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

  // Calculate complexity score
  const complexityScore = (() => {
    const scores = { simple: 25, moderate: 50, complex: 75, extreme: 100 };
    return scores[schematic.complexity_level as keyof typeof scores] || 50;
  })();

  const handleDownload = () => {
    window.open(schematic.schematic_url, '_blank');
    incrementDownloads(schematic.$id);
  };

  return (
    <div className='container pb-8'>
      {/* Hero Section with Carousel */}
      <Card className='mt-8 overflow-hidden'>
        <div className='relative'>
          {/* Background gradient */}
          <div className='from-primary/10 via-background to-background absolute inset-0 bg-gradient-to-br' />

          <CardHeader className='relative z-10'>
            {/* Timer for new uploads */}
            {isOwner && isNewUpload && !isTimerComplete && createdAtTimestamp && (
              <div className='mb-4'>
                <TimerProgress
                  startTimestamp={createdAtTimestamp}
                  countdownTime={60}
                  description='Processing your upload... Your schematic will be visible to everyone soon'
                  icon={<Clock />}
                  onComplete={() => setIsTimerComplete(true)}
                />
              </div>
            )}

            {/* Title, Carousel and Author Section */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Left side - Title and Info */}
              <div className='space-y-4'>
                <div>
                  <CardTitle className='text-3xl font-bold md:text-4xl'>
                    {schematic.title}
                  </CardTitle>
                  <CardDescription className='mt-2 text-lg'>
                    By {schematic.authors?.join(', ') || 'Unknown'}
                  </CardDescription>
                </div>

                {/* Featured Badge */}
                {schematic.featured && (
                  <Badge variant='default' className='w-fit gap-1'>
                    <Star className='h-3 w-3' />
                    Featured
                  </Badge>
                )}

                {/* Categories */}
                {schematic.categories && schematic.categories.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {schematic.categories.map((cat) => (
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
                )}

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-3 pt-2'>
                  <Button onClick={handleDownload} size='lg' className='gap-2'>
                    <Download className='h-4 w-4' />
                    Download ({schematic.downloads || 0})
                  </Button>

                  <SchematicVoting schematic={schematic} size='lg' showRating={true} />

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
                    <>
                      <Button
                        variant='outline'
                        size='lg'
                        onClick={() => navigate(`/schematics/upload/${schematic.$id}`)}
                        className='gap-2'
                      >
                        <Edit className='h-4 w-4' />
                        Edit
                      </Button>
                      <Button variant='destructive' size='lg' className='gap-2'>
                        <Trash2 className='h-4 w-4' />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Right side - Image Carousel */}
              {schematic.image_urls && schematic.image_urls.length > 0 && (
                <div className='relative'>
                  <Carousel className='w-full'>
                    <CarouselContent>
                      {schematic.image_urls.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className='bg-muted relative aspect-video overflow-hidden rounded-lg'>
                            <img
                              src={imageUrl}
                              alt={`${schematic.title} - Image ${index + 1}`}
                              className='h-full w-full object-cover'
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {schematic.image_urls.length > 1 && (
                      <>
                        <CarouselPrevious className='left-2' />
                        <CarouselNext className='right-2' />
                      </>
                    )}
                  </Carousel>
                </div>
              )}
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-6'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='requirements'>Requirements</TabsTrigger>
          <TabsTrigger value='gallery'>Gallery</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-6'>
          {/* Quick Stats - Only in Overview */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <StatCard
              icon={Ruler}
              label='Dimensions'
              value={`${schematic.dimensions_width || 0}×${schematic.dimensions_height || 0}×${schematic.dimensions_depth || 0}`}
              subValue={`${(schematic.dimensions_blockCount || 0).toLocaleString()} blocks`}
            />
            <StatCard
              icon={Clock}
              label='Build Time'
              value={`~${schematic.complexity_buildTime || 30} min`}
              subValue={schematic.complexity_level || 'moderate'}
            />
            <StatCard
              icon={Heart}
              label='Engagement'
              value={`${schematic.likes || 0} likes`}
              subValue={
                schematic.rating ? `${schematic.rating.toFixed(1)}/5 rating` : 'Not rated yet'
              }
            />
            <StatCard
              icon={Eye}
              label='Downloads'
              value={(schematic.downloads || 0).toLocaleString()}
              subValue={`Published ${schematic.uploadDate ? new Date(schematic.uploadDate).toLocaleDateString() : 'Recently'}`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownDisplay content={schematic.description || 'No description provided.'} />
            </CardContent>
          </Card>

          {/* Complexity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Cpu className='h-5 w-5' />
                Complexity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Difficulty Level</span>
                <ComplexityBadge level={schematic.complexity_level || 'moderate'} />
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Complexity Score</span>
                  <span>{complexityScore}%</span>
                </div>
                <Progress value={complexityScore} className='h-2' />
              </div>
              <div className='grid grid-cols-2 gap-4 pt-2'>
                <div className='text-sm'>
                  <span className='text-muted-foreground'>Est. Build Time:</span>
                  <span className='ml-2 font-medium'>
                    {schematic.complexity_buildTime || 30} minutes
                  </span>
                </div>
                <div className='text-sm'>
                  <span className='text-muted-foreground'>Block Count:</span>
                  <span className='ml-2 font-medium'>
                    {(schematic.dimensions_blockCount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value='details' className='space-y-6'>
          {/* Dimensions Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Ruler className='h-5 w-5' />
                Dimensions & Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>Width</p>
                  <p className='text-2xl font-bold'>{schematic.dimensions_width || 0}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Height</p>
                  <p className='text-2xl font-bold'>{schematic.dimensions_height || 0}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Depth</p>
                  <p className='text-2xl font-bold'>{schematic.dimensions_depth || 0}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Total Blocks</p>
                  <p className='text-2xl font-bold'>
                    {(schematic.dimensions_blockCount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator className='my-4' />
              <div className='text-muted-foreground text-sm'>
                <p>
                  Volume:{' '}
                  {(
                    (schematic.dimensions_width || 0) *
                    (schematic.dimensions_height || 0) *
                    (schematic.dimensions_depth || 0)
                  ).toLocaleString()}{' '}
                  blocks³
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Materials Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Blocks className='h-5 w-5' />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {schematic.materials_primary && schematic.materials_primary.length > 0 ? (
                <>
                  <div>
                    <p className='text-muted-foreground mb-2 text-sm'>Primary Materials</p>
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
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>This schematic contains modded blocks</AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <p className='text-muted-foreground'>No material information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value='requirements' className='space-y-6'>
          {/* Version Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle>Version Compatibility</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='mb-2 font-medium'>Minecraft Versions</h3>
                <VersionsDisplay versions={schematic.game_versions || []} variant='secondary' />
              </div>
              <Separator />
              <div>
                <h3 className='mb-2 font-medium'>Create Mod Versions</h3>
                <VersionsDisplay versions={schematic.create_versions || []} variant='default' />
              </div>
              <Separator />
              <div>
                <h3 className='mb-2 font-medium'>Mod Loaders</h3>
                <ModLoaders loaders={schematic.modloaders || []} />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
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

              {/* Features */}
              <div className='space-y-2'>
                <p className='mb-2 text-sm font-medium'>Features</p>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    {schematic.requirements_hasRedstone ? (
                      <CheckCircle2 className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='text-muted-foreground h-4 w-4' />
                    )}
                    <span className='text-sm'>Contains Redstone Mechanisms</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {schematic.requirements_hasCommandBlocks ? (
                      <CheckCircle2 className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='text-muted-foreground h-4 w-4' />
                    )}
                    <span className='text-sm'>Uses Command Blocks</span>
                  </div>
                </div>
              </div>

              {/* Minecraft Version */}
              {schematic.requirements_minecraftVersion && (
                <div>
                  <p className='mb-2 text-sm font-medium'>Minimum Minecraft Version</p>
                  <Badge variant='outline'>{schematic.requirements_minecraftVersion}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value='gallery'>
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                {schematic.image_urls?.length || 0} image(s) available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schematic.image_urls && schematic.image_urls.length > 0 ? (
                <Gallery images={schematic.image_urls} />
              ) : (
                <div className='bg-muted flex h-64 items-center justify-center rounded-lg'>
                  <p className='text-muted-foreground'>No images available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
