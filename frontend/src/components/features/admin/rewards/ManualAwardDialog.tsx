import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Award } from 'lucide-react';
import { ManualAwardSchema, type ManualAward } from '@/schemas/userAchievement.schema';
import { useBadges } from '@/api/appwrite/useBadges';
import { useFetchUsers } from '@/api/appwrite/useUsers';
import { useManualAwardBadge } from '@/api/appwrite/useUserAchievements';

interface ManualAwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualAwardDialog: React.FC<ManualAwardDialogProps> = ({ isOpen, onClose }) => {
  const { data: badges = [] } = useBadges();
  const { data: usersData } = useFetchUsers();
  const users = usersData?.documents || [];
  const awardMutation = useManualAwardBadge();

  const form = useForm<ManualAward>({
    resolver: zodResolver(ManualAwardSchema),
    defaultValues: {
      userId: '',
      badgeId: '',
      reason: '',
    },
  });

  const selectedUserId = form.watch('userId');
  const selectedBadgeId = form.watch('badgeId');

  const selectedUser = users.find((u) => u.$id === selectedUserId);
  const selectedBadge = badges.find((b) => b.$id === selectedBadgeId);

  const onSubmit = async (data: ManualAward) => {
    try {
      await awardMutation.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error awarding badge manually:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Award className='h-5 w-5' />
            Manual Badge Award
          </DialogTitle>
          <DialogDescription>
            Manually award a badge to a user with a custom reason
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* User Selection */}
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Choose a user to award...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.slice(0, 50).map((user) => (
                        <SelectItem key={user.$id} value={user.$id!}>
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4' />
                            <div>
                              <div className='font-medium'>{user.name}</div>
                              <div className='text-muted-foreground text-sm'>{user.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Search and select the user who should receive the badge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Badge Selection */}
            <FormField
              control={form.control}
              name='badgeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Badge</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Choose a badge to award...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {badges.map((badge) => (
                        <SelectItem key={badge.$id} value={badge.$id!}>
                          <div className='flex items-center gap-2'>
                            <div
                              className='h-4 w-4 rounded-full'
                              style={{ backgroundColor: badge.backgroundColor }}
                            />
                            <div>
                              <div className='font-medium'>{badge.name}</div>
                              <div className='text-muted-foreground text-sm'>
                                {badge.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select which badge the user should receive</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason */}
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Award</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Explain why this badge is being awarded manually...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear reason for the manual badge award (max 200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {selectedUser && selectedBadge && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Award Preview</CardTitle>
                  <CardDescription>This is what will be awarded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <User className='text-muted-foreground h-5 w-5' />
                      <div>
                        <div className='font-medium'>{selectedUser.name}</div>
                        <div className='text-muted-foreground text-sm'>{selectedUser.email}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div
                        className='h-5 w-5 rounded-full'
                        style={{ backgroundColor: selectedBadge.backgroundColor }}
                      />
                      <div>
                        <div className='font-medium'>{selectedBadge.name}</div>
                        <div className='text-muted-foreground text-sm'>
                          {selectedBadge.description}
                        </div>
                        <Badge
                          className='mt-1'
                          style={{
                            backgroundColor: selectedBadge.backgroundColor,
                            color: selectedBadge.textColor,
                          }}
                        >
                          {selectedBadge.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={awardMutation.isPending}
                className='flex items-center gap-2'
              >
                {awardMutation.isPending ? (
                  'Awarding...'
                ) : (
                  <>
                    <Award className='h-4 w-4' />
                    Award Badge
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
