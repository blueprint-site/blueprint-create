import { Input } from '@/components/ui/input.tsx';
import MarkdownEditor from '@/components/utility/MarkdownEditor.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import schematicCategories from '@/config/schematicsCategory.ts';

interface Step2Props {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
}

function Step2({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  subCategory,
  setSubCategory,
}: Step2Props) {
  const filteredCategories = schematicCategories.filter((cat) => cat.category !== 'All');
  const selectedCategory = filteredCategories.find((cat) => cat.category === category);

  return (
    <>
      <h2 className='text-center'>Title</h2>
      <Input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='mb-2 w-full border p-2'
      />
      <h2 className='text-center'>Description</h2>
      <MarkdownEditor
        value={description}
        onChange={setDescription}
        showCodeBlocks={false}
        showImages={false}
        showTables={false}
        showFrontmatter={false}
        showSandpack={false}
        showDiffSource={false}
        showThematicBreak={false}
        showLists={false}
        showUndoRedo={false}
      />
      <h2 className='text-center'>Category</h2>
      <label className='text-foreground font-minecraft mb-2 block'>Category</label>
      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
          <SelectValue placeholder='Select Category' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredCategories.map((categoryItem) => (
              <SelectItem key={categoryItem.category} value={categoryItem.category}>
                {categoryItem.category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <>
          <label className='text-foreground font-minecraft mt-4 mb-2 block'>Subcategory</label>
          <Select value={subCategory} onValueChange={setSubCategory}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue placeholder='Select Subcategory' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedCategory.subcategories.map((subCat) => (
                  <SelectItem key={subCat} value={subCat}>
                    {subCat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )}
    </>
  );
}

export default Step2;
