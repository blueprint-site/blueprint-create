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
import { Download, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteSchematics, useFetchUserSchematics } from '@/api/endpoints/useSchematics.tsx';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext.tsx';
import { useThemeStore } from '@/api/stores/themeStore.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import MinecraftIcon from '@/components/utility/MinecraftIcon.tsx';
import {Schematic} from "@/types";


const UserSchematicList = () => {
  const { isDarkMode } = useThemeStore();
  const LoggedUserInfo = useLoggedUser();
  // Fetch user schematics
  const { data: userSchematics } = useFetchUserSchematics(LoggedUserInfo?.user?.$id || '');

  // Mutation to delete schematic
  const { mutate: deleteSchematic } = useDeleteSchematics(LoggedUserInfo?.user?.$id);

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

  return (
      <div className='mt-2'>
        <h2>My schematics</h2>
        <div className='mt-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {userSchematics
              ? userSchematics.map((schematic: Schematic) => (
                  <Card
                      key={schematic.$id}
                      className={`bg hover:bg-accent/50 relative mt-4 cursor-pointer transition-colors duration-200 ${
                          isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'
                      }`}
                  >
                    <CardHeader className='mt-4 flex flex-col items-start justify-between'>
                      <div className='flex items-center gap-4'>
                        <Avatar>
                          <AvatarImage src={schematic.image_urls ? schematic.image_urls[1] : ''} alt={schematic.title} />
                          <AvatarFallback>{schematic.title.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className=''>
                          <h3 className='text-card-foreground text-lg font-semibold'>
                            {schematic.title}
                          </h3>
                          <p className='text-foreground-muted text-sm'>{schematic.description}</p>
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
                    <CardContent className='flex flex-col items-start justify-between'>
                      <div className='flex items-center text-xs'>
                        Created : {format(new Date(schematic.$createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                      <div className='flex items-center text-xs'>
                        Updated : {format(new Date(schematic.$updatedAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </CardContent>

                    {/* Delete Button with AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='text-destructive absolute top-1 right-1 cursor-pointer'>
                          <MinecraftIcon
                              name={'trash'}
                              className={'absolute top-1 right-1'}
                              size={32}
                          />
                        </button>
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
                  </Card>
              ))
              : null}
        </div>
      </div>
  );
};

export default UserSchematicList;
