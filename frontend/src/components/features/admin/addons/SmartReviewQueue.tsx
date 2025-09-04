import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Download,
  ExternalLink,
  Calendar,
  User,
  Package,
  Hash,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ValidationScore } from './ValidationScore';
import type { Addon } from '@/types';
import type { AddonWithParsedFields } from '@/types/addons/addon-details';
import { addonValidator } from '@/utils/validation/addonValidator';
import { cn } from '@/config/utils.ts';
import { formatDistanceToNow } from 'date-fns';

interface QueueItem extends AddonWithParsedFields {
  validationScore?: ReturnType<typeof addonValidator.validateAddon>;
  priority?: 'high' | 'medium' | 'low';
  submittedAt?: string;
  reviewCount?: number;
}

interface SmartReviewQueueProps {
  addons: QueueItem[];
  onApprove: (addon: QueueItem) => void;
  onReject: (addon: QueueItem) => void;
  onReview: (addon: QueueItem) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function SmartReviewQueue({
  addons,
  onApprove,
  onReject,
  onReview,
  onRefresh,
  loading = false,
}: SmartReviewQueueProps) {
  const [selectedAddon, setSelectedAddon] = useState<QueueItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');

  const processedAddons = useMemo(() => {
    return addons.map((addon) => ({
      ...addon,
      validationScore: addon.validationScore || addonValidator.validateAddon(addon),
    }));
  }, [addons]);

  const categorizedAddons = useMemo(() => {
    const high: QueueItem[] = [];
    const medium: QueueItem[] = [];
    const low: QueueItem[] = [];

    processedAddons.forEach((addon) => {
      if (addon.validationScore) {
        if (addon.validationScore.confidence === 'high') {
          high.push(addon);
        } else if (addon.validationScore.confidence === 'medium') {
          medium.push(addon);
        } else {
          low.push(addon);
        }
      }
    });

    return { high, medium, low, all: processedAddons };
  }, [processedAddons]);

  const filteredAddons = useMemo(() => {
    let filtered =
      filterCategory === 'all' ? categorizedAddons.all : categorizedAddons[filterCategory];

    if (searchQuery) {
      filtered = filtered.filter(
        (addon) =>
          addon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.validationScore?.percentage || 0) - (a.validationScore?.percentage || 0);
        case 'date':
          return (
            new Date(b.submittedAt || b.$createdAt || '').getTime() -
            new Date(a.submittedAt || a.$createdAt || '').getTime()
          );
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [categorizedAddons, filterCategory, searchQuery, sortBy]);

  const handleBulkApprove = useCallback(
    (confidence: 'high' | 'medium' | 'low') => {
      const toApprove = categorizedAddons[confidence];
      toApprove.forEach((addon) => onApprove(addon));
    },
    [categorizedAddons, onApprove]
  );

  const QueueCard = ({ addon }: { addon: QueueItem }) => {
    const score = addon.validationScore;
    const summary = score ? addonValidator.getValidationSummary(score) : null;

    return (
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          selectedAddon?.$id === addon.$id && 'ring-primary ring-2'
        )}
        onClick={() => setSelectedAddon(addon)}
      >
        <CardContent className='p-4'>
          <div className='mb-3 flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              {addon.icon ? (
                <img src={addon.icon} alt={addon.name} className='h-10 w-10 rounded-lg' />
              ) : (
                <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Package className='text-muted-foreground h-5 w-5' />
                </div>
              )}
              <div>
                <h4 className='text-sm font-semibold'>{addon.name}</h4>
                <p className='text-muted-foreground text-xs'>{addon.author}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {summary && <div className='text-xl'>{summary.icon}</div>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onReview(addon)}>
                    <Eye className='mr-2 h-4 w-4' />
                    Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onApprove(addon)}>
                    <ThumbsUp className='mr-2 h-4 w-4' />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReject(addon)}>
                    <ThumbsDown className='mr-2 h-4 w-4' />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    View Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className='text-muted-foreground mb-3 line-clamp-2 text-xs'>{addon.description}</p>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {score && (
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs',
                    score.confidence === 'high' && 'border-green-500 text-green-600',
                    score.confidence === 'medium' && 'border-yellow-500 text-yellow-600',
                    score.confidence === 'low' && 'border-red-500 text-red-600'
                  )}
                >
                  {score.percentage}%
                </Badge>
              )}
              {addon.categories?.slice(0, 2).map((category, idx) => (
                <Badge key={idx} variant='secondary' className='text-xs'>
                  {category}
                </Badge>
              ))}
            </div>
            <div className='text-muted-foreground flex items-center gap-1 text-xs'>
              <Clock className='h-3 w-3' />
              <span>
                {addon.submittedAt
                  ? formatDistanceToNow(new Date(addon.submittedAt), { addSuffix: true })
                  : 'Recently'}
              </span>
            </div>
          </div>

          {score?.autoApprovalReady && (
            <div className='mt-2 flex items-center gap-1 text-xs text-green-600'>
              <Zap className='h-3 w-3' />
              <span>Ready for auto-approval</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
      <div className='space-y-4 lg:col-span-2'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Smart Review Queue</CardTitle>
                <CardDescription>
                  AI-powered addon validation with traffic light system
                </CardDescription>
              </div>
              <Button onClick={onRefresh} variant='outline' size='sm' disabled={loading}>
                <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex gap-4'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Search addons...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className='w-[140px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='score'>Sort by Score</SelectItem>
                  <SelectItem value='date'>Sort by Date</SelectItem>
                  <SelectItem value='name'>Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <TabsList className='mb-4 grid grid-cols-4'>
                <TabsTrigger value='all' className='flex items-center gap-1'>
                  <Hash className='h-3 w-3' />
                  All ({categorizedAddons.all.length})
                </TabsTrigger>
                <TabsTrigger value='high' className='flex items-center gap-1'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  High ({categorizedAddons.high.length})
                </TabsTrigger>
                <TabsTrigger value='medium' className='flex items-center gap-1'>
                  <div className='h-2 w-2 rounded-full bg-yellow-500' />
                  Medium ({categorizedAddons.medium.length})
                </TabsTrigger>
                <TabsTrigger value='low' className='flex items-center gap-1'>
                  <div className='h-2 w-2 rounded-full bg-red-500' />
                  Low ({categorizedAddons.low.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filterCategory} className='mt-0'>
                {filterCategory !== 'all' && categorizedAddons[filterCategory].length > 1 && (
                  <div className='bg-muted/50 mb-4 flex items-center justify-between rounded-lg p-3'>
                    <span className='text-muted-foreground text-sm'>
                      Bulk actions for {filterCategory} confidence addons
                    </span>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleBulkApprove(filterCategory as any)}
                      disabled={filterCategory === 'low'}
                    >
                      <CheckCircle2 className='mr-2 h-3 w-3' />
                      Approve All
                    </Button>
                  </div>
                )}

                <ScrollArea className='h-[600px]'>
                  <div className='space-y-3 pr-4'>
                    {filteredAddons.length === 0 ? (
                      <Card>
                        <CardContent className='flex flex-col items-center justify-center py-8'>
                          <Package className='text-muted-foreground mb-3 h-12 w-12' />
                          <p className='text-muted-foreground text-sm'>No addons in queue</p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredAddons.map((addon) => <QueueCard key={addon.$id} addon={addon} />)
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        {selectedAddon ? (
          <>
            <ValidationScore
              score={selectedAddon.validationScore!}
              onApprove={() => onApprove(selectedAddon)}
              onReject={() => onReject(selectedAddon)}
              onRequestReview={() => onReview(selectedAddon)}
            />

            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button
                  className='w-full justify-start'
                  variant='outline'
                  onClick={() => onReview(selectedAddon)}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  Full Review
                </Button>
                <Button
                  className='w-full justify-start'
                  variant='outline'
                  onClick={() => window.open(selectedAddon.sources?.[0], '_blank')}
                  disabled={!selectedAddon.sources?.length}
                >
                  <ExternalLink className='mr-2 h-4 w-4' />
                  View Source
                </Button>
                <Button className='w-full justify-start' variant='outline'>
                  <Download className='mr-2 h-4 w-4' />
                  Download Files
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Addon Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Author</span>
                  <span>{selectedAddon.author}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Downloads</span>
                  <span>{selectedAddon.downloads?.toLocaleString() || 0}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>MC Versions</span>
                  <span>{selectedAddon.minecraft_versions?.length || 0}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Loaders</span>
                  <span>{selectedAddon.loaders?.join(', ') || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <AlertCircle className='text-muted-foreground mb-3 h-12 w-12' />
              <p className='text-muted-foreground text-center text-sm'>
                Select an addon from the queue to view details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
