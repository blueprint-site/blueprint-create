import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useUserStore } from '@/api/stores/userStore';
import { useBlogTags, useCreateBlogTag, useDeleteBlogTag } from '@/api';
import { useBlogEditor } from './hooks/useBlogEditor';
import { BlogEditorPreview } from './BlogEditorPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Save,
  Loader2,
  Eye,
  ArrowLeft,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  FileText,
  Image as ImageIcon,
  Tags,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import ImageUploader from '@/components/utility/ImageUploader';
import TagSelector from '@/components/utility/TagSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

export const BlogEditorFullScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

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

  // Full screen toggle
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    if (!blogState?.slug || blogState.slug === '') {
      handleFieldChange('slug', generateSlug(e.target.value));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='bg-background flex h-screen w-screen items-center justify-center'>
        <div className='w-full max-w-2xl space-y-4 p-8'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    );
  }

  // Error state - no user
  if (!user) {
    return (
      <div className='bg-background flex h-screen w-screen items-center justify-center'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertDescription>You must be logged in to create or edit blog posts.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='bg-background flex h-screen w-screen flex-col overflow-hidden'>
      {/* Minimal Header Bar */}
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-12 flex-shrink-0 items-center justify-between border-b px-3 backdrop-blur'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/admin/blogs')}
            disabled={isSaving}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-2'>
            <FileText className='text-muted-foreground h-4 w-4' />
            <span className='text-sm font-medium'>{isNew ? 'New Post' : 'Edit Post'}</span>
            {blogState?.title && (
              <>
                <span className='text-muted-foreground'>·</span>
                <span className='text-muted-foreground max-w-[200px] truncate text-sm'>
                  {blogState.title}
                </span>
              </>
            )}
          </div>

          {isDirty && (
            <Badge variant='outline' className='text-xs'>
              Unsaved changes
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/admin/blogs/editor/${id}`)}
            title='Regular Editor'
          >
            <Minimize2 className='h-4 w-4' />
            <span className='ml-2 hidden sm:inline'>Regular View</span>
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={toggleFullScreen}
            className='hidden md:inline-flex'
            title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullScreen ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? 'Close Settings' : 'Open Settings'}
          >
            {isSidebarOpen ? (
              <PanelRightClose className='h-4 w-4' />
            ) : (
              <PanelRightOpen className='h-4 w-4' />
            )}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={handlePreview}
            disabled={isSaving || !blogState?.content}
          >
            <Eye className='h-4 w-4' />
            <span className='ml-2 hidden sm:inline'>Preview</span>
          </Button>

          <Button
            size='sm'
            onClick={handleSave}
            disabled={isSaving || !blogState?.title || !blogState?.content}
          >
            {isSaving ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span className='ml-2 hidden sm:inline'>Saving...</span>
              </>
            ) : (
              <>
                <Save className='h-4 w-4' />
                <span className='ml-2 hidden sm:inline'>{isNew ? 'Create' : 'Save'}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Editor Area - Takes full width when sidebar is closed */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          {/* Title Input - Minimal height */}
          <div className='flex-shrink-0 px-6 py-2'>
            <Input
              value={blogState?.title || ''}
              onChange={handleTitleChange}
              placeholder='Enter your blog title...'
              className='placeholder:text-muted-foreground/40 border-0 bg-transparent p-0 text-3xl font-bold shadow-none focus-visible:ring-0'
              name='title'
            />
          </div>

          {/* Markdown Editor - Takes remaining space */}
          <div className='flex-1 overflow-hidden px-2'>
            <MarkdownEditor
              value={blogState?.content ?? ''}
              onChange={(value) => handleFieldChange('content', value ?? undefined)}
              className='h-full'
              placeholder='Start writing your blog post...'
              showDiffSource={false}
            />
          </div>
        </div>

        {/* Collapsible Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side='right' className='w-[400px] p-0 sm:w-[480px]'>
            <SheetHeader className='border-b px-6 py-4'>
              <SheetTitle>Post Settings</SheetTitle>
            </SheetHeader>

            <ScrollArea className='h-[calc(100vh-5rem)]'>
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='mt-4 grid w-full grid-cols-3 px-6'>
                  <TabsTrigger value='details'>
                    <Info className='mr-2 h-4 w-4' />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value='media'>
                    <ImageIcon className='mr-2 h-4 w-4' />
                    Media
                  </TabsTrigger>
                  <TabsTrigger value='tags'>
                    <Tags className='mr-2 h-4 w-4' />
                    Tags
                  </TabsTrigger>
                </TabsList>

                <div className='px-6 py-4'>
                  <TabsContent value='details' className='mt-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='slug'>URL Slug</Label>
                      <Input
                        id='slug'
                        name='slug'
                        value={blogState?.slug || ''}
                        onChange={handleInputChange}
                        placeholder='auto-generated-from-title'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='status'>Publication Status</Label>
                      <Select
                        value={blogState?.status || 'draft'}
                        onValueChange={(value) =>
                          handleFieldChange('status', value as 'draft' | 'published')
                        }
                      >
                        <SelectTrigger id='status'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='draft'>
                            <div className='flex items-center'>
                              <div className='mr-2 h-2 w-2 rounded-full bg-yellow-500' />
                              Draft
                            </div>
                          </SelectItem>
                          <SelectItem value='published'>
                            <div className='flex items-center'>
                              <div className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                              Published
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>Author</Label>
                      <div className='text-muted-foreground text-sm'>{user.name || user.email}</div>
                    </div>

                    {blogState?.$createdAt && (
                      <div className='space-y-2'>
                        <Label>Created</Label>
                        <div className='text-muted-foreground text-sm'>
                          {new Date(blogState.$createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value='media' className='mt-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label>Cover Image</Label>
                      <p className='text-muted-foreground mb-3 text-sm'>
                        This image will be displayed as the blog post&apos;s cover
                      </p>
                      <ImageUploader
                        value={blogState?.img_url}
                        onChange={(base64) => handleFieldChange('img_url', base64 ?? undefined)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value='tags' className='mt-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label>Tags</Label>
                      <p className='text-muted-foreground mb-3 text-sm'>
                        Add tags to help readers find your content
                      </p>
                      <TagSelector
                        tags={blogTags}
                        selectedTags={blogState?.tags || []}
                        isLoading={isLoadingTags}
                        onCreate={createTagMutation.mutateAsync}
                        onDelete={deleteTagMutation.mutateAsync}
                        onChange={handleTagsChange}
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </ScrollArea>
          </SheetContent>
        </Sheet>
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
