import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AddonStats } from '@/components/features/addons/addon-card/AddonStats';
import {
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Bug,
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {ReactNode, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAddon } from '@/api';

import SocialSharing from "@/components/features/social-sharing/SocialSharing.tsx";
import {CurseForgeAddon, ModrinthAddon} from "@/types";
import AddonDetailsHeader from "@/components/features/addons/addon-details/AddonDetailsHeader.tsx";
import AddonDetailsContent from "@/components/features/addons/addon-details/AddonDetailsContent.tsx";

export default function AddonDetails() {
  const { slug } = useParams();
  const [description, setDescription] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    typeof addon.modrinth_raw === 'string' ? JSON.parse(addon.modrinth_raw) as ModrinthAddon : addon.modrinth_raw as ModrinthAddon;

  const curseforgeData =
    typeof addon.curseforge_raw === 'string'
      ? JSON.parse(addon.curseforge_raw)
      : addon.curseforge_raw;

  const gallery = modrinthData?.gallery ?? [];
  console.log(modrinthData)

  const totalDownloads = (modrinthData?.downloads || 0) + (curseforgeData?.downloadCount || 0);


  const createLink = (icon: ReactNode, label: string, url?: string) => {
    return url ? { icon, label, url } : null;
  };



    const { links } = curseforgeData || {};
  const { sourceUrl, issuesUrl, websiteUrl } = links || {};

  const externalLinks = [
    createLink(<Github className="h-4 w-4" />, "Source Code", sourceUrl),
    createLink(<Bug className="h-4 w-4" />, "Issue Tracker", issuesUrl),
    createLink(<Globe className="h-4 w-4" />, "Website", websiteUrl),
  ].filter((link): link is { icon: ReactNode; label: string; url: string } => link !== null);


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

      <Card>

        {/* Header Card */}

      <AddonDetailsHeader
          title={addon.name}
          description={addon.description}
          downloads={modrinthData?.downloads || 0}
          follows={modrinthData?.follows || 0}
          icon={addon.icon}
      />

        {/* Content Card */}

      <AddonDetailsContent
          versions={addon.minecraft_versions || []}
          loaders={addon.loaders || []}
          categories={addon.categories || []}
          links={externalLinks || []}
          slug={addon.slug}
          modrinth_raw={addon.modrinth_raw as ModrinthAddon}
          curseforge_raw={addon.curseforge_raw as CurseForgeAddon}
      />

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
                  <SocialSharing title={addon.name} />
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
