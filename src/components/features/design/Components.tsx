import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Mail, Plus, Search, Settings, User } from 'lucide-react';

const ComponentSection = () => {
  return (
    <>
      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Button>Default</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='accent'>Accent</Button>
            <Button variant='success'>Success</Button>
            <Button variant='warning'>Warning</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
          </div>
          <div className='flex flex-wrap gap-4'>
            <Button size='sm'>Small</Button>
            <Button>Default</Button>
            <Button size='lg'>Large</Button>
            <Button size='icon'>
              <Settings />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <Input placeholder='Default input' />
              <Input placeholder='Disabled input' disabled />
              <div className='flex gap-2'>
                <Input placeholder='With button' />
                <Button>Send</Button>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              {/* Select components */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='option1'>Option 1</SelectItem>
                  <SelectItem value='option2'>Option 2</SelectItem>
                  <SelectItem value='option3'>Option 3</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder='Disabled select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='disabled'>Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Cards</h2>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                This is a default card with a title and description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card className='bg-blueprint'>
            <CardHeader>
              <CardTitle>Blueprint Card (WIP)</CardTitle>
              <CardDescription>
                A card component designed to mimic the in-game blueprint item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This card will be styled to look like a blueprint item in the game. It has a unique
                design and layout.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Profile Card</CardTitle>
                  <CardDescription>With avatar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Card with avatar example.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <Badge>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='accent'>Accent</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>
                <User className='h-6 w-6' />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      {/* Tooltips */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Tooltips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Plus className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add new item</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Mail className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send email</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Skeleton</h2>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
          </div>
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    </>
  );
};

export default ComponentSection;
