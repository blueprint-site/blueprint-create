import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryBadges from '@/components/features/addons/addon-card/CategoryBadges';
import { AddonStats } from '@/components/features/addons/addon-card/AddonStats';
import { ExternalLinks } from '@/components/features/addons/addon-card/ExternalLinks';
import {
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Github,
  Globe,
  Bug,
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCollectionStore } from '@/api/stores/collectionStore.ts';
import { useFetchAddon } from '@/api';
import ModLoaderDisplay from "@/components/common/ModLoaderDisplay.tsx";

export default function AddonDetails() {
  const { slug } = useParams();
  const [description, setDescription] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(slug || '');

  const handleCollectionAction = () => {
    if (!slug) return;
    isInCollection ? removeAddon(slug) : addAddon(slug);
  };
  const { data: addon, isLoading, error } = useFetchAddon(slug);

  console.log(addon)

  console.log(addon?.modrinth_raw?.gallery || [])

  useEffect(() => {
    if (!slug) {
      return;
    }

    const loadAddonDetails = async () => {
      try {
        // Process markdown description
        if (addon) {
          const markedHtml = await marked(modrinthData.description || '');
          const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
            ALLOWED_TAGS: [
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'p',
              'a',
              'ul',
              'ol',
              'li',
              'code',
              'pre',
              'strong',
              'em',
              'img',
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
          });
          setDescription(sanitizedHtml);
        }
      } catch (err) {
        console.error('Error loading addon details:', err);
      }
    };

    loadAddonDetails();
  }, [slug]);



  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='bg-destructive/10 border-destructive'>
          <CardContent className='p-6'>
            <p className='text-destructive'>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !addon) {
    return (
      <div className='container mx-auto space-y-6 px-4 py-8'>
        <div className='flex gap-4'>
          <Skeleton className='h-16 w-16 rounded-lg' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-8 w-1/3' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
        <Skeleton className='h-96 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    );
  }
  const modrinthData =
    typeof addon.modrinth_raw === 'string' ? JSON.parse(addon.modrinth_raw) : addon.modrinth_raw;
  const curseforgeData =
    typeof addon.curseforge_raw === 'string'
      ? JSON.parse(addon.curseforge_raw)
      : addon.curseforge_raw;

  const gallery = modrinthData?.gallery ?? [];

  const totalDownloads = (modrinthData?.downloads || 0) + (curseforgeData?.downloadCount || 0);
  const externalLinks = [
    ...(curseforgeData?.links?.sourceUrl
      ? [
          {
            icon: <Github className='h-4 w-4' />,
            label: 'Source Code',
            url: curseforgeData.links.sourceUrl,
          },
        ]
      : []),
    ...(curseforgeData?.links?.issuesUrl
      ? [
          {
            icon: <Bug className='h-4 w-4' />,
            label: 'Issue Tracker',
            url: curseforgeData.links.issuesUrl,
          },
        ]
      : []),
    ...(curseforgeData?.links?.websiteUrl
      ? [
          {
            icon: <Globe className='h-4 w-4' />,
            label: 'Website',
            url: curseforgeData.links.websiteUrl,
          },
        ]
      : []),
  ];
  const  navigateGallery = async (direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : gallery.length - 1;
      }
      return prev < gallery.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <div className='container mx-auto space-y-8 px-4 py-8'>
      {/* Header Card */}
      <Card>
        <CardHeader className='space-y-6'>
          <div className='flex items-start gap-4'>
            <img
              src={addon.icon}
              alt={`${addon.name} icon`}
              className='h-16 w-16 rounded-lg border'
            />
            <div className='min-w-0 flex-1'>
              <div className='flex items-center justify-between'>
                <h1 className='mb-2 truncate text-2xl font-bold'>{addon.name}</h1>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 rounded-full'
                  onClick={handleCollectionAction}
                >
                  {isInCollection ? <Star /> : <StarOff />}
                </Button>
              </div>
              <p className='text-foreground-muted'>{addon.description}</p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Download className='h-4 w-4' />
              <span className='text-foreground-muted'>
                {totalDownloads.toLocaleString()} downloads
              </span>
            </div>
            {modrinthData?.follows && (
              <div className='flex items-center gap-2'>
                <Heart className='h-4 w-4' />
                <span className='text-foreground-muted'>
                  {modrinthData.follows.toLocaleString()} followers
                </span>
              </div>
            )}
          </div>

          <Separator />
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-sm font-semibold'>Versions</h3>
                <div className='flex flex-wrap gap-2'>
                  {addon.minecraft_versions?.map((version) => (
                    <Badge key={version} variant='outline'>
                      {version}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-semibold'>Mod Loaders</h3>
                <ModLoaderDisplay loaders={addon.loaders || []}/>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-semibold'>Categories</h3>
                <CategoryBadges categories={addon.categories} />
              </div>
            </div>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-sm font-semibold'>Links</h3>
                <div className='grid grid-cols-1 gap-2'>
                  {externalLinks.map((link, index) => (
                    <Button key={index} variant='outline' className='w-full justify-start' asChild>
                      <a href={link.url} target='_blank' rel='noopener noreferrer'>
                        {link.icon}
                        <span className='ml-2'>{link.label}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-semibold'>Available On</h3>
                <ExternalLinks
                  slug={addon.slug}
                  curseforge_raw={addon.curseforge_raw || {}}
                  modrinth_raw={addon.modrinth_raw || {}}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gallery Card */}
      {gallery && gallery.length > 0 && (
        <Card>
          <CardContent className='p-0'>
            <div className='relative'>
              <div className='aspect-video overflow-hidden'>
                <img
                  src={gallery[currentImageIndex]}
                  alt={`${addon.name} screenshot ${currentImageIndex + 1}`}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>

              <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => navigateGallery('prev')}
                  disabled={currentImageIndex === 0}
                  className='bg-background/80 rounded-full backdrop-blur-xs'
                  aria-label='Previous image'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => navigateGallery('next')}
                  disabled={currentImageIndex === gallery.length - 1}
                  className='bg-background/80 rounded-full backdrop-blur-xs'
                  aria-label='Next image'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>

              <div className='absolute inset-x-0 bottom-4 flex justify-center gap-1'>
                {gallery.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-primary' : 'bg-primary/30'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                    aria-current={idx === currentImageIndex}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description Card */}
      <Card>
        <CardContent className='prose prose-neutral dark:prose-invert max-w-none p-6'>
          <div dangerouslySetInnerHTML={{ __html: description }} className='markdown-content' />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-4 text-lg font-semibold'>Author Information</h3>
              <AddonStats author={addon.author} downloads={totalDownloads} />
              {curseforgeData?.authors && (
                <div className='mt-4'>
                  <h4 className='mb-2 text-sm font-semibold'>Contributors</h4>
                  <div className='flex flex-wrap gap-2'>
                    {curseforgeData.authors.map(
                      (author: { id: string; url: string; name: string }) => (
                        <a
                          key={author.id}
                          href={author.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary text-sm hover:underline'
                        >
                          {author.name}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold'>Project Details</h3>
              <div className='space-y-2 text-sm'>
                <p>
                  <span className='font-semibold'>Created:</span>{' '}
                  {new Date(addon.created_at || Date.now()).toLocaleDateString()}
                </p>
                <p>
                  <span className='font-semibold'>Last Updated:</span>{' '}
                  {new Date(addon.updated_at || Date.now()).toLocaleDateString()}
                </p>
                {modrinthData?.license && (
                  <p>
                    <span className='font-semibold'>License:</span> {modrinthData.license}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
