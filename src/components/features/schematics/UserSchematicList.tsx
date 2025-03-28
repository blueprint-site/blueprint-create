import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import { Download, Edit, Heart, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteSchematics, useFetchUserSchematics } from '@/api/endpoints/useSchematics.tsx';
import { useUserStore } from '@/api/stores/userStore';
import { useThemeStore } from '@/api/stores/themeStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import type { Schematic } from '@/types';
import { useNavigate } from 'react-router';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';

const UserSchematicList = () => {
  const { isDarkMode } = useThemeStore();
  const user = useUserStore((state) => state.user);
  const { data: userSchematics } = useFetchUserSchematics(user?.$id || '');
  const { mutate: deleteSchematic } = useDeleteSchematics(user?.$id);
  const navigate = useNavigate();
  // Delete handler
  const handleDelete = (id: string) => {
    deleteSchematic(id, {
      onSuccess: () => {
        console.log(`Schematic ${id} deleted successfully`);
      },
      onError: (error) => {
        console.error('Failed to delete schematic:', error);
      },
    });
  };

  const handleCardClick = (schematic: Schematic) => {
    navigate(`/schematics/${schematic.$id}/${schematic.slug}`);
  };

  const handleEditClick = (event: React.MouseEvent, schematic: Schematic) => {
    event.stopPropagation();
    navigate(`/schematics/edit/${schematic.$id}`);
  };

  return (
    <div className='mt-2'>
      <h2>My schematics</h2>
      <div className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {userSchematics
          ? userSchematics.map((schematic: Schematic) => (
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
                      className='absolute inset-0'
                      style={{
                        backgroundImage: `url(${schematic.image_urls[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: 'scale(1.1) ',
                        filter: 'grayscale(100%) blur(5px)',
                      }}
                    />
                    <div
                      className='absolute inset-0'
                      style={{
                        backgroundColor: isDarkMode
                          ? 'rgba(0, 0, 0, 0.3)'
                          : 'rgba(255, 255, 255, 0.4)', // Adjust as needed
                      }}
                    />
                  </div>
                )}
                <CardHeader className='relative z-10 mt-4 flex flex-col items-start justify-between'>
                  <div className='flex items-center gap-4'>
                    <Avatar>
                      <AvatarImage
                        src={schematic.image_urls ? schematic.image_urls[0] : ''}
                        alt={schematic.title}
                      />
                      <AvatarFallback>{schematic.title.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className=''>
                      <h3 className='text-card-foreground text-lg font-semibold'>
                        {schematic.title}
                      </h3>
                      <p className='text-foreground-muted text-xs'>
                        <Markdown>{schematic.description.slice(0, 25)}</Markdown>
                      </p>
                    </div>
                  </div>
                  <div className='text-foreground-muted flex items-center gap-4 text-sm'>
                    <div className='flex items-center'>
                      <Heart className='text-destructive mr-1 h-4 w-4' />
                      <span>{schematic.likes}</span>
                    </div>
                    <div className='flex items-center'>
                      <Download className='mr-1 h-4 w-4' />
                      <span>{schematic.downloads}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='relative z-10 flex flex-col items-start justify-between'>
                  <div className='flex items-center text-xs'>
                    Created : {format(new Date(schematic.$createdAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                  <div className='flex items-center text-xs'>
                    Updated : {format(new Date(schematic.$updatedAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                </CardContent>
                <div className='absolute top-1 right-1 z-10 flex gap-1'>
                  <Button
                    variant='warning'
                    className={'cursor-pointer'}
                    size='icon'
                    onClick={(event) => handleEditClick(event, schematic)}
                    title='Edit'
                  >
                    <Edit className='text-foreground h-4 w-4' />
                  </Button>

                  {/* Delete Button with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        size='icon'
                        className={'cursor-pointer'}
                        title='Delete'
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent navigation
                        }}
                      >
                        <TrashIcon className='text-foreground h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Schematic</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{schematic.title}"? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(schematic.$id)}
                          className='text-destructive'
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
};

export default UserSchematicList;
