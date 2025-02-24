import * as lucide from 'lucide-react';

import MinecraftIcon from '@/components/utility/MinecraftIcon';
import { minecraftIcons } from '@/config/minecraftIcons.ts';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

const lucideIcons = [
  { icon: lucide.AlertCircle, name: 'AlertCircle' },
  { icon: lucide.ArrowDown, name: 'ArrowDown' },
  { icon: lucide.ArrowLeft, name: 'ArrowLeft' },
  { icon: lucide.ArrowRight, name: 'ArrowRight' },
  { icon: lucide.ArrowUp, name: 'ArrowUp' },
  { icon: lucide.Bell, name: 'Bell' },
  { icon: lucide.Check, name: 'Check' },
  { icon: lucide.ChevronDown, name: 'ChevronDown' },
  { icon: lucide.ChevronLeft, name: 'ChevronLeft' },
  { icon: lucide.ChevronRight, name: 'ChevronRight' },
  { icon: lucide.ChevronUp, name: 'ChevronUp' },
  { icon: lucide.Copy, name: 'Copy' },
  { icon: lucide.Download, name: 'Download' },
  { icon: lucide.Edit, name: 'Edit' },
  { icon: lucide.ExternalLink, name: 'ExternalLink' },
  { icon: lucide.Eye, name: 'Eye' },
  { icon: lucide.EyeOff, name: 'EyeOff' },
  { icon: lucide.File, name: 'File' },
  { icon: lucide.FileText, name: 'FileText' },
  { icon: lucide.Filter, name: 'Filter' },
  { icon: lucide.Github, name: 'Github' },
  { icon: lucide.Heart, name: 'Heart' },
  { icon: lucide.HelpCircle, name: 'HelpCircle' },
  { icon: lucide.Home, name: 'Home' },
  { icon: lucide.Image, name: 'Image' },
  { icon: lucide.Info, name: 'Info' },
  { icon: lucide.Link, name: 'Link' },
  { icon: lucide.Loader2, name: 'Loader2' },
  { icon: lucide.Lock, name: 'Lock' },
  { icon: lucide.LogOut, name: 'LogOut' },
  { icon: lucide.Mail, name: 'Mail' },
  { icon: lucide.Menu, name: 'Menu' },
  { icon: lucide.Moon, name: 'Moon' },
  { icon: lucide.MoreHorizontal, name: 'MoreHorizontal' },
  { icon: lucide.MoreVertical, name: 'MoreVertical' },
  { icon: lucide.Plus, name: 'Plus' },
  { icon: lucide.Search, name: 'Search' },
  { icon: lucide.Settings, name: 'Settings' },
  { icon: lucide.Share, name: 'Share' },
  { icon: lucide.Star, name: 'Star' },
  { icon: lucide.Sun, name: 'Sun' },
  { icon: lucide.Trash, name: 'Trash' },
  { icon: lucide.Upload, name: 'Upload' },
  { icon: lucide.User, name: 'User' },
  { icon: lucide.X, name: 'X' },
];

const IconSection = () => {
  return (
    <>
      {/* Icons */}
      <div className='space-y-8'>
        <h2 className='text-2xl font-semibold'>Icons</h2>

        {/* Minecraft Icons */}
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold'>Minecraft Icons</h3>

          <Card className='bg-card'>
            <CardContent className='flex flex-wrap gap-4 p-6'>
              {minecraftIcons.map((name) => (
                <div key={name} className='flex h-24 w-24 flex-col items-center justify-center'>
                  <Button variant='ghost' size='icon'>
                    <MinecraftIcon name={name} size={32} />
                  </Button>
                  <div className='text-center text-[10px]'>{name}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Lucide Icons */}
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold'>Minecraft Icons</h3>

          <Card className='bg-card'>
            <CardContent className='flex flex-wrap gap-4 p-6'>
              {lucideIcons.map(({ icon: Icon, name }) => (
                <div key={name} className='flex h-16 w-16 flex-col items-center justify-center'>
                  <Button variant='ghost' size='icon'>
                    <Icon size={24} />
                  </Button>
                  <div className='text-[10px]'>{name}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default IconSection;
