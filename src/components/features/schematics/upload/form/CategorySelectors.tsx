import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Control } from 'react-hook-form';
import { SchematicFormValues } from '@/types'
import schematicCategories from '@/config/schematicsCategory.ts';
import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

interface CategorySelectorsProps {
  control: Control<SchematicFormValues>;
}

interface CategorySelection {
  id: string;
  category: string;
}

export function CategorySelectors({ control }: CategorySelectorsProps) {
  const [selections, setSelections] = useState<CategorySelection[]>([{ id: '0', category: '' }]);
  const filteredCategories = schematicCategories.filter((cat) => cat.category !== 'All');

  const addCategorySelector = () => {
    setSelections([...selections, { id: Date.now().toString(), category: '' }]);
  };

  const removeCategorySelector = (id: string) => {
    if (selections.length > 1) {
      setSelections(selections.filter(selection => selection.id !== id));
    }
  };

  const updateCategory = (id: string, category: string) => {
    setSelections(selections.map(selection =>
      selection.id === id ? { ...selection, category } : selection
    ));
  };

  return (
    <div className="space-y-4 py-4">
      {selections.map((selection, index) => {
        const selectedCategoryData = filteredCategories.find(
          (cat) => cat.category === selection.category
        );

        return (
          <div key={selection.id} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background"
                onClick={() => removeCategorySelector(selection.id)}
              >
                <X className="h-4 w-4" />
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
                      <SelectValue placeholder="Select Category" />
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
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subcategory" />
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

      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCategorySelector}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}