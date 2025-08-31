import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { Blog, BlogTag } from '@/types';
import { useToast } from '@/hooks';
import { useFetchBlog, useSaveBlog } from '@/api';
import type { ChangeEvent } from 'react';

interface UseBlogEditorProps {
  blogId?: string;
  userId?: string;
  userName?: string;
}

export const useBlogEditor = ({ blogId, userId, userName }: UseBlogEditorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = blogId === 'new';
  
  const { data: blog, isLoading } = useFetchBlog(blogId);
  const saveBlogMutation = useSaveBlog();
  
  const [blogState, setBlogState] = useState<Partial<Blog> | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Initialize blog state
  useEffect(() => {
    if (!userId) return;

    if (blogId && !isNew && blog) {
      setBlogState(blog);
    } else if (isNew) {
      setBlogState({
        title: '',
        content: '',
        slug: '',
        img_url: '',
        status: 'draft',
        tags: [],
        likes: 0,
        authors_uuid: [userId],
        authors: [userName || ''],
      });
    }
  }, [blogId, blog, isNew, userId, userName]);

  // Handle field changes
  const handleFieldChange = useCallback((field: keyof Blog, value: Blog[keyof Blog]) => {
    setBlogState((prev) => {
      if (!prev) return null;
      setIsDirty(true);
      return { ...prev, [field]: value };
    });
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleFieldChange(name as keyof Blog, value);
  }, [handleFieldChange]);

  // Handle tags change
  const handleTagsChange = useCallback((selectedTags: BlogTag[]) => {
    handleFieldChange('tags', selectedTags);
  }, [handleFieldChange]);

  // Validate blog data
  const validateBlog = useCallback(() => {
    if (!blogState) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No blog data to save',
      });
      return false;
    }

    if (!blogState.title?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Blog title is required',
      });
      return false;
    }

    if (!blogState.content?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Blog content is required',
      });
      return false;
    }

    return true;
  }, [blogState, toast]);

  // Save blog
  const handleSave = useCallback(async () => {
    if (!validateBlog()) return;

    saveBlogMutation.mutate(blogState!, {
      onSuccess: (savedBlog) => {
        setIsDirty(false);
        toast({
          title: 'Success',
          description: `Blog "${blogState!.title}" has been saved successfully!`,
        });
        
        // If it was new, navigate to edit mode with the new ID
        if (isNew && savedBlog.$id) {
          navigate(`/admin/blogs/editor/${savedBlog.$id}`, { replace: true });
        }
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to save blog: ${error.message}`,
        });
      },
    });
  }, [blogState, isNew, navigate, saveBlogMutation, toast, validateBlog]);

  // Auto-save draft
  const autoSaveDraft = useCallback(() => {
    if (!isDirty || !blogState || blogState.status !== 'draft') return;
    
    if (blogState.title && blogState.content) {
      handleSave();
    }
  }, [isDirty, blogState, handleSave]);

  // Handle preview
  const handlePreview = useCallback(() => {
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  // Check for unsaved changes before navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return {
    blogState,
    isLoading,
    isSaving: saveBlogMutation.isPending,
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
  };
};