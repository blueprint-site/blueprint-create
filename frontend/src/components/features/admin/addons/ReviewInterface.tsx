import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MessageSquare,
  Flag,
  ExternalLink,
  Package,
  SkipForward,
  Keyboard,
  Zap,
  History,
  Loader2,
} from 'lucide-react';
import { ValidationScore } from './ValidationScore';
import type { AddonWithParsedFields } from '@/types/addons/addon-details';
import { addonValidator } from '@/utils/validation/addonValidator';

import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/useToast';
import { Progress } from '@/components/ui/progress.tsx';
import { cn } from '@/config/utils.ts';

interface ReviewInterfaceProps {
  addons: AddonWithParsedFields[];
  currentIndex: number;
  onApprove: (addon: AddonWithParsedFields, notes?: string) => Promise<void>;
  onReject: (addon: AddonWithParsedFields, reason: string) => Promise<void>;
  onSkip: (addon: AddonWithParsedFields) => void;
  onFlag: (addon: AddonWithParsedFields, reason: string) => void;
  onNavigate: (index: number) => void;
  onClose?: () => void;
}

interface ReviewNote {
  id: string;
  action: 'approved' | 'rejected' | 'flagged' | 'note';
  message: string;
  timestamp: string;
  author: string;
}

export function ReviewInterface({
  addons,
  currentIndex,
  onApprove,
  onReject,
  onSkip,
  onFlag,
  onNavigate,
  onClose,
}: ReviewInterfaceProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<ReviewNote[]>([]);
  const [showNotes, setShowNotes] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentAddon = addons[currentIndex];
  const validationScore = currentAddon ? addonValidator.validateAddon(currentAddon) : null;

  const keyboardShortcuts = [
    { key: 'A', action: 'Approve', icon: <CheckCircle2 className='h-3 w-3' /> },
    { key: 'R', action: 'Reject', icon: <XCircle className='h-3 w-3' /> },
    { key: 'S', action: 'Skip', icon: <SkipForward className='h-3 w-3' /> },
    { key: 'F', action: 'Flag', icon: <Flag className='h-3 w-3' /> },
    { key: '←', action: 'Previous', icon: <ChevronLeft className='h-3 w-3' /> },
    { key: '→', action: 'Next', icon: <ChevronRight className='h-3 w-3' /> },
    { key: 'N', action: 'Add Note', icon: <MessageSquare className='h-3 w-3' /> },
    { key: 'Space', action: 'Auto-Approve', icon: <Zap className='h-3 w-3' /> },
    { key: 'Esc', action: 'Exit', icon: <Minimize2 className='h-3 w-3' /> },
    { key: '?', action: 'Help', icon: <Keyboard className='h-3 w-3' /> },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
          if (!e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            handleApprove();
          }
          break;
        case 'r':
          if (!e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            setShowRejectDialog(true);
          }
          break;
        case 's':
          if (!e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            handleSkip();
          }
          break;
        case 'f':
          if (!e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            setShowFlagDialog(true);
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'arrowright':
          e.preventDefault();
          if (currentIndex < addons.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        case 'n':
          if (!e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            setShowNotes(true);
          }
          break;
        case ' ':
          e.preventDefault();
          if (validationScore?.autoApprovalReady) {
            handleApprove();
          }
          break;
        case 'escape':
          e.preventDefault();
          if (fullscreen) {
            setFullscreen(false);
          } else if (onClose) {
            onClose();
          }
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, validationScore, fullscreen]);

  const handleApprove = async () => {
    if (!currentAddon || processing) return;

    setProcessing(true);
    try {
      await onApprove(currentAddon, notes);

      setReviewHistory([
        ...reviewHistory,
        {
          id: Date.now().toString(),
          action: 'approved',
          message: notes || 'Approved',
          timestamp: new Date().toISOString(),
          author: 'Admin',
        },
      ]);

      toast({
        title: 'Addon Approved',
        description: `${currentAddon.name} has been approved`,
      });

      setNotes('');

      if (currentIndex < addons.length - 1) {
        onNavigate(currentIndex + 1);
      }
    } catch (error) {
      toast({
        title: 'Approval Failed',
        description: 'Could not approve the addon',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentAddon || !rejectReason || processing) return;

    setProcessing(true);
    try {
      await onReject(currentAddon, rejectReason);

      setReviewHistory([
        ...reviewHistory,
        {
          id: Date.now().toString(),
          action: 'rejected',
          message: rejectReason,
          timestamp: new Date().toISOString(),
          author: 'Admin',
        },
      ]);

      toast({
        title: 'Addon Rejected',
        description: `${currentAddon.name} has been rejected`,
      });

      setRejectReason('');
      setShowRejectDialog(false);

      if (currentIndex < addons.length - 1) {
        onNavigate(currentIndex + 1);
      }
    } catch (error) {
      toast({
        title: 'Rejection Failed',
        description: 'Could not reject the addon',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSkip = () => {
    if (!currentAddon) return;

    onSkip(currentAddon);

    if (currentIndex < addons.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleFlag = () => {
    if (!currentAddon || !flagReason) return;

    onFlag(currentAddon, flagReason);

    setReviewHistory([
      ...reviewHistory,
      {
        id: Date.now().toString(),
        action: 'flagged',
        message: flagReason,
        timestamp: new Date().toISOString(),
        author: 'Admin',
      },
    ]);

    toast({
      title: 'Addon Flagged',
      description: `${currentAddon.name} has been flagged for review`,
    });

    setFlagReason('');
    setShowFlagDialog(false);
  };

  if (!currentAddon) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <Package className='text-muted-foreground mb-3 h-12 w-12' />
          <p className='text-muted-foreground'>No addons to review</p>
        </CardContent>
      </Card>
    );
  }

  const ReviewContent = () => (
    <div className='grid h-full grid-cols-1 gap-4 lg:grid-cols-3'>
      <div className='space-y-4 lg:col-span-2'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {currentAddon.icon ? (
                  <img
                    src={currentAddon.icon}
                    alt={currentAddon.name}
                    className='h-12 w-12 rounded-lg'
                  />
                ) : (
                  <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Package className='text-muted-foreground h-6 w-6' />
                  </div>
                )}
                <div>
                  <CardTitle>{currentAddon.name}</CardTitle>
                  <CardDescription>by {currentAddon.authors[0]}</CardDescription>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>
                  {currentIndex + 1} / {addons.length}
                </Badge>
                <Button variant='ghost' size='icon' onClick={() => setFullscreen(!fullscreen)}>
                  {fullscreen ? (
                    <Minimize2 className='h-4 w-4' />
                  ) : (
                    <Maximize2 className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='details'>
              <TabsList>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='description'>Description</TabsTrigger>
                <TabsTrigger value='technical'>Technical</TabsTrigger>
                <TabsTrigger value='history'>History</TabsTrigger>
              </TabsList>

              <TabsContent value='details' className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Categories</Label>
                    <div className='flex flex-wrap gap-1'>
                      {currentAddon.categories?.map((cat, idx) => (
                        <Badge key={idx} variant='secondary'>
                          {cat}
                        </Badge>
                      )) || <span className='text-muted-foreground text-sm'>None</span>}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Downloads</Label>
                    <p className='text-sm'>{currentAddon.downloads?.toLocaleString() || 0}</p>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Created</Label>
                    <p className='text-sm'>
                      {formatDistanceToNow(new Date(currentAddon.$createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Status</Label>
                    <div className='flex gap-2'>
                      {currentAddon.isValid ? (
                        <Badge className='bg-green-600'>Approved</Badge>
                      ) : currentAddon.isChecked ? (
                        <Badge variant='destructive'>Rejected</Badge>
                      ) : (
                        <Badge variant='secondary'>Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {currentAddon.sources && currentAddon.sources.length > 0 && (
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Sources</Label>
                    <div className='flex gap-2'>
                      {currentAddon.sources.map((source, idx) => (
                        <Button
                          key={idx}
                          variant='outline'
                          size='sm'
                          onClick={() => window.open(source, '_blank')}
                        >
                          <ExternalLink className='mr-2 h-3 w-3' />
                          {source.includes('curseforge')
                            ? 'CurseForge'
                            : source.includes('modrinth')
                              ? 'Modrinth'
                              : 'Source'}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='description' className='space-y-4'>
                <ScrollArea className='h-[400px] w-full rounded-md border p-4'>
                  <p className='text-sm whitespace-pre-wrap'>
                    {currentAddon.description || 'No description provided'}
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent value='technical' className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Minecraft Versions</Label>
                    <div className='flex flex-wrap gap-1'>
                      {currentAddon.minecraft_versions?.map((version, idx) => (
                        <Badge key={idx} variant='outline'>
                          {version}
                        </Badge>
                      )) || <span className='text-muted-foreground text-sm'>None specified</span>}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Create Versions</Label>
                    <div className='flex flex-wrap gap-1'>
                      {currentAddon.create_versions?.map((version, idx) => (
                        <Badge key={idx} variant='outline'>
                          {version}
                        </Badge>
                      )) || <span className='text-muted-foreground text-sm'>None specified</span>}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Mod Loaders</Label>
                    <div className='flex flex-wrap gap-1'>
                      {currentAddon.loaders?.map((loader, idx) => (
                        <Badge key={idx} variant='outline'>
                          {loader}
                        </Badge>
                      )) || <span className='text-muted-foreground text-sm'>None specified</span>}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-muted-foreground'>Addon ID</Label>
                    <p className='font-mono text-sm'>{currentAddon.$id}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='history' className='space-y-4'>
                <ScrollArea className='h-[400px] w-full'>
                  {reviewHistory.length > 0 ? (
                    <div className='space-y-2'>
                      {reviewHistory.map((note) => (
                        <div key={note.id} className='bg-muted/50 space-y-1 rounded-lg p-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              {note.action === 'approved' && (
                                <CheckCircle2 className='h-4 w-4 text-green-500' />
                              )}
                              {note.action === 'rejected' && (
                                <XCircle className='h-4 w-4 text-red-500' />
                              )}
                              {note.action === 'flagged' && (
                                <Flag className='h-4 w-4 text-yellow-500' />
                              )}
                              {note.action === 'note' && (
                                <MessageSquare className='h-4 w-4 text-blue-500' />
                              )}
                              <span className='text-sm font-medium capitalize'>{note.action}</span>
                            </div>
                            <span className='text-muted-foreground text-xs'>
                              {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className='text-muted-foreground text-sm'>{note.message}</p>
                          <p className='text-muted-foreground text-xs'>by {note.author}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center py-8'>
                      <History className='text-muted-foreground mb-2 h-8 w-8' />
                      <p className='text-muted-foreground text-sm'>No review history</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Review Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='space-y-2'>
                <Label htmlFor='notes'>Review Notes (Optional)</Label>
                <Textarea
                  id='notes'
                  placeholder='Add notes about this review...'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Button
                  className='bg-green-600 hover:bg-green-700'
                  onClick={handleApprove}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <CheckCircle2 className='mr-2 h-4 w-4' />
                  )}
                  Approve (A)
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => setShowRejectDialog(true)}
                  disabled={processing}
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reject (R)
                </Button>
                <Button variant='outline' onClick={handleSkip} disabled={processing}>
                  <SkipForward className='mr-2 h-4 w-4' />
                  Skip (S)
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setShowFlagDialog(true)}
                  disabled={processing}
                >
                  <Flag className='mr-2 h-4 w-4' />
                  Flag (F)
                </Button>
              </div>

              {validationScore?.autoApprovalReady && (
                <Button
                  className='w-full'
                  variant='default'
                  onClick={handleApprove}
                  disabled={processing}
                >
                  <Zap className='mr-2 h-4 w-4' />
                  Auto-Approve (Space)
                </Button>
              )}

              <Separator />

              <div className='flex justify-between'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onNavigate(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className='mr-2 h-4 w-4' />
                  Previous
                </Button>
                <Button variant='ghost' size='sm' onClick={() => setShowKeyboardHelp(true)}>
                  <Keyboard className='mr-2 h-4 w-4' />
                  Shortcuts
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onNavigate(currentIndex + 1)}
                  disabled={currentIndex === addons.length - 1}
                >
                  Next
                  <ChevronRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        {validationScore && <ValidationScore score={validationScore} showActions={false} />}

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Slug</span>
              <span className='font-mono'>{currentAddon.slug}</span>
            </div>
            <Separator />
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Author</span>
              <span>{currentAddon.authors[0]}</span>
            </div>
            <Separator />
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Downloads</span>
              <span>{currentAddon.downloads?.toLocaleString() || 0}</span>
            </div>
            <Separator />
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Categories</span>
              <span>{currentAddon.categories?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Review Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Progress</span>
                <span>
                  {currentIndex + 1} / {addons.length}
                </span>
              </div>
              <Progress value={((currentIndex + 1) / addons.length) * 100} />
              <p className='text-muted-foreground text-xs'>
                {addons.length - currentIndex - 1} remaining
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'transition-all duration-300',
          fullscreen && 'bg-background fixed inset-0 z-50 p-4'
        )}
      >
        {fullscreen ? (
          <ScrollArea className='h-full'>
            <ReviewContent />
          </ScrollArea>
        ) : (
          <ReviewContent />
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Addon</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {currentAddon?.name}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <Textarea
              placeholder='Enter rejection reason...'
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setRejectReason('Not a Create mod addon')}
              >
                Not Create Addon
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setRejectReason('Incomplete information')}
              >
                Incomplete Info
              </Button>
              <Button variant='outline' size='sm' onClick={() => setRejectReason('Quality issues')}>
                Quality Issues
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleReject}
              disabled={!rejectReason || processing}
            >
              {processing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Rejecting...
                </>
              ) : (
                'Reject Addon'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Addon</DialogTitle>
            <DialogDescription>Flag {currentAddon?.name} for additional review</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <Textarea
              placeholder='Enter flag reason...'
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              rows={4}
            />
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setFlagReason('Needs second opinion')}
              >
                Second Opinion
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setFlagReason('Potential policy violation')}
              >
                Policy Violation
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setFlagReason('Technical review needed')}
              >
                Technical Review
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFlag} disabled={!flagReason}>
              Flag Addon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Quick actions for faster review</DialogDescription>
          </DialogHeader>
          <div className='space-y-2'>
            {keyboardShortcuts.map((shortcut) => (
              <div key={shortcut.key} className='flex items-center justify-between py-2'>
                <div className='flex items-center gap-2'>
                  {shortcut.icon}
                  <span className='text-sm'>{shortcut.action}</span>
                </div>
                <kbd className='bg-muted rounded px-2 py-1 text-xs'>{shortcut.key}</kbd>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowKeyboardHelp(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
