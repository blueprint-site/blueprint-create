import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBadgeSchema, type CreateBadge, BadgeShapeEnum, BadgeRarityEnum } from '@/schemas/badge.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/config/utils';
import { Shield, Star, Award, Sparkles, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BadgeCreatorProps {
  onSave: (badge: CreateBadge) => Promise<void>;
  editingBadge?: CreateBadge & { $id: string };
}

const iconOptions = [
  { value: 'shield', icon: Shield, label: 'Shield' },
  { value: 'star', icon: Star, label: 'Star' },
  { value: 'award', icon: Award, label: 'Award' },
  { value: 'sparkles', icon: Sparkles, label: 'Sparkles' },
];

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export const BadgeCreator: React.FC<BadgeCreatorProps> = ({ onSave, editingBadge }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateBadgeSchema) as any,
    defaultValues: editingBadge || {
      name: '',
      description: '',
      icon: 'shield',
      iconUrl: '',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderColor: '#2563eb',
      shape: 'rounded',
      hasGlow: false,
      isAnimated: false,
      rarity: 'common',
      sortOrder: 0,
      isActive: true,
    },
  });

  const watchedValues = form.watch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (data: any) => {
    setIsLoading(true);
    try {
      await onSave(data);
      toast.success(editingBadge ? 'Badge updated successfully!' : 'Badge created successfully!');
      if (!editingBadge) {
        form.reset();
      }
    } catch (error) {
      console.error('Error saving badge:', error);
      toast.error('Failed to save badge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BadgePreview = ({ values }: { values: any }) => {
    const IconComponent = iconOptions.find(opt => opt.value === values.icon)?.icon || Shield;
    
    const getShapeClasses = (shape: string) => {
      switch (shape) {
        case 'circle': return 'rounded-full';
        case 'square': return 'rounded-none';
        case 'hexagon': return 'clip-hexagon';
        case 'shield': return 'clip-shield';
        case 'star': return 'clip-star';
        default: return 'rounded-lg';
      }
    };

    const badgeStyle = {
      backgroundColor: values.backgroundColor,
      color: values.textColor,
      borderColor: values.borderColor,
      borderWidth: '2px',
      borderStyle: 'solid',
    };

    // If iconUrl is provided, show image instead of icon
    if (values.iconUrl) {
      return (
        <div className={cn(
          'relative inline-flex items-center justify-center transition-all duration-300',
          getShapeClasses(values.shape),
          values.hasGlow && 'shadow-lg shadow-current/50',
          values.isAnimated && 'animate-pulse'
        )}>
          <img 
            src={values.iconUrl}
            alt={values.name || 'Badge'} 
            className='w-16 h-16 object-cover rounded-full'
          />
          {values.rarity !== 'common' && (
            <div className={cn(
              'absolute -top-1 -right-1 h-3 w-3 rounded-full',
              rarityColors[values.rarity as keyof typeof rarityColors] || rarityColors.common,
              values.isAnimated && 'animate-ping'
            )} />
          )}
        </div>
      );
    }

    return (
      <div className={cn(
        'relative inline-flex items-center justify-center p-4 transition-all duration-300',
        getShapeClasses(values.shape),
        values.hasGlow && 'shadow-lg shadow-current/50',
        values.isAnimated && 'animate-pulse'
      )} style={badgeStyle}>
        <div className='flex flex-col items-center gap-2'>
          <IconComponent className='h-8 w-8' />
          <span className='font-minecraft text-sm font-bold'>{values.name || 'Badge Name'}</span>
        </div>
        {values.rarity !== 'common' && (
          <div className={cn(
            'absolute -top-1 -right-1 h-3 w-3 rounded-full',
            rarityColors[values.rarity as keyof typeof rarityColors] || rarityColors.common,
            values.isAnimated && 'animate-ping'
          )} />
        )}
      </div>
    );
  };

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>{editingBadge ? 'Edit Badge' : 'Create New Badge'}</CardTitle>
          <CardDescription>
            Design a custom badge with various styles and effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className='space-y-6'>
              <Tabs defaultValue='basic' className='w-full'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='basic'>Basic</TabsTrigger>
                  <TabsTrigger value='appearance'>Appearance</TabsTrigger>
                  <TabsTrigger value='effects'>Effects</TabsTrigger>
                </TabsList>

                <TabsContent value='basic' className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Epic Creator' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='Awarded for exceptional contributions...' 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='rarity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rarity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select rarity' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BadgeRarityEnum.options.map((rarity) => (
                              <SelectItem key={rarity} value={rarity}>
                                <div className='flex items-center gap-2'>
                                  <div className={cn('h-3 w-3 rounded-full', rarityColors[rarity])} />
                                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='sortOrder'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input 
                            type='number' 
                            min={0} 
                            max={1000} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='appearance' className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='iconUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            type='text' 
                            placeholder='https://example.com/badge.png' 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Provide a direct URL to a badge image (overrides icon selection)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='icon'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Fallback)</FormLabel>
                        <FormControl>
                          <div className='grid grid-cols-4 gap-2'>
                            {iconOptions.map((option) => (
                              <Button
                                key={option.value}
                                type='button'
                                variant={field.value === option.value ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => field.onChange(option.value)}
                                className='flex flex-col items-center gap-1 h-auto py-2'
                              >
                                <option.icon className='h-5 w-5' />
                                <span className='text-xs'>{option.label}</span>
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>
                          This icon will be used if no image URL is provided
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='shape'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shape</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select shape' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BadgeShapeEnum.options.map((shape) => (
                              <SelectItem key={shape} value={shape}>
                                {shape.charAt(0).toUpperCase() + shape.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='backgroundColor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background</FormLabel>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Input type='color' {...field} className='h-10 w-full' />
                              <Input {...field} className='w-24 font-mono text-xs' />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='textColor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Input type='color' {...field} className='h-10 w-full' />
                              <Input {...field} className='w-24 font-mono text-xs' />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='borderColor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Border</FormLabel>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Input type='color' {...field} className='h-10 w-full' />
                              <Input {...field} className='w-24 font-mono text-xs' />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='effects' className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='hasGlow'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel>Glow Effect</FormLabel>
                          <FormDescription>
                            Add a glowing shadow effect to the badge
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isAnimated'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel>Animation</FormLabel>
                          <FormDescription>
                            Enable pulse animation for the badge
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Enable this badge for assignment to users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className='flex gap-2'>
                <Button type='submit' disabled={isLoading} className='flex-1'>
                  <Save className='mr-2 h-4 w-4' />
                  {editingBadge ? 'Update Badge' : 'Create Badge'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your badge will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-center gap-2'>
              <Button
                variant={previewMode === 'light' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setPreviewMode('light')}
              >
                Light
              </Button>
              <Button
                variant={previewMode === 'dark' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setPreviewMode('dark')}
              >
                Dark
              </Button>
            </div>

            <div className={cn(
              'rounded-lg p-8 flex items-center justify-center min-h-[200px]',
              previewMode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
            )}>
              <BadgePreview values={watchedValues} />
            </div>

            <div className='space-y-2'>
              <h4 className='text-sm font-semibold'>Badge Details</h4>
              <div className='space-y-1 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Name:</span>
                  <span>{watchedValues.name || 'Not set'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Rarity:</span>
                  <Badge className={cn('capitalize', rarityColors[watchedValues.rarity])}>
                    {watchedValues.rarity}
                  </Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Shape:</span>
                  <span className='capitalize'>{watchedValues.shape}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Effects:</span>
                  <span>
                    {[
                      watchedValues.hasGlow && 'Glow',
                      watchedValues.isAnimated && 'Animated'
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};