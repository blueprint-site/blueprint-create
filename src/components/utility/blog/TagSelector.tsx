import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Tag } from '@/types';
import { databases, ID } from '@/config/appwrite.ts';
import { Models, Query } from 'appwrite';
import { PlusIcon } from 'lucide-react';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const BLOG_COLLECTION_ID = '67b2326100053d0e304f';
const SCHEMATICS_COLLECTION_ID = '67bf59d30021b5c117f5';
let COLLECTION_ID = '67b2326100053d0e304f';

interface TagSelectorProps {
  value?: Tag[];
  db: 'blog' | 'schematics';
  onChange?: (selectedTags: Tag[]) => void;
}

export default function TagSelector({ value, db, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3498db');

  useEffect(() => {
    if (value) {
      setSelectedTags(value);
    }
    if (db) {
      if (db === 'blog') {
        COLLECTION_ID = BLOG_COLLECTION_ID;
      }
      if (db === 'schematics') {
        COLLECTION_ID = SCHEMATICS_COLLECTION_ID;
      }
    }
  }, [value, db]);

  async function fetchTags() {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(100)]);

      const fetchedTags = response.documents.map((doc: Models.Document) => ({
        id: doc.$id,
        value: doc.value,
        color: doc.color,
      }));

      setTags(fetchedTags);
    } catch (error) {
      console.error('Erreur lors de la récupération des tags :', error);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  async function createTag() {
    if (!newTag) return;
    try {
      const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        value: newTag,
        color: newTagColor,
      });

      const newCreatedTag: Tag = {
        id: response.$id,
        value: response.value,
        color: response.color,
      };

      setTags((prev) => [...prev, newCreatedTag]);
      setNewTag('');
      setNewTagColor('#3498db');
    } catch (error) {
      console.error('Erreur lors de la création du tag :', error);
    }
  }

  async function deleteTag(id: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du tag :', error);
    }
  }

  function toggleTagSelection(tag: Tag) {
    setSelectedTags((prev) => {
      const exists = prev.find((t) => t.id === tag.id);
      const updatedTags = exists ? prev.filter((t) => t.id !== tag.id) : [...prev, tag];
      onChange?.(updatedTags);
      return updatedTags;
    });
  }

  return (
    <>
      <div className='flex flex-row gap-4'>
        <div>
          <Select
            onValueChange={(value) => {
              const tag = tags.find((t) => t.value === value);
              if (tag) toggleTagSelection(tag);
            }}
          >
            <SelectTrigger className={'cursor-pointer'}>
              <SelectValue placeholder='Select tags' />
            </SelectTrigger>
            <SelectContent className='bg-surface-1'>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.value} className={'cursor-pointer'}>
                  <span className='flex items-center justify-between'>
                    <span className='mr-2' style={{ color: tag.color }}>
                      {tag.value}
                    </span>
                    <Button variant='ghost' className={'absolute right-0'} size='sm' onClick={() => deleteTag(tag.id)}>
                      ❌
                    </Button>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-row gap-4'>
          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder='New tag name' />
          <Popover>
            <PopoverTrigger className='h-10 w-10 rounded border' style={{ background: newTagColor }} />
            <PopoverContent className='p-2'>
              <HexColorPicker color={newTagColor} onChange={(e) => setNewTagColor(e)} />
            </PopoverContent>
          </Popover>
        </div>

        <Button className='cursor-pointer' onClick={createTag}>
          <PlusIcon />
        </Button>
      </div>
      <h3>Selected Tags :</h3>
      <div className='m-2 flex flex-wrap gap-2'>
        {selectedTags.map((tag) => (
          <span key={tag.id} className='text-foreground rounded px-1 py-1' style={{ backgroundColor: tag.color }}>
            {tag.value}
          </span>
        ))}
      </div>
    </>
  );
}
