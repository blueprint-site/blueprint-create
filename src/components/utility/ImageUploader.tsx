import { useState, useEffect, useRef, ChangeEvent, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, XCircle } from 'lucide-react';
import { storage } from '@/config/appwrite.ts';
import { ID } from 'appwrite';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload file to Appwrite bucket
        const response = await storage.createFile(
          '67b478dd00221462624e', // Bucket ID
          ID.unique(),
          file
        );
        const fileId = response.$id;

        // Directly get the view URL using getFileView
        const viewUrl = storage.getFilePreview('67b478dd00221462624e', fileId);

        setPreview(viewUrl); // Use the returned URL directly
        setImageUrl(viewUrl); // Store the preview URL
        onChange(viewUrl); // Update parent state with preview URL
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setPreview(url);
    onChange(url || undefined);
  };

  const handleReset = () => {
    setPreview(null);
    setImageUrl('');
    onChange(undefined);
  };

  return (
    <div>
      {preview ? (
        <div className='relative w-full py-4'>
          <img
            src={preview}
            alt='Preview'
            className='max-h-40 w-full rounded-lg object-cover shadow-md'
          />
          <Button
            size='icon'
            variant='ghost'
            className='absolute top-2 right-2 text-red-500 hover:text-red-700'
            onClick={handleReset}
          >
            <XCircle size={20} />
          </Button>
        </div>
      ) : (
        <p className='text-center text-gray-500'>No Image selected</p>
      )}

      <div className='w-full py-4'>
        <Input
          type='text'
          value={imageUrl}
          placeholder='Or enter url...'
          onChange={handleUrlChange}
        />
      </div>

      <div className='w-full py-4'>
        <Button
          variant='outline'
          className='flex w-full gap-2'
          type='button'
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <UploadCloud size={18} /> {isUploading ? 'Uploading...' : 'Select image'}
        </Button>
        <Input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
