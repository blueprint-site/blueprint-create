import { Input } from '@/components/ui/input.tsx';

interface Step1Props {
  uploadedSchematic: File | null;
  setUploadedSchematic: (file: File | null) => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;
}

function Step1({
  uploadedSchematic,
  setUploadedSchematic,
  setUploadedImage,
  uploadedImageUrl,
  setUploadedImageUrl,
}: Step1Props) {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col items-center space-y-6'>
        <div className='w-full max-w-lg'>
          <h2 className='text-center text-2xl font-semibold'>Upload your schematic (.nbt)</h2>
          <Input
            type='file'
            accept='.nbt'
            onChange={(e) => {
              const file = e.target.files?.[0];
              setUploadedSchematic(file || null);
            }}
            className='w-full rounded-lg border border-gray-300 px-4 py-2'
          />
          {uploadedSchematic && (
            <div className='file-preview mt-2 text-center'>
              <p className='text-gray-600'>{uploadedSchematic.name}</p>
            </div>
          )}
        </div>

        <div className='w-full max-w-lg'>
          <h2 className='text-center text-2xl font-semibold'>Upload an image</h2>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploadedImage(file);
                setUploadedImageUrl(URL.createObjectURL(file));
              }
            }}
            className='w-full rounded-lg border border-gray-300 px-4 py-2'
          />
          {uploadedImageUrl ? (
            <div className='image-preview mt-4 text-center'>
              <img
                src={uploadedImageUrl}
                alt='Uploaded preview'
                className='h-auto max-w-full rounded-lg shadow-md'
              />
            </div>
          ) : (
            <div className='image-preview-placeholder mt-4 text-center'>
              <p className='text-gray-500'>No image selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step1;