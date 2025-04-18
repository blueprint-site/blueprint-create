'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  addonid: z.string().min(1).min(20).max(20),
  title: z.string().min(1).min(1).max(150),
  description: z.string().min(1).max(500),
  icon_url: z.string().min(1),
  banner_url: z.string().min(1),
  display_order: z.number().min(0).max(20),
  slug: z.string().min(1).min(1).max(100),
  active: z.boolean(),
  category: z.string().min(1).optional(),
});

export default function AddFeaturedAddonForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-8 py-10'>
        <FormField
          control={form.control}
          name='addonid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Addon ID</FormLabel>
              <FormControl>
                <Input placeholder='67b1dfde8f50c624515b' type='text' {...field} />
              </FormControl>
              <FormDescription>
                This is the unified ID for the addon. THIS IS NOT A SLUG. Id is inside the
                meilisearch panel
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Create: Shits &amp; Giggles' type='text' {...field} />
              </FormControl>
              <FormDescription>
                This is the title that will display as the Addon&apos;s name
              </FormDescription>
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
                  placeholder='Empowering the players with shits laughs and giggles'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Description for the addon. Reccomeneded to set the same as the short description on
                its page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='icon_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder='https://cdn.modrinth.com/aweawekbewawe'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormDescription>Icon url. Reccomended: Modrinth</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='banner_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner URL</FormLabel>
              <FormControl>
                <Input placeholder='https://cdn.modrinth.com' type='' {...field} />
              </FormControl>
              <FormDescription>URL for the banner image (the bigger one)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='display_order'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display order</FormLabel>
              <FormControl>
                <Input placeholder='0' type='number' {...field} />
              </FormControl>
              <FormDescription>
                On which position is it displayed on. (0 = first 20 = last)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder='shits-n-giggles' type='text' {...field} />
              </FormControl>
              <FormDescription>Addon&apos;s Slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='active'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel>Active?</FormLabel>
                <FormDescription>Set the addon as active (off = not shown)</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Input placeholder='utility,tech' type='text' {...field} />
              </FormControl>
              <FormDescription>Example. utility,tech,magic</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
