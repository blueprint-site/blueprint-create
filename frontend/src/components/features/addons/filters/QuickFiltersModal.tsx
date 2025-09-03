import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { filterPresets, type FilterPreset } from '@/types/filters';

interface QuickFiltersModalProps {
  onApplyPreset: (preset: FilterPreset) => void;
}

export const QuickFiltersModal = ({ onApplyPreset }: QuickFiltersModalProps) => {
  const [open, setOpen] = useState(false);

  const handlePresetClick = (preset: FilterPreset) => {
    onApplyPreset(preset);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Zap className='h-4 w-4' />
          Quick Filters
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Quick Filter Presets</DialogTitle>
          <DialogDescription>
            Select a preset to quickly filter addons by popular categories
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-3 py-4'>
          {filterPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className='hover:bg-accent flex items-start gap-3 rounded-lg border p-4 text-left transition-colors'
            >
              <span className='text-2xl'>{preset.icon}</span>
              <div className='flex-1'>
                <div className='font-medium'>{preset.name}</div>
                {preset.description && (
                  <div className='text-muted-foreground text-sm'>{preset.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
