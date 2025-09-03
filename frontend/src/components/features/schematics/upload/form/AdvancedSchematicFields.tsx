import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { SchematicFormValues } from '@/types';
import { Sparkles, CheckCircle } from 'lucide-react';

interface AdvancedSchematicFieldsProps {
  control: Control<SchematicFormValues>;
}

export function AdvancedSchematicFields({ control }: AdvancedSchematicFieldsProps) {
  // Watch form values to show auto-detected data
  const watchedValues = useWatch({ control });
  const hasAutoDetectedData = (watchedValues.dimensions?.blockCount ?? 0) > 0;

  return (
    <div className='space-y-6'>
      {/* Dimensions Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Dimensions
            {hasAutoDetectedData && (
              <Badge variant='secondary' className='gap-1'>
                <Sparkles className='h-3 w-3' />
                Auto-detected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasAutoDetectedData
              ? 'Dimensions automatically detected from your NBT file'
              : 'Specify the size of your schematic (optional)'}
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='dimensions.width'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (blocks)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 32'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='dimensions.height'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (blocks)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 64'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='dimensions.depth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depth (blocks)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 32'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='dimensions.blockCount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Block Count</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 5000'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Complexity Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Complexity
            {watchedValues.complexity?.level && (
              <Badge variant='secondary' className='gap-1'>
                <CheckCircle className='h-3 w-3' />
                Auto-calculated
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {watchedValues.complexity?.level
              ? 'Complexity automatically calculated based on NBT analysis'
              : 'Help users understand the difficulty of building this schematic'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField
            control={control}
            name='complexity.level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complexity Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select complexity level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='simple'>Simple - Easy to build</SelectItem>
                    <SelectItem value='moderate'>Moderate - Some experience needed</SelectItem>
                    <SelectItem value='complex'>
                      Complex - Advanced building skills required
                    </SelectItem>
                    <SelectItem value='extreme'>Extreme - Expert level only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='complexity.buildTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Build Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 30'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Approximate time for an experienced player to build
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
