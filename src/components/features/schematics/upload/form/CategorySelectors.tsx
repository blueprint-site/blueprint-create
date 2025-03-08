import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Control, UseFormReturn } from 'react-hook-form';
import { SchematicFormValues } from '@/types';
import { SCHEMATIC_CATEGORIES } from '@/data';
import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

interface CategorySelectorsProps {
  control: Control<SchematicFormValues>;
  form: UseFormReturn<SchematicFormValues>;
}

// Add this interface
interface CategorySelection {
  id: string;
  category: string;
}

export function CategorySelectors({ control, form }: CategorySelectorsProps) {
  const schematicCategories = SCHEMATIC_CATEGORIES;
  const [selections, setSelections] = useState<CategorySelection[]>([{ id: '0', category: '' }]);
  const filteredCategories = schematicCategories.filter((cat) => cat.category !== 'All');

  const addCategorySelector = () => {
    setSelections([...selections, { id: Date.now().toString(), category: '' }]);
  };

  const removeCategorySelector = (id: string) => {
    if (selections.length > 1) {
      const updatedSelections = selections.filter((selection) => selection.id !== id);
      setSelections(updatedSelections);

      // Update the form with the updated categories and subcategories
      updateFormArrays(updatedSelections);
    }
  };

  const updateCategory = (id: string, category: string) => {
    const updatedSelections = selections.map((selection) =>
      selection.id === id ? { ...selection, category } : selection
    );
    setSelections(updatedSelections);

    // Update the form with the updated categories
    updateFormArrays(updatedSelections);
  };

  const updateSubcategory = (id: string, subcategory: string) => {
    // Find the index of the selection being updated
    const index = selections.findIndex((selection) => selection.id === id);

    // Update the subcategory in the form directly
    form.setValue(`subCategories.${index}`, subcategory);

    // Also update the complete subcategories array
    const allSubcategories = form.getValues('subCategories') || [];
    allSubcategories[index] = subcategory;

    // Filter out empty subcategories and update the parent form
    const filteredSubcategories = allSubcategories.filter(Boolean);
    form.setValue('subCategories', filteredSubcategories);
  };

  // Helper function to update both arrays in the form
  const updateFormArrays = (updatedSelections: CategorySelection[]) => {
    // Get categories and update the form
    const categoryValues = updatedSelections.map((s) => s.category).filter(Boolean);
    form.setValue('categories', categoryValues);

    // Get current subcategories
    const subCatValues = form.getValues('subCategories') || [];

    // If we've removed a category, we need to remove its subcategory too
    const trimmedSubCategories = subCatValues.slice(0, updatedSelections.length);

    // Update subcategories in the form
    form.setValue('subCategories', trimmedSubCategories.filter(Boolean));
  };

  return (
    <div className='space-y-4 py-4'>
      {selections.map((selection, index) => {
        const selectedCategoryData = filteredCategories.find((cat) => cat.category === selection.category);

        return (
          <div key={selection.id} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {index > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='bg-background absolute -top-2 -right-2 h-6 w-6 rounded-full'
                onClick={() => removeCategorySelector(selection.id)}
              >
                <X className='h-4 w-4' />
              </Button>
            )}

            <FormField
              control={control}
              name={`categories.${index}`}
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      updateCategory(selection.id, value);
                    }}
                  >
                    <SelectTrigger>
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
                  <FormMessage className='text-destructive' />
                </FormItem>
              )}
            />

            {selectedCategoryData && selectedCategoryData.subcategories.length > 0 && (
              <FormField
                control={control}
                name={`subCategories.${index}`}
                key={`subCategories.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateSubcategory(selection.id, value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Subcategory' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {selectedCategoryData.subcategories.map((subCat) => (
                            <SelectItem key={subCat} value={subCat}>
                              {subCat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-destructive' />
                  </FormItem>
                )}
              />
            )}
          </div>
        );
      })}

      <div className='mt-4 flex justify-center'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addCategorySelector}
          className='flex items-center gap-1'
        >
          <PlusCircle className='h-4 w-4' />
          Add Category
        </Button>
      </div>
    </div>
  );
}
