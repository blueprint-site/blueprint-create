import { useState } from 'react';
import { Award, User, Calendar, Filter, Search, Trophy, Plus, Trash2, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAllUserAchievements, useRevokeAchievement, usePinAchievement } from '@/api/appwrite/useUserAchievements';
import { useBadges } from '@/api/appwrite/useBadges';
import { useFetchUsers } from '@/api/appwrite/useUsers';
import { ManualAwardDialog } from '@/components/features/admin/rewards/ManualAwardDialog';
import { toast } from 'sonner';
import type { UserAchievement } from '@/schemas/userAchievement.schema';

export const UserAchievements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [isManualAwardOpen, setIsManualAwardOpen] = useState(false);
  const [achievementToRevoke, setAchievementToRevoke] = useState<string | null>(null);
  
  const { data: achievements = [], isLoading } = useAllUserAchievements();
  const { data: badges = [] } = useBadges();
  const { data: usersData } = useFetchUsers();
  const users = usersData?.documents || [];
  const revokeMutation = useRevokeAchievement();
  const pinMutation = usePinAchievement();

  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    const user = users.find(u => u.$id === achievement.userId);
    const badge = badges.find(b => b.$id === achievement.badgeId);
    
    const matchesSearch = 
      !searchQuery ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = !selectedUser || selectedUser === 'all' || achievement.userId === selectedUser;
    const matchesBadge = !selectedBadge || selectedBadge === 'all' || achievement.badgeId === selectedBadge;
    
    return matchesSearch && matchesUser && matchesBadge;
  });

  const getUserName = (userId: string) => {
    const user = users.find(u => u.$id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.$id === userId);
    return user?.email || 'unknown@example.com';
  };

  const getBadgeName = (badgeId: string) => {
    const badge = badges.find(b => b.$id === badgeId);
    return badge?.name || 'Unknown Badge';
  };

  const getBadgeColor = (badgeId: string) => {
    const badge = badges.find(b => b.$id === badgeId);
    return badge?.backgroundColor || '#3b82f6';
  };

  const handleRevokeAchievement = async (achievementId: string) => {
    try {
      await revokeMutation.mutateAsync(achievementId);
      setAchievementToRevoke(null);
    } catch {
      toast.error('Failed to revoke achievement');
    }
  };

  const handleTogglePin = async (achievement: UserAchievement) => {
    try {
      await pinMutation.mutateAsync({
        achievementId: achievement.$id!,
        isPinned: !achievement.isPinned,
      });
    } catch {
      toast.error('Failed to update pin status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading user achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Achievements</h1>
          <p className="text-muted-foreground">
            View and manage all user achievements and badge awards
          </p>
        </div>
        <Button onClick={() => setIsManualAwardOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Manual Award
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(achievements.map(a => a.userId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pinned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {achievements.filter(a => a.isPinned).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New/Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {achievements.filter(a => a.isNew).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, badges, or reasons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.slice(0, 50).map((user) => (
                  <SelectItem key={user.$id} value={user.$id!}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedBadge} onValueChange={setSelectedBadge}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by badge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Badges</SelectItem>
                {badges.map((badge) => (
                  <SelectItem key={badge.$id} value={badge.$id!}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: badge.backgroundColor }}
                      />
                      {badge.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedUser('all');
                setSelectedBadge('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements ({filteredAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No achievements found</h3>
              <p className="text-muted-foreground">
                {achievements.length === 0 
                  ? 'No users have earned any badges yet'
                  : 'No achievements match your current filters'
                }
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Awarded</TableHead>
                    <TableHead>Times Earned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.$id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{getUserName(achievement.userId)}</div>
                            <div className="text-sm text-muted-foreground">
                              {getUserEmail(achievement.userId)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getBadgeColor(achievement.badgeId) }}
                          />
                          <span className="font-medium">{getBadgeName(achievement.badgeId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate" title={achievement.reason}>
                            {achievement.reason}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(achievement.awardedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {achievement.timesEarned}x
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {achievement.isNew && (
                            <Badge variant="destructive" className="text-xs">New</Badge>
                          )}
                          {achievement.isPinned && (
                            <Badge variant="outline" className="text-xs">
                              <Pin className="h-3 w-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(achievement)}
                            title={achievement.isPinned ? 'Unpin' : 'Pin'}
                          >
                            {achievement.isPinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAchievementToRevoke(achievement.$id!)}
                            disabled={revokeMutation.isPending}
                            title="Revoke achievement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Award Dialog */}
      <ManualAwardDialog
        isOpen={isManualAwardOpen}
        onClose={() => setIsManualAwardOpen(false)}
      />

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!achievementToRevoke} onOpenChange={() => setAchievementToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this achievement? This action cannot be undone.
              The user will lose this badge from their profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => achievementToRevoke && handleRevokeAchievement(achievementToRevoke)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Revoke Achievement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};