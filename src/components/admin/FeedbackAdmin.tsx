import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  ExternalLink,
  Eye,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Wrench,
} from 'lucide-react';
import { useFetchFeedback, useUpdateFeedbackStatus, useDeleteFeedback } from '@/api';
import type { FeedbackRecord } from '@/types/feedback';
import { format } from 'date-fns';

export const FeedbackAdmin = () => {
  const { data: feedback, isLoading, error } = useFetchFeedback();
  const updateStatusMutation = useUpdateFeedbackStatus();
  const deleteFeedbackMutation = useDeleteFeedback();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'suggestion':
        return <Lightbulb className='h-4 w-4 text-yellow-500' />;
      case 'usability':
        return <Wrench className='h-4 w-4 text-blue-500' />;
      default:
        return <MessageSquare className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = (
    id: string,
    status: 'open' | 'in-progress' | 'resolved' | 'closed'
  ) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      deleteFeedbackMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground mt-2 text-sm'>Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='mx-auto h-8 w-8 text-red-500' />
          <p className='mt-2 text-sm text-red-600'>Failed to load feedback</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: feedback?.length || 0,
    open: feedback?.filter((f) => f.status === 'open').length || 0,
    inProgress: feedback?.filter((f) => f.status === 'in-progress').length || 0,
    resolved: feedback?.filter((f) => f.status === 'resolved').length || 0,
  };

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
          <CardDescription>
            Manage and respond to user feedback, bug reports, and feature suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {feedback && feedback.length > 0 ? (
              feedback.map((item: FeedbackRecord) => (
                <div key={item.$id} className='space-y-3 rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      {getTypeIcon(item.type)}
                      <Badge variant='outline' className='capitalize'>
                        {item.type}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                      {item.url && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLink className='h-4 w-4' />
                        </Button>
                      )}
                      {item.screenshot && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => window.open(item.screenshot!, '_blank')}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      )}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(item.$id)}
                        disabled={deleteFeedbackMutation.isPending}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm'>{item.message}</p>
                  </div>

                  <div className='text-muted-foreground flex items-center justify-between text-xs'>
                    <span>Submitted {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}</span>
                    {item.url && (
                      <span className='font-mono text-xs'>{new URL(item.url).pathname}</span>
                    )}
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      variant={item.status === 'open' ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleStatusUpdate(item.$id, 'open')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Open
                    </Button>
                    <Button
                      variant={item.status === 'in-progress' ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleStatusUpdate(item.$id, 'in-progress')}
                      disabled={updateStatusMutation.isPending}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={item.status === 'resolved' ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleStatusUpdate(item.$id, 'resolved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Resolved
                    </Button>
                    <Button
                      variant={item.status === 'closed' ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleStatusUpdate(item.$id, 'closed')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Closed
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-8 text-center'>
                <MessageSquare className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <p className='text-muted-foreground'>No feedback submissions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
