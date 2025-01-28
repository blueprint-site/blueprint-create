import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.APP_REACT_APP_SUPABASE_URL,
  import.meta.env.APP_REACT_APP_SUPABASE_ANON_KEY
);

interface UploadResult {
  success: boolean;
  fileUrl?: string;
  imageUrl?: string;
  error?: Error;
}

export async function handleUploadSchematic(
  file: File,
  image: File,
  title: string,
  description: string
): Promise<UploadResult> {
  try {
    // Upload file to bucket
    const filePath = `files/${Date.now()}_${file.name}`;
    const { error: fileError } = await supabase.storage
      .from('schematics')
      .upload(filePath, file);

    if (fileError) throw fileError;

    // Upload image to bucket
    const imagePath = `images/${Date.now()}_${image.name}`;
    const { error: imageError } = await supabase.storage
      .from('schematics')
      .upload(imagePath, image);

    if (imageError) throw imageError;

    // Get public URLs
    const fileUrl = supabase.storage
      .from('schematics')
      .getPublicUrl(filePath)
      .data.publicUrl;

    const imageUrl = supabase.storage
      .from('schematics')
      .getPublicUrl(imagePath)
      .data.publicUrl;

    // Insert metadata into the table
    const { error: insertError } = await supabase
      .from('blueprints')
      .insert([
        {
          file_url: fileUrl,
          image_url: imageUrl,
          title,
          description,
        },
      ]);

    if (insertError) throw insertError;

    return {
      success: true,
      fileUrl,
      imageUrl,
    };
  } catch (error) {
    console.error('Error uploading blueprint:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}