import type React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Download, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { useThemeStore } from '@/api/stores/themeStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import type { Schematic } from '@/types';
import { useNavigate } from 'react-router';
import Markdown from 'react-markdown';

interface PublicUserSchematicListProps {
  userId: string;
  isOwnProfile: boolean;
  schematics: Schematic[];
}

const PublicUserSchematicList: React.FC<PublicUserSchematicListProps> = ({
  userId: _userId,
  isOwnProfile,
  schematics,
}) => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const handleCardClick = (schematic: Schematic) => {
    navigate(`/schematics/${schematic.$id}/${schematic.slug}`);
  };

  if (!schematics || schematics.length === 0) {
    return (
      <div className='mt-2'>
        <h5>{isOwnProfile ? 'My schematics' : 'Schematics'}</h5>
        <div className='mt-4 py-8 text-center'>
          <p className='text-foreground-muted'>
            {isOwnProfile ? "You haven't uploaded any schematics yet." : 'No schematics found.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => navigate('/schematics/upload')}
              className='mt-2 text-blue-500 hover:text-blue-700'
            >
              Upload your first schematic
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='mt-2'>
      <h5>{isOwnProfile ? 'My schematics' : 'Schematics'}</h5>
      <div className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {schematics.map((schematic: Schematic) => (
          <Card
            onClick={() => handleCardClick(schematic)}
            key={schematic.$id}
            className={`bg hover:bg-accent/50 relative mt-4 cursor-pointer transition-colors duration-200 ${
              isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'
            }`}
          >
            {schematic.image_urls && schematic.image_urls.length > 0 && (
              <div className='absolute inset-0 z-0 overflow-hidden'>
                <div
                  className={`absolute inset-0 scale-[1.1] bg-cover bg-center blur-sm grayscale transition-all`}
                  style={{
                    backgroundImage: `url(${schematic.image_urls[0]})`,
                  }}
                />
                <div className='bg-background/80 absolute inset-0 backdrop-blur-sm' />
              </div>
            )}

            <CardHeader className='relative z-10 flex flex-row items-center space-y-0 pb-2'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={schematic.user_avatar || ''} />
                <AvatarFallback>
                  {schematic.user_name ? schematic.user_name.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4'>
                <p className='text-foreground text-sm font-medium'>
                  {schematic.user_name || 'Unknown User'}
                </p>
                <p className='text-foreground-muted text-xs'>
                  {format(new Date(schematic.$createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </CardHeader>

            <CardContent className='relative z-10'>
              <div className='space-y-2'>
                <h3 className='text-foreground text-lg font-semibold'>{schematic.title}</h3>
                <div className='text-foreground-muted prose prose-sm max-h-16 overflow-hidden text-sm'>
                  <Markdown>{schematic.description || 'No description available.'}</Markdown>
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-1'>
                      <Download className='h-4 w-4' />
                      <span className='text-sm'>{schematic.downloads || 0}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Heart className='h-4 w-4' />
                      <span className='text-sm'>{schematic.likes || 0}</span>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {schematic.categories?.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className='bg-accent text-accent-foreground rounded-md px-2 py-1 text-xs'
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicUserSchematicList;
