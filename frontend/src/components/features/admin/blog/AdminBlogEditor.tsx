import { useParams } from 'react-router';
import { useUserStore } from '@/api/stores/userStore';
import { useBlogTags, useCreateBlogTag, useDeleteBlogTag } from '@/api';
import { useBlogEditor } from './hooks/useBlogEditor';
import { BlogEditorHeader } from './BlogEditorHeader';
import { BlogEditorForm } from './BlogEditorForm';
import { BlogEditorPreview } from './BlogEditorPreview';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect } from 'react';

export const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const user = useUserStore((state) => state.user);

  // Blog tags management
  const { data: blogTags = [], isLoading: isLoadingTags } = useBlogTags();
  const createTagMutation = useCreateBlogTag();
  const deleteTagMutation = useDeleteBlogTag();

  // Blog editor hook
  const {
    blogState,
    isLoading,
    isSaving,
    isDirty,
    isNew,
    isPreviewOpen,
    handleFieldChange,
    handleInputChange,
    handleTagsChange,
    handleSave,
    handlePreview,
    handleClosePreview,
    autoSaveDraft,
  } = useBlogEditor({
    blogId: id,
    userId: user?.$id,
    userName: user?.name,
  });

  // Auto-save every 30 seconds for drafts
  useEffect(() => {
    const interval = setInterval(() => {
      autoSaveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSaveDraft]);

  // Loading state
  if (isLoading) {
    return (
      <div className='h-full w-full space-y-4 p-4'>
        <Skeleton className='h-16 w-full' />
        <div className='grid gap-4 md:grid-cols-2'>
          <Skeleton className='h-64' />
          <Skeleton className='h-64' />
        </div>
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  // Error state - no user
  if (!user) {
    return (
      <Alert variant='destructive' className='m-4'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>You must be logged in to create or edit blog posts.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='flex h-full w-full flex-col'>
      {/* Fixed Header */}
      <BlogEditorHeader
        blogState={blogState}
        isNew={isNew}
        isSaving={isSaving}
        onSave={handleSave}
        onPreview={handlePreview}
      />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='container mx-auto max-w-5xl p-4 pb-8'>
          {isDirty && (
            <Alert className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                You have unsaved changes. Remember to save your work!
              </AlertDescription>
            </Alert>
          )}

          <BlogEditorForm
            blogState={blogState}
            blogTags={blogTags}
            isLoadingTags={isLoadingTags}
            onFieldChange={handleFieldChange}
            onInputChange={handleInputChange}
            onTagsChange={handleTagsChange}
            onCreateTag={createTagMutation.mutateAsync}
            onDeleteTag={deleteTagMutation.mutateAsync}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <BlogEditorPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        blogState={blogState}
        currentUser={user}
      />
    </div>
  );
};
