import React, { useState } from 'react';
import { MessageSquare, Camera, Send, AlertTriangle, Lightbulb, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFeedback } from '@/hooks/useFeedback';
import type { FeedbackType } from '@/types/feedback';
import { Input } from '@/components/ui/input';

// Feedback types
const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', icon: AlertTriangle, color: 'text-red-500' },
  { value: 'suggestion', label: 'Feature Suggestion', icon: Lightbulb, color: 'text-yellow-500' },
  { value: 'usability', label: 'Usability Issue', icon: Wrench, color: 'text-blue-500' },
] as const;

interface FeedbackWidgetProps {
  renderAsIconButton?: boolean;
}

export const FeedbackWidget = ({ renderAsIconButton = false }: FeedbackWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { submitFeedback, loading, error } = useFeedback();

  // Capture contextual info
  const context = {
    url: window.location.href,
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await submitFeedback({
        type: feedbackType,
        message: message.trim(),
        url: context.url,
        screenshot,
      });

      // Reset form and close dialog
      setOpen(false);
      setMessage('');
      setScreenshot(null);
      setFeedbackType('bug');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  // Render helper instead of inline component to avoid remount on each keystroke
  const renderFeedbackDialogContent = () => (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle className='flex items-center gap-2'>
          <MessageSquare className='h-5 w-5' />
          Send Feedback
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label>Feedback Type</Label>
          <Select
            value={feedbackType}
            onValueChange={(value: FeedbackType) => setFeedbackType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select feedback type' />
            </SelectTrigger>
            <SelectContent>
              {FEEDBACK_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className='flex items-center gap-2'>
                      <Icon className={`h-4 w-4 ${type.color}`} />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Message</Label>
          <Textarea
            id='message'
            placeholder='Describe the issue or suggestion...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label>Screenshot (optional)</Label>
          <div className='flex items-center gap-2'>
            <Input
              id='screenshot'
              type='file'
              accept='image/*'
              onChange={handleScreenshot}
              className='file:bg-muted file:mr-2 file:rounded-md file:border-0 file:px-2 file:py-1 file:text-xs'
            />
            {screenshot && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Camera className='h-3 w-3' />
                {screenshot.name}
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-4 w-4 p-0 hover:bg-transparent'
                  onClick={() => setScreenshot(null)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            )}
          </div>
        </div>

        <div className='text-muted-foreground text-xs'>
          <p>Current page: {context.url}</p>
        </div>

        {error && (
          <div className='rounded bg-red-50 p-2 text-sm text-red-600'>
            Failed to submit feedback. Please try again.
          </div>
        )}

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type='submit' disabled={loading || !message.trim()}>
            {loading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current' />
                Sending...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Send Feedback
              </>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (renderAsIconButton) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-foreground'>
            <MessageSquare className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        {renderFeedbackDialogContent()}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full shadow-lg'
          size='icon'
        >
          <MessageSquare className='h-5 w-5' />
        </Button>
      </DialogTrigger>
      {renderFeedbackDialogContent()}
    </Dialog>
  );
};
