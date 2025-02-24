import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner.tsx';
import SchematicSearchCard from '@/components/features/schematics/SchematicSearchCard';
import SchematicCard from '@/components/features/schematics/SchematicCard';
import { useSearchSchematics } from '@/api';
import { buttonVariants } from '@/components/ui/button.tsx';
import { Upload } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select.tsx';
import schematicCategories from '@/config/schematicsCategory.ts';
import minecraftVersion from '@/config/minecraft.ts';

function SchematicsListWithFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page] = useState(1);
  const [category, setCategory] = useState('All');
  const [version, setVersion] = useState('All');
  const [loaders, setLoaders] = useState('all');
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState('All');

  const selectedCategory = schematicCategories.find((cat) => cat.category === category);
  const {
    data: schematics,
    isLoading,
    isError,
  } = useSearchSchematics({
    query: searchQuery,
    page: page,
    category: category,
    subCategory: subCategory,
    version: version,
    loaders: loaders,
  });
  console.log(schematics);

  const handleInputChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='flex'>
      <div className='text-foreground w-64 p-4'>
        <div className='relative mt-4'>
          <h2 className='text-foreground font-minecraft mb-4 text-xl font-semibold'>Filters</h2>
          <SchematicSearchCard searchQuery={searchQuery} onSearchChange={handleInputChange} />

          {/* Category Filter */}
          <label className='text-foreground font-minecraft mb-2 block'>Category</label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setSubCategory(''); // Réinitialiser la sous-catégorie lorsque la catégorie change
            }}
          >
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue
                className='text-foreground font-minecraft'
                placeholder='Select Category'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {schematicCategories.map(
                  (categoryItem: { category: string; subcategories: string[] }) => (
                    <SelectItem
                      key={categoryItem.category}
                      className='text-foreground font-minecraft'
                      value={categoryItem.category}
                    >
                      {categoryItem.category}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedCategory && selectedCategory.subcategories.length > 0 && (
            <>
              <label className='text-foreground font-minecraft mt-4 mb-2 block'>Subcategory</label>
              <Select value={subCategory} onValueChange={setSubCategory}>
                <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
                  <SelectValue
                    className='text-foreground font-minecraft'
                    placeholder='Select Subcategory'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedCategory.subcategories.map((subCat) => (
                      <SelectItem
                        key={subCat}
                        className='text-foreground font-minecraft'
                        value={subCat}
                      >
                        {subCat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          )}

          {/* Version Filter */}
          <label className='text-foreground font-minecraft mt-4 mb-2 block'>Version</label>
          <Select value={version} onValueChange={(value) => setVersion(value)}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue
                className='text-foreground font-minecraft'
                placeholder='Select Version'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {minecraftVersion.map((version) => (
                  <SelectItem className='text-foreground font-minecraft' value={version.version}>
                    {version.version}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Loaders Filter */}
          <label className='text-foreground font-minecraft mt-4 mb-2 block'>Loaders</label>
          <Select value={loaders} onValueChange={(value) => setLoaders(value)}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue placeholder='Select Loader' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='text-foreground font-minecraft' value='all'>
                  All
                </SelectItem>
                <SelectItem className='text-foreground font-minecraft' value='forge'>
                  Forge
                </SelectItem>
                <SelectItem className='text-foreground font-minecraft' value='fabric'>
                  Fabric
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='h-screen flex-1 p-8'>
        <div className='float-end mt-4'>
          <Link className={buttonVariants({ variant: 'default' })} to='../schematics/upload'>
            <Upload /> Upload Schematic
          </Link>
        </div>

        {isLoading ? (
          <div className='mt-8 flex justify-center'>
            <LoadingSpinner size='lg' />
          </div>
        ) : isError ? (
          <div className='text-destructive text-center font-semibold'>
            Oops! Failed to load schematics.
          </div>
        ) : (
          <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {schematics && schematics.length > 0 ? (
              schematics.map((schematic) => (
                <SchematicCard
                  key={schematic.$id}
                  schematic={schematic}
                  onClick={() => navigate(`../schematics/${schematic.$id}/${schematic.slug}`)}
                />
              ))
            ) : (
              <h3 className='col-span-full text-center text-lg font-semibold'>
                No schematics found.
              </h3>
            )}
          </div>
        )}
      </div>
      <div className='h-50'></div>
    </div>
  );
}

export default SchematicsListWithFilters;
