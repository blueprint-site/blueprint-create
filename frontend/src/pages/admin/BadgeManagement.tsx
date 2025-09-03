import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { badgeTemplates } from '@/config/defaultBadges';
import { updateBadgesWithIcons } from '@/utils/updateBadgeIcons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeCreator } from '@/components/admin/badges/BadgeCreator';
import {
  useBadges,
  useCreateBadge,
  useUpdateBadge,
  useDeleteBadge,
} from '@/api/appwrite/useBadges';
import { cn } from '@/config/utils';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Star,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Badge as BadgeType, CreateBadge } from '@/schemas/badge.schema';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  star: Star,
  award: Award,
  sparkles: Sparkles,
};

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

const BadgeDisplay = ({ badge }: { badge: BadgeType }) => {
  const IconComponent = iconMap[badge.icon] || Shield;

  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'hexagon':
        return 'clip-hexagon';
      case 'shield':
        return 'clip-shield';
      case 'star':
        return 'clip-star';
      default:
        return 'rounded-lg';
    }
  };

  const badgeStyle = {
    backgroundColor: badge.backgroundColor,
    color: badge.textColor,
    borderColor: badge.borderColor,
    borderWidth: '2px',
    borderStyle: 'solid',
  };

  // If we have an iconUrl, show the image instead of the icon component
  if (badge.iconUrl) {
    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center transition-all duration-300',
          getShapeClasses(badge.shape),
          badge.hasGlow && 'shadow-lg shadow-current/50',
          badge.isAnimated && 'animate-pulse'
        )}
      >
        <img src={badge.iconUrl} alt={badge.name} className='h-12 w-12 rounded-full object-cover' />
        {badge.rarity !== 'common' && (
          <div
            className={cn(
              'absolute -top-1 -right-1 h-2 w-2 rounded-full',
              rarityColors[badge.rarity],
              badge.isAnimated && 'animate-ping'
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center p-3 transition-all duration-300',
        getShapeClasses(badge.shape),
        badge.hasGlow && 'shadow-lg shadow-current/50',
        badge.isAnimated && 'animate-pulse'
      )}
      style={badgeStyle}
    >
      <IconComponent className='h-6 w-6' />
      {badge.rarity !== 'common' && (
        <div
          className={cn(
            'absolute -top-1 -right-1 h-2 w-2 rounded-full',
            rarityColors[badge.rarity],
            badge.isAnimated && 'animate-ping'
          )}
        />
      )}
    </div>
  );
};

export const BadgeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const { data: badges, isLoading } = useBadges();
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge();
  const deleteBadge = useDeleteBadge();

  const filteredBadges =
    badges?.filter(
      (badge) =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreateBadge = async (badge: CreateBadge) => {
    await createBadge.mutateAsync(badge);
    setIsCreatorOpen(false);
  };

  const handleUpdateBadge = async (badge: CreateBadge) => {
    if (editingBadge?.$id) {
      await updateBadge.mutateAsync({
        badgeId: editingBadge.$id,
        badge,
      });
      setEditingBadge(null);
    }
  };

  const handleDeleteBadge = async (badgeId: string) => {
    await deleteBadge.mutateAsync(badgeId);
  };

  const handleCreateSampleBadges = async () => {
    try {
      for (const template of badgeTemplates) {
        await createBadge.mutateAsync(template);
      }
      toast.success('Sample badges created successfully!');
    } catch (error) {
      console.error('Error creating sample badges:', error);
      toast.error('Failed to create some sample badges');
    }
  };

  const handleUpdateBadgeIcons = async () => {
    try {
      const success = await updateBadgesWithIcons();
      if (success) {
        toast.success('Badge icons updated successfully!');
        // Refresh the badges list
        window.location.reload();
      } else {
        toast.error('Failed to update some badge icons');
      }
    } catch (error) {
      console.error('Error updating badge icons:', error);
      toast.error('Failed to update badge icons');
    }
  };

  return (
    <div className='flex-1 space-y-6 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Badge Management</h2>
          <p className='text-muted-foreground'>Create and manage user badges</p>
        </div>
        <div className='flex gap-2'>
          {badges?.length === 0 && (
            <Button variant='outline' onClick={handleCreateSampleBadges}>
              <Wand2 className='mr-2 h-4 w-4' />
              Create Sample Badges
            </Button>
          )}
          {badges && badges.length > 0 && badges.some((b) => !b.iconUrl) && (
            <Button variant='outline' onClick={handleUpdateBadgeIcons}>
              <Wand2 className='mr-2 h-4 w-4' />
              Add Missing Icons
            </Button>
          )}
          <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Create Badge
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create New Badge</DialogTitle>
                <DialogDescription>
                  Design a custom badge with various styles and effects
                </DialogDescription>
              </DialogHeader>
              <BadgeCreator onSave={handleCreateBadge} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='all' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='all'>All Badges</TabsTrigger>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='inactive'>Inactive</TabsTrigger>
        </TabsList>

        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <Label htmlFor='search' className='sr-only'>
              Search badges
            </Label>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                id='search'
                placeholder='Search badges...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <Badge variant='outline'>Total: {badges?.length || 0}</Badge>
            <Badge variant='outline' className='text-green-600'>
              Active: {badges?.filter((b) => b.isActive).length || 0}
            </Badge>
          </div>
        </div>

        <TabsContent value='all' className='space-y-4'>
          {isLoading ? (
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          ) : filteredBadges.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Shield className='text-muted-foreground mb-4 h-12 w-12' />
                <p className='text-lg font-medium'>No badges found</p>
                <p className='text-muted-foreground text-sm'>
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Create your first badge to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-20'>Badge</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBadges.map((badge) => (
                    <TableRow key={badge.$id}>
                      <TableCell>
                        <BadgeDisplay badge={badge} />
                      </TableCell>
                      <TableCell className='font-medium'>{badge.name}</TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {badge.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize', rarityColors[badge.rarity])}>
                          {badge.rarity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {badge.isActive ? (
                          <Badge variant='outline' className='text-green-600'>
                            <CheckCircle className='mr-1 h-3 w-3' />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='text-gray-500'>
                            <XCircle className='mr-1 h-3 w-3' />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setEditingBadge(badge)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
                              <DialogHeader>
                                <DialogTitle>Edit Badge</DialogTitle>
                                <DialogDescription>
                                  Update badge details and appearance
                                </DialogDescription>
                              </DialogHeader>
                              <BadgeCreator
                                onSave={handleUpdateBadge}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                editingBadge={badge.$id ? (badge as any) : undefined}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant='outline' size='sm'>
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Badge</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{badge.name}&quot;? This
                                  action cannot be undone and will remove the badge from all users.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBadge(badge.$id!)}
                                  className='bg-destructive text-destructive-foreground'
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='active' className='space-y-4'>
          {/* Similar table but filtered for active badges */}
          <Card>
            <CardContent className='py-6'>
              <p className='text-muted-foreground text-center'>
                Showing {badges?.filter((b) => b.isActive).length || 0} active badges
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='inactive' className='space-y-4'>
          {/* Similar table but filtered for inactive badges */}
          <Card>
            <CardContent className='py-6'>
              <p className='text-muted-foreground text-center'>
                Showing {badges?.filter((b) => !b.isActive).length || 0} inactive badges
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
