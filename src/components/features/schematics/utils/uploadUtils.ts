import { storage, databases } from '@/config/appwrite.ts';
import type { LoggedUserContextType } from '@/types';

export async function handleSchematicUpload(
  file: File,
  image: File,
  title: string,
  description: string,
  userdata: LoggedUserContextType,
  slug: string,
  category: string,
  subCategory: string,
  gameVersions: string[],
  createVersions: string[],
  loaders: string[]
) {
  try {
    const uploadedFile = await storage.createFile('67b2241e0032c25c8216', 'unique()', file);
    const uploadedImage = await storage.createFile('67b22481001e99d90888', 'unique()', image);
    const fileUrl = storage.getFileDownload('67b2241e0032c25c8216', uploadedFile.$id);
    const imageUrl = storage.getFilePreview('67b22481001e99d90888', uploadedImage.$id);

    const data = {
      title: title,
      description: description,
      schematic_url: fileUrl,
      image_url: imageUrl,
      slug: slug,
      categories: [category],
      subCategories: [subCategory],
      user_id: userdata.user?.$id,
      authors: [userdata.user?.$id],
      game_versions: gameVersions,
      create_versions: createVersions,
      modloaders: loaders,
    };

    const document = await databases.createDocument(
      '67b1dc430020b4fb23e3',
      '67b2310d00356b0cb53c',
      'unique()',
      data
    );

    const uploadedSchematics = localStorage.getItem('storedBlueprints') || '[]';
    const blueprintsArray = JSON.parse(uploadedSchematics);
    blueprintsArray.push(`${document.$id}/${slug}:${Date.now()}`);
    localStorage.setItem('uploadedSchematics', JSON.stringify(blueprintsArray));

    return document;
  } catch (error) {
    console.error('Error uploading blueprint:', error);
    return null;
  }
}
