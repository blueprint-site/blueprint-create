import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import type { Addon } from '@/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Clock,
  RefreshCw,
  Keyboard,
  Users,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router';

interface FullscreenAddonReviewProps {
  addon: Addon;
  selectedIndex: number;
  totalAddons: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onReviewStatusChange: (addon: Addon, isChecked: boolean, autoAdvance: boolean) => void;
  onValidityChange: (addon: Addon, isValid: boolean, autoAdvance: boolean) => void;
  isUpdating: boolean;
  hasPermissionError: boolean;
}

export default function FullscreenAddonReview({
  addon,
  selectedIndex,
  totalAddons,
  onClose,
  onNavigate,
  onReviewStatusChange,
  onValidityChange,
  isUpdating,
  hasPermissionError,
}: FullscreenAddonReviewProps) {
  // Get addon URL
  const getAddonUrl = (addon: Addon): string | null => {
    try {
      if (addon.modrinth_raw) {
        const data =
          typeof addon.modrinth_raw === 'string'
            ? JSON.parse(addon.modrinth_raw)
            : addon.modrinth_raw;
        if (data.slug) return `https://modrinth.com/mod/${data.slug}`;
      }
      if (addon.curseforge_raw) {
        const data =
          typeof addon.curseforge_raw === 'string'
            ? JSON.parse(addon.curseforge_raw)
            : addon.curseforge_raw;
        if (data.slug) return `https://www.curseforge.com/minecraft/mc-mods/${data.slug}`;
      }
    } catch (error) {
      console.warn('Failed to parse addon URLs:', error);
    }
    return null;
  };

  const addonUrl = getAddonUrl(addon);

  // Parse raw data for additional info
  let rawData = null;
  let platform = null;
  try {
    if (addon.modrinth_raw) {
      rawData =
        typeof addon.modrinth_raw === 'string'
          ? JSON.parse(addon.modrinth_raw)
          : addon.modrinth_raw;
      platform = 'Modrinth';
    } else if (addon.curseforge_raw) {
      rawData =
        typeof addon.curseforge_raw === 'string'
          ? JSON.parse(addon.curseforge_raw)
          : addon.curseforge_raw;
      platform = 'CurseForge';
    }
  } catch (error) {
    console.warn('Failed to parse raw addon data:', error);
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (selectedIndex > 0) onNavigate('prev');
          break;
        case 'ArrowRight':
          if (selectedIndex < totalAddons - 1) onNavigate('next');
          break;
        case 'a':
        case 'A':
          if (!addon.isChecked && !isUpdating && !hasPermissionError) {
            onReviewStatusChange(addon, true, true);
          }
          break;
        case 'r':
        case 'R':
          if (!isUpdating && !hasPermissionError) {
            onReviewStatusChange(addon, false, true);
          }
          break;
        case 'e':
        case 'E':
          if (!addon.isValid && !isUpdating && !hasPermissionError) {
            onValidityChange(addon, true, true);
          }
          break;
        case 'd':
        case 'D':
          if (addon.isValid && !isUpdating && !hasPermissionError) {
            onValidityChange(addon, false, true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    addon,
    selectedIndex,
    totalAddons,
    onClose,
    onNavigate,
    onReviewStatusChange,
    onValidityChange,
    isUpdating,
    hasPermissionError,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='bg-background fixed inset-0 z-50'
    >
      {/* Compact Header */}
      <div className='bg-card/95 border-b backdrop-blur'>
        <div className='flex h-14 items-center justify-between px-4'>
          {/* Left: Navigation and Title */}
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='icon' onClick={onClose} className='h-8 w-8'>
              <X className='h-4 w-4' />
            </Button>

            <Separator orientation='vertical' className='h-6' />

            <div className='flex items-center gap-2'>
              <Avatar className='h-7 w-7'>
                <AvatarImage src={addon.icon || ''} />
                <AvatarFallback className='text-xs'>{addon.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='flex items-center gap-2'>
                <h1 className='text-base font-semibold'>{addon.name}</h1>
                <span className='text-muted-foreground text-sm'>
                  by {addon.authors?.join(', ') || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Status Badges */}
          <div className='flex items-center gap-2'>
            <Badge variant={addon.isValid ? 'default' : 'destructive'} className='h-6'>
              {addon.isValid ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={addon.isChecked ? 'default' : 'secondary'} className='h-6'>
              {addon.isChecked ? 'Reviewed' : 'Needs Review'}
            </Badge>
          </div>

          {/* Right: Navigation Controls */}
          <div className='flex items-center gap-2'>
            {addonUrl && (
              <Button size='sm' variant='outline' asChild className='h-8'>
                <Link to={addonUrl} target='_blank'>
                  <ExternalLink className='mr-1.5 h-3.5 w-3.5' />
                  View Source
                </Link>
              </Button>
            )}

            <Separator orientation='vertical' className='h-6' />

            <span className='text-muted-foreground text-sm'>
              {selectedIndex + 1} / {totalAddons}
            </span>

            <div className='flex gap-1'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onNavigate('prev')}
                disabled={selectedIndex === 0}
                className='h-8 w-8'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onNavigate('next')}
                disabled={selectedIndex === totalAddons - 1}
                className='h-8 w-8'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex h-[calc(100vh-3.5rem)]'>
        {/* Left Sidebar - Actions & Quick Info */}
        <div className='bg-card/50 w-80 overflow-y-auto border-r p-4'>
          {/* Review Actions */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Shield className='h-4 w-4' />
              Review Actions
            </div>

            <div className='space-y-3'>
              {/* Quick Action Buttons */}
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  size='sm'
                  onClick={() => onReviewStatusChange(addon, true, true)}
                  disabled={addon.isChecked || isUpdating || hasPermissionError}
                  className='bg-green-600 hover:bg-green-700'
                >
                  <CheckCircle2 className='mr-1 h-3.5 w-3.5' />
                  Approve
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => onReviewStatusChange(addon, false, true)}
                  disabled={isUpdating || hasPermissionError}
                >
                  <AlertTriangle className='mr-1 h-3.5 w-3.5' />
                  Reject
                </Button>
              </div>

              <Separator />

              {/* Review Checkbox */}
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={addon.isChecked}
                  onCheckedChange={(checked) =>
                    onReviewStatusChange(addon, checked === true, false)
                  }
                  disabled={isUpdating || hasPermissionError}
                />
                <label className='text-sm'>Mark as Reviewed</label>
              </div>

              {/* Enable/Disable Switch */}
              <div className='flex items-center justify-between'>
                <label className='text-sm'>Visibility</label>
                <Switch
                  checked={addon.isValid}
                  onCheckedChange={(checked) => onValidityChange(addon, checked, false)}
                  disabled={isUpdating || hasPermissionError}
                />
              </div>
            </div>
          </div>

          <Separator className='my-4' />

          {/* Quick Stats */}
          <div className='space-y-3'>
            <div className='text-sm font-medium'>Statistics</div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground flex items-center gap-1.5'>
                  <Download className='h-3.5 w-3.5' />
                  Downloads
                </span>
                <span className='font-medium'>{addon.downloads?.toLocaleString() || '0'}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground flex items-center gap-1.5'>
                  <Clock className='h-3.5 w-3.5' />
                  Created
                </span>
                <span className='font-medium'>
                  {addon.created_at ? new Date(addon.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground flex items-center gap-1.5'>
                  <RefreshCw className='h-3.5 w-3.5' />
                  Updated
                </span>
                <span className='font-medium'>
                  {addon.updated_at ? new Date(addon.updated_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <Separator className='my-4' />

          {/* Keyboard Shortcuts */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Keyboard className='h-4 w-4' />
              Keyboard Shortcuts
            </div>
            <div className='text-muted-foreground space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span>Navigate</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  ← →
                </kbd>
              </div>
              <div className='flex justify-between'>
                <span>Approve</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  A
                </kbd>
              </div>
              <div className='flex justify-between'>
                <span>Reject</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  R
                </kbd>
              </div>
              <div className='flex justify-between'>
                <span>Enable</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  E
                </kbd>
              </div>
              <div className='flex justify-between'>
                <span>Disable</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  D
                </kbd>
              </div>
              <div className='flex justify-between'>
                <span>Exit</span>
                <kbd className='bg-background text-foreground rounded border px-1.5 py-0.5 font-mono'>
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='mx-auto max-w-4xl space-y-6'>
            {/* Description Section */}
            <Card className='p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <h2 className='text-lg font-semibold'>Description</h2>
                {platform && (
                  <Badge variant='outline' className='text-xs'>
                    From {platform}
                  </Badge>
                )}
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {rawData?.description || addon.description || 'No description available'}
              </p>
            </Card>

            {/* Screenshots Gallery */}
            {rawData?.gallery && rawData.gallery.length > 0 && (
              <Card className='p-4'>
                <h3 className='mb-3 font-semibold'>Screenshots</h3>
                <div className='grid grid-cols-3 gap-3'>
                  {rawData.gallery
                    .slice(0, 6)
                    .map((image: { url?: string; title?: string } | string, index: number) => (
                      <div key={index} className='group relative aspect-video'>
                        <img
                          src={typeof image === 'string' ? image : image.url || ''}
                          alt={
                            typeof image === 'string'
                              ? `Screenshot ${index + 1}`
                              : image.title || `Screenshot ${index + 1}`
                          }
                          className='h-full w-full rounded-md object-cover'
                        />
                      </div>
                    ))}
                </div>
                {rawData.gallery.length > 6 && (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    +{rawData.gallery.length - 6} more screenshots
                  </p>
                )}
              </Card>
            )}

            {/* Project Information Grid */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Categories */}
              {addon.categories && addon.categories.length > 0 && (
                <Card className='p-4'>
                  <h3 className='mb-2 text-sm font-semibold'>Categories</h3>
                  <div className='flex flex-wrap gap-1.5'>
                    {(Array.isArray(addon.categories) ? addon.categories : []).map(
                      (category: string) => (
                        <Badge key={category} variant='secondary' className='text-xs'>
                          {category
                            .replace(/[-_]/g, ' ')
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      )
                    )}
                  </div>
                </Card>
              )}

              {/* Minecraft Versions */}
              {addon.minecraft_versions && addon.minecraft_versions.length > 0 && (
                <Card className='p-4'>
                  <h3 className='mb-2 text-sm font-semibold'>Minecraft Versions</h3>
                  <div className='flex flex-wrap gap-1'>
                    {(Array.isArray(addon.minecraft_versions) ? addon.minecraft_versions : [])
                      .slice(0, 10)
                      .map((version: string) => (
                        <Badge key={version} variant='outline' className='text-xs'>
                          {version}
                        </Badge>
                      ))}
                    {addon.minecraft_versions.length > 10 && (
                      <Badge variant='outline' className='text-xs'>
                        +{addon.minecraft_versions.length - 10}
                      </Badge>
                    )}
                  </div>
                </Card>
              )}

              {/* Mod Loaders */}
              {addon.loaders && addon.loaders.length > 0 && (
                <Card className='p-4'>
                  <h3 className='mb-2 text-sm font-semibold'>Mod Loaders</h3>
                  <div className='flex flex-wrap gap-1.5'>
                    {(Array.isArray(addon.loaders) ? addon.loaders : []).map((loader: string) => (
                      <Badge key={loader} variant='secondary' className='text-xs'>
                        {loader}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Project Type & License */}
              {(rawData?.project_type || rawData?.license) && (
                <Card className='p-4'>
                  <h3 className='mb-2 text-sm font-semibold'>Project Info</h3>
                  <div className='space-y-2'>
                    {rawData.project_type && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Type</span>
                        <Badge variant='secondary' className='text-xs'>
                          {rawData.project_type}
                        </Badge>
                      </div>
                    )}
                    {rawData.license && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>License</span>
                        <span className='font-medium'>
                          {rawData.license.name || rawData.license.id || rawData.license}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Team Members */}
            {rawData?.team && rawData.team.length > 0 && (
              <Card className='p-4'>
                <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                  <Users className='h-4 w-4' />
                  Team Members
                </h3>
                <div className='grid grid-cols-2 gap-2'>
                  {rawData.team.map(
                    (
                      member: {
                        user?: { avatar_url?: string; username?: string };
                        name?: string;
                        role?: string;
                      },
                      index: number
                    ) => (
                      <div key={index} className='flex items-center gap-2'>
                        {member.user?.avatar_url && (
                          <img
                            src={member.user.avatar_url}
                            alt={member.user.username}
                            className='h-6 w-6 rounded-full'
                          />
                        )}
                        <span className='text-sm font-medium'>
                          {member.user?.username || member.name}
                        </span>
                        <Badge variant='outline' className='text-xs'>
                          {member.role}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
