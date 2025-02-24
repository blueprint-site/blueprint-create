import { useState } from 'react';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { motion } from 'framer-motion';
import { CardDescription } from '@/components/ui/card.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { useSearchAddons } from '@/api';

const AddonList = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [loaders, setLoaders] = useState('');
  // New state for category filter
  const [version, setVersion] = useState(''); // New state for version filter
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch results based on query, category, version, and pagination
  const {
    data: hits,
    isLoading,
    isFetching,
  } = useSearchAddons(query, page, category, version, loaders);

  const handleChange = (selectedOption: string) => {
    setQuery(selectedOption);
    setIsDropdownOpen(false);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100);
  };

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className='text-foreground w-64 p-4'>
        <div className='relative mt-4'>
          <h3 className='text-center text-lg font-medium'>Addon Search</h3>
          <Input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder='Search...'
            className='font-minecraft mb-4 w-full rounded-lg border p-2'
          />
          {isDropdownOpen && query && hits && (
            <div className='bg-surface-1 absolute top-full z-20 mt-1 w-full'>
              {hits.map((hit) => (
                <motion.div
                  key={hit.id}
                  onClick={() => handleChange(hit.name)}
                  className='text-foreground font-minecraft hover:bg-surface-2 cursor-pointer p-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='flex items-center gap-4'>
                    <Avatar>
                      <AvatarImage className='bg-cover' src={hit.icon} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardDescription>{hit.name}</CardDescription>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-4'>
          <h3 className='text-lg font-medium'>Category</h3>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue className='font-minecraft' placeholder='Select category...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='font-minecraft cursor-pointer' value='all'>
                All
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='tech'>
                Tech
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='energy'>
                Energy
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='magic'>
                Magic
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='mt-4'>
          <h3 className='text-lg font-medium'>Loaders</h3>
          <Select value={loaders} onValueChange={setLoaders}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue className='font-minecraft' placeholder='Select loaders...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='font-minecraft cursor-pointer' value='all'>
                All
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='Forge'>
                Forge
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='Fabric'>
                Fabric
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='NeoForge'>
                NeoForge
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='NeoForge'>
                Quilt
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='mt-4'>
          <h3 className='text-lg font-medium'>Version</h3>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger className='border-foreground font-minecraft w-full rounded-lg p-2'>
              <SelectValue className='font-minecraft' placeholder='Select version...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='font-minecraft cursor-pointer' value='all'>
                All
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='1.19.2'>
                1.18.2
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='1.19.2'>
                1.19.2
              </SelectItem>
              <SelectItem className='font-minecraft cursor-pointer' value='1.21.1'>
                1.21.1
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className='h-screen flex-1 p-8'>
        {isLoading || isFetching ? (
          <p>Chargement...</p>
        ) : (
          <div>
            <motion.div
              className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {hits &&
                hits.map((hit) => (
                  <motion.div
                    key={hit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AddonCard addon={hit} />
                  </motion.div>
                ))}
            </motion.div>

            <div className='mt-8 flex items-center justify-center gap-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(page - 1)} isActive={page === 1} />
                  </PaginationItem>
                  <PaginationItem>
                    <span className='text-sm'>Page {page}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(page + 1)}
                      isActive={(hits?.length || 0) < 6}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddonList;
