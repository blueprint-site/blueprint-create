import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserStore } from '@/api/stores/userStore';
import { useBlogTags, useCreateBlogTag, useDeleteBlogTag } from '@/api';
import { useBlogEditor } from './hooks/useBlogEditor';
import { BlogEditorPreview } from './BlogEditorPreview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Loader2, 
  Eye, 
  ArrowLeft,
  Settings2,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Tags,
  FileText
} from 'lucide-react';
import { FullScreenMarkdownEditor } from './FullScreenMarkdownEditor';
import ImageUploader from '@/components/utility/ImageUploader';
import TagSelector from '@/components/utility/TagSelector';
import styles from './BlogEditorFullScreen.module.css';

export const BlogEditorFullScreenV2 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsFullScreen] = useState(false);
  
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

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      autoSaveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoSaveDraft]);

  // Full screen API
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

  // Generate slug
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
      <div className='h-screen w-screen flex items-center justify-center'>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-96 w-[600px]' />
        </div>
      </div>
    );
  }

  // Error state
  if (!user) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertDescription>
            You must be logged in to create or edit blog posts.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.fullScreenEditor}>
      {/* Compact Header */}
      <header className='h-11 border-b flex items-center justify-between px-3 bg-background/80 backdrop-blur'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2'
            onClick={() => navigate('/admin/blogs')}
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back
          </Button>
          
          {isDirty && (
            <Badge variant='outline' className='text-xs h-5'>
              Unsaved
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2'
            onClick={() => navigate(`/admin/blogs/editor/${id}`)}
          >
            <Minimize2 className='h-4 w-4 mr-1' />
            <span className='hidden sm:inline'>Standard</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2 hidden md:inline-flex'
            onClick={toggleFullScreen}
          >
            <Maximize2 className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Settings2 className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2'
            onClick={handlePreview}
            disabled={!blogState?.content}
          >
            <Eye className='h-4 w-4' />
          </Button>
          
          <Button 
            size='sm'
            className='h-8 px-3 ml-2'
            onClick={handleSave} 
            disabled={isSaving || !blogState?.title || !blogState?.content}
          >
            {isSaving ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <>
                <Save className='h-3 w-3 mr-1' />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Editor */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Title */}
        <div className='px-6 py-3 flex-shrink-0 border-b'>
          <input
            type='text'
            value={blogState?.title || ''}
            onChange={handleTitleChange}
            placeholder='Enter your blog title...'
            className='w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30'
            name='title'
          />
        </div>

        {/* Content Editor - Must fill remaining space */}
        <div className='flex-1 overflow-hidden'>
          <FullScreenMarkdownEditor
            value={blogState?.content ?? ''}
            onChange={(value) => handleFieldChange('content', value ?? undefined)}
            placeholder='Start writing your blog post...'
          />
        </div>
      </main>

      {/* Settings Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side='right' className='w-[380px] p-0'>
          <SheetHeader className='px-4 py-3 border-b'>
            <SheetTitle className='text-base'>Post Settings</SheetTitle>
          </SheetHeader>
          
          <ScrollArea className='h-[calc(100vh-3.5rem)]'>
            <Tabs defaultValue='details' className='w-full'>
              <TabsList className='grid w-full grid-cols-3 mx-4 mt-3' style={{ width: 'calc(100% - 2rem)' }}>
                <TabsTrigger value='details' className='text-xs'>
                  <FileText className='h-3 w-3 mr-1' />
                  Details
                </TabsTrigger>
                <TabsTrigger value='media' className='text-xs'>
                  <ImageIcon className='h-3 w-3 mr-1' />
                  Media
                </TabsTrigger>
                <TabsTrigger value='tags' className='text-xs'>
                  <Tags className='h-3 w-3 mr-1' />
                  Tags
                </TabsTrigger>
              </TabsList>

              <div className='px-4 py-3'>
                <TabsContent value='details' className='space-y-3 mt-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='slug' className='text-xs'>URL Slug</Label>
                    <Input
                      id='slug'
                      name='slug'
                      value={blogState?.slug || ''}
                      onChange={handleInputChange}
                      placeholder='auto-generated-from-title'
                      className='h-8 text-sm'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='status' className='text-xs'>Status</Label>
                    <Select
                      value={blogState?.status || 'draft'}
                      onValueChange={(value) => handleFieldChange('status', value as 'draft' | 'published')}
                    >
                      <SelectTrigger id='status' className='h-8 text-sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>Draft</SelectItem>
                        <SelectItem value='published'>Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value='media' className='space-y-3 mt-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Cover Image</Label>
                    <ImageUploader
                      value={blogState?.img_url}
                      onChange={(base64) => handleFieldChange('img_url', base64 ?? undefined)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='tags' className='space-y-3 mt-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Tags</Label>
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