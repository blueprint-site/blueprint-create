import { useState } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  RedditIcon,
  RedditShareButton,
  XIcon,
  BlueskyShareButton,
  BlueskyIcon,
  ThreadsShareButton,
  ThreadsIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';
import { useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks';

export interface EnhancedSocialSharingProps {
  title: string;
  description?: string;
  details?: boolean;
  size?: number;
  variant?: 'default' | 'compact' | 'expanded';
  showCopyLink?: boolean;
  showShareDialog?: boolean;
}

const socialPlatforms = [
  { name: 'Reddit', Component: RedditShareButton, Icon: RedditIcon },
  { name: 'Bluesky', Component: BlueskyShareButton, Icon: BlueskyIcon },
  { name: 'WhatsApp', Component: WhatsappShareButton, Icon: WhatsappIcon },
  { name: 'Facebook', Component: FacebookShareButton, Icon: FacebookIcon },
  { name: 'X (Twitter)', Component: TwitterShareButton, Icon: XIcon },
  { name: 'Threads', Component: ThreadsShareButton, Icon: ThreadsIcon },
  { name: 'LinkedIn', Component: LinkedinShareButton, Icon: LinkedinIcon },
  { name: 'Telegram', Component: TelegramShareButton, Icon: TelegramIcon },
  { name: 'Email', Component: EmailShareButton, Icon: EmailIcon },
];

interface ShareButtonsProps {
  platforms?: typeof socialPlatforms;
}

export const EnhancedSocialSharing = ({
  title,
  description = '',
  details = true,
  size = 32,
  variant = 'default',
  showCopyLink = true,
  showShareDialog = false,
}: EnhancedSocialSharingProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentUrl = window.location.origin + location.pathname;
  const shareData = {
    title,
    text: description,
    url: currentUrl,
  };

  // Native Web Share API support
  const canUseNativeShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    /mobile|android|iphone|ipad/i.test(navigator.userAgent);

  const handleNativeShare = async () => {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const getVisiblePlatforms = () => {
    switch (variant) {
      case 'compact':
        return socialPlatforms.slice(0, 4);
      case 'expanded':
        return socialPlatforms;
      default:
        return socialPlatforms.slice(0, 6);
    }
  };

  const ShareButtons = ({ platforms = getVisiblePlatforms() }: ShareButtonsProps) => (
    <div className='flex flex-wrap items-center gap-2'>
      {platforms.map(({ name, Component, Icon }) => (
        <Component
          key={name}
          url={currentUrl}
          title={title}
          windowWidth={640}
          windowHeight={420}
          className='transition-transform hover:scale-110'
        >
          <Icon className='rounded-full' size={size} />
        </Component>
      ))}
    </div>
  );

  if (showShareDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <Share2 className='mr-2 h-4 w-4' />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Share this content</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {/* Copy Link Section */}
            <div className='space-y-2'>
              <Label htmlFor='link'>Link</Label>
              <div className='flex space-x-2'>
                <Input id='link' value={currentUrl} readOnly className='flex-1' />
                <Button type='button' size='sm' onClick={handleCopyLink} className='px-3'>
                  {copiedUrl ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                </Button>
              </div>
            </div>

            {/* Native Share Button */}
            {canUseNativeShare && (
              <Button onClick={handleNativeShare} className='w-full'>
                <Share2 className='mr-2 h-4 w-4' />
                Share via device
              </Button>
            )}

            {/* Social Platform Buttons */}
            <div className='space-y-2'>
              <Label>Share on social media</Label>
              <div className='grid grid-cols-4 gap-2'>
                {socialPlatforms.map(({ name, Component, Icon }) => (
                  <Component
                    key={name}
                    url={currentUrl}
                    title={title}
                    windowWidth={640}
                    windowHeight={420}
                    className='hover:bg-muted flex justify-center rounded-md p-2 transition-colors'
                  >
                    <Icon size={24} className='rounded-full' />
                  </Component>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className='space-y-2'>
      {details && <h5 className='text-sm font-medium'>Share on socials</h5>}

      <div className='flex items-center gap-3'>
        {/* Native Share Button for Mobile */}
        {canUseNativeShare && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleNativeShare}
            className='flex items-center gap-2'
          >
            <Share2 className='h-4 w-4' />
            Share
          </Button>
        )}

        {/* Copy Link Button */}
        {showCopyLink && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleCopyLink}
            className='flex items-center gap-2'
          >
            {copiedUrl ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
            {copiedUrl ? 'Copied!' : 'Copy Link'}
          </Button>
        )}

        {/* Social Platform Buttons */}
        <ShareButtons />
      </div>
    </div>
  );
};

export default EnhancedSocialSharing;
