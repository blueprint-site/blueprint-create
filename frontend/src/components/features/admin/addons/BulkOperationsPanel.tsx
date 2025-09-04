import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle2,
  XCircle,
  Archive,
  Tag,
  Download,
  Upload,
  Trash2,
  Edit,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  Loader2,
  Users,
  Shield,
  Zap,
  FileDown,
  Settings,
  RefreshCw,
} from 'lucide-react';
import type { Addon } from '@/types';
import { cn } from '@/config/utils';
import { toast } from '@/hooks/useToast';
import { addonValidator } from '@/utils/validation/addonValidator';

interface BulkOperationsPanelProps {
  selectedAddons: Addon[];
  onApprove: (addonIds: string[]) => Promise<void>;
  onReject: (addonIds: string[]) => Promise<void>;
  onDelete: (addonIds: string[]) => Promise<void>;
  onUpdateCategory: (addonIds: string[], categories: string[]) => Promise<void>;
  onUpdateTags: (addonIds: string[], tags: string[]) => Promise<void>;
  onExport: (addonIds: string[]) => void;
  onClearSelection: () => void;
  totalAddons: number;
}

export function BulkOperationsPanel({
  selectedAddons,
  onApprove,
  onReject,
  onDelete,
  onUpdateCategory,
  onUpdateTags,
  onExport,
  onClearSelection,
  totalAddons,
}: BulkOperationsPanelProps) {
  const [processing, setProcessing] = useState(false);
  const [operationProgress, setOperationProgress] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | 'delete' | null;
    count: number;
  }>({ open: false, action: null, count: 0 });
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tagDialog, setTagDialog] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'create-addon',
    'automation',
    'trains',
    'decoration',
    'storage',
    'technology',
    'utility',
    'adventure',
    'magic',
    'optimization',
  ];

  const stats = useMemo(() => {
    const validatedAddons = selectedAddons.map((addon) => ({
      ...addon,
      score: addonValidator.validateAddon(addon as any),
    }));

    return {
      high: validatedAddons.filter((a) => a.score.confidence === 'high').length,
      medium: validatedAddons.filter((a) => a.score.confidence === 'medium').length,
      low: validatedAddons.filter((a) => a.score.confidence === 'low').length,
      approved: selectedAddons.filter((a) => a.isValid).length,
      rejected: selectedAddons.filter((a) => !a.isValid && a.isChecked).length,
      pending: selectedAddons.filter((a) => !a.isChecked).length,
    };
  }, [selectedAddons]);

  const handleBulkOperation = async (action: 'approve' | 'reject' | 'delete') => {
    setProcessing(true);
    setOperationProgress(0);

    const ids = selectedAddons.map((a) => a.$id);
    const chunkSize = 10;
    const chunks = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      chunks.push(ids.slice(i, i + chunkSize));
    }

    try {
      for (let i = 0; i < chunks.length; i++) {
        switch (action) {
          case 'approve':
            await onApprove(chunks[i]);
            break;
          case 'reject':
            await onReject(chunks[i]);
            break;
          case 'delete':
            await onDelete(chunks[i]);
            break;
        }
        setOperationProgress(((i + 1) / chunks.length) * 100);
      }

      toast({
        title: 'Operation Completed',
        description: `Successfully ${action}ed ${ids.length} addons`,
      });

      onClearSelection();
    } catch (error) {
      toast({
        title: 'Operation Failed',
        description: `Failed to ${action} some addons`,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      setOperationProgress(0);
      setConfirmDialog({ open: false, action: null, count: 0 });
    }
  };

  const handleCategoryUpdate = async () => {
    if (selectedCategories.length === 0) return;

    setProcessing(true);
    try {
      await onUpdateCategory(
        selectedAddons.map((a) => a.$id),
        selectedCategories
      );

      toast({
        title: 'Categories Updated',
        description: `Updated categories for ${selectedAddons.length} addons`,
      });

      setCategoryDialog(false);
      setSelectedCategories([]);
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update categories',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleTagUpdate = async () => {
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) return;

    setProcessing(true);
    try {
      await onUpdateTags(
        selectedAddons.map((a) => a.$id),
        tags
      );

      toast({
        title: 'Tags Updated',
        description: `Added ${tags.length} tags to ${selectedAddons.length} addons`,
      });

      setTagDialog(false);
      setTagInput('');
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update tags',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleAutoApproval = async () => {
    const autoApprovalReady = selectedAddons.filter((addon) => {
      const score = addonValidator.validateAddon(addon as any);
      return score.autoApprovalReady;
    });

    if (autoApprovalReady.length === 0) {
      toast({
        title: 'No Auto-Approval Ready',
        description: 'None of the selected addons are ready for auto-approval',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      await onApprove(autoApprovalReady.map((a) => a.$id));

      toast({
        title: 'Auto-Approval Complete',
        description: `Auto-approved ${autoApprovalReady.length} addons`,
      });

      onClearSelection();
    } catch (error) {
      toast({
        title: 'Auto-Approval Failed',
        description: 'Failed to auto-approve addons',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (selectedAddons.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <Shield className='text-muted-foreground mb-3 h-8 w-8' />
          <p className='text-muted-foreground text-sm'>Select addons to perform bulk operations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>
                {selectedAddons.length} of {totalAddons} addons selected
              </CardDescription>
            </div>
            <Button variant='ghost' size='sm' onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {processing && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span>Processing...</span>
                <span>{Math.round(operationProgress)}%</span>
              </div>
              <Progress value={operationProgress} />
            </div>
          )}

          <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6'>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold'>{stats.high}</div>
              <div className='text-muted-foreground text-xs'>High Score</div>
            </div>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold'>{stats.medium}</div>
              <div className='text-muted-foreground text-xs'>Medium Score</div>
            </div>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold'>{stats.low}</div>
              <div className='text-muted-foreground text-xs'>Low Score</div>
            </div>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold text-green-600'>{stats.approved}</div>
              <div className='text-muted-foreground text-xs'>Approved</div>
            </div>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold text-red-600'>{stats.rejected}</div>
              <div className='text-muted-foreground text-xs'>Rejected</div>
            </div>
            <div className='bg-muted rounded p-2 text-center'>
              <div className='text-2xl font-bold text-yellow-600'>{stats.pending}</div>
              <div className='text-muted-foreground text-xs'>Pending</div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
            <Button
              variant='default'
              className='bg-green-600 hover:bg-green-700'
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: 'approve',
                  count: selectedAddons.length,
                })
              }
              disabled={processing}
            >
              <CheckCircle2 className='mr-2 h-4 w-4' />
              Approve All
            </Button>

            <Button
              variant='default'
              onClick={handleAutoApproval}
              disabled={processing || stats.high === 0}
            >
              <Zap className='mr-2 h-4 w-4' />
              Auto-Approve ({stats.high})
            </Button>

            <Button
              variant='destructive'
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: 'reject',
                  count: selectedAddons.length,
                })
              }
              disabled={processing}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Reject All
            </Button>

            <Button variant='outline' onClick={() => setCategoryDialog(true)} disabled={processing}>
              <Tag className='mr-2 h-4 w-4' />
              Set Categories
            </Button>

            <Button variant='outline' onClick={() => setTagDialog(true)} disabled={processing}>
              <Tag className='mr-2 h-4 w-4' />
              Add Tags
            </Button>

            <Button
              variant='outline'
              onClick={() => onExport(selectedAddons.map((a) => a.$id))}
              disabled={processing}
            >
              <FileDown className='mr-2 h-4 w-4' />
              Export
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='w-full'>
                <MoreHorizontal className='mr-2 h-4 w-4' />
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Advanced Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>
                <Archive className='mr-2 h-4 w-4' />
                Archive Selected
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Users className='mr-2 h-4 w-4' />
                Assign to User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <RefreshCw className='mr-2 h-4 w-4' />
                Revalidate
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                className='text-destructive'
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    action: 'delete',
                    count: selectedAddons.length,
                  })
                }
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete Selected
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} {confirmDialog.count} addons? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              This will affect {confirmDialog.count} addons permanently.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setConfirmDialog({ open: false, action: null, count: 0 })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
              onClick={() => handleBulkOperation(confirmDialog.action!)}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                `Confirm ${confirmDialog.action}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Categories</DialogTitle>
            <DialogDescription>
              Select categories to apply to {selectedAddons.length} addons
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            {categories.map((category) => (
              <label key={category} className='flex cursor-pointer items-center space-x-2'>
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((c) => c !== category));
                    }
                  }}
                />
                <span className='text-sm capitalize'>{category.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCategoryUpdate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update Categories'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tagDialog} onOpenChange={setTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Add tags to {selectedAddons.length} addons (comma-separated)
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <Input
              placeholder='tag1, tag2, tag3'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            {tagInput && (
              <div className='flex flex-wrap gap-2'>
                {tagInput.split(',').map(
                  (tag, idx) =>
                    tag.trim() && (
                      <Badge key={idx} variant='secondary'>
                        {tag.trim()}
                      </Badge>
                    )
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagUpdate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Adding...
                </>
              ) : (
                'Add Tags'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
