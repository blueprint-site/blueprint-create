import { useEffect, useState } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SchematicFormValues } from '@/types';
import { SCHEMATIC_CATEGORIES, SchematicSubcategory } from '@/data';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-selector';

interface CategorySelectorsProps {
  control: Control<SchematicFormValues>;
  form: UseFormReturn<SchematicFormValues>;
}

export function CategorySelectors({ control, form }: CategorySelectorsProps) {
  // Get form values for initial state
  const formCategories = form.watch('categories') || [];
  const formSubCategories = form.watch('sub_categories') || [];
  // Initialize state with form values
  const [selectedCategories, setSelectedCategories] = useState<string[]>(formCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(formSubCategories);

  // Get all categories except "All"
  const filteredCategories = SCHEMATIC_CATEGORIES.filter((cat) => cat.category !== 'All');

  // Get all available subcategories based on selected categories
  const availableSubCategories = selectedCategories.flatMap((category) => {
    const categoryData = SCHEMATIC_CATEGORIES.find((cat) => cat.category === category);
    return categoryData ? categoryData.subcategories : [];
  });

  // Watch for external form value changes
  useEffect(() => {
    if (JSON.stringify(formCategories) !== JSON.stringify(selectedCategories)) {
      console.log('formCategories effect', formCategories);
      setSelectedCategories(formCategories);
    }

    if (JSON.stringify(formSubCategories) !== JSON.stringify(selectedSubCategories)) {
      console.log('formSubCategories effect', formSubCategories);
      setSelectedSubCategories(formSubCategories);
    }
  }, [formCategories, formSubCategories]);

  // Update form when selections change
  useEffect(() => {
    form.setValue('categories', selectedCategories);

    // Filter out any subcategories that don't belong to selected categories
    const validSubCategories = selectedSubCategories.filter((subCat) =>
      availableSubCategories.includes(subCat as SchematicSubcategory)
    );

    if (JSON.stringify(validSubCategories) !== JSON.stringify(selectedSubCategories)) {
      setSelectedSubCategories(validSubCategories);
    }

    form.setValue('sub_categories', validSubCategories);
  }, [selectedCategories, selectedSubCategories, form, availableSubCategories]);

  return (
    <div className='space-y-4 py-4'>
      <FormField
        control={control}
        name='categories'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Categories</FormLabel>
            <MultiSelector
              values={selectedCategories}
              onValuesChange={(values) => {
                setSelectedCategories(values);
                field.onChange(values);
              }}
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder='Select categories' />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {filteredCategories.map((category) => (
                    <MultiSelectorItem key={category.category} value={category.category}>
                      {category.category}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
            <FormMessage className='text-destructive' />
          </FormItem>
        )}
      />

      {selectedCategories.length > 0 && (
        <FormField
          control={control}
          name='sub_categories'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Subcategories</FormLabel>
              <MultiSelector
                values={selectedSubCategories}
                onValuesChange={(values) => {
                  setSelectedSubCategories(values);
                  field.onChange(values);
                }}
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder='Select subcategories' />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {availableSubCategories.map((subCategory) => (
                      <MultiSelectorItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              <FormMessage className='text-destructive' />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
