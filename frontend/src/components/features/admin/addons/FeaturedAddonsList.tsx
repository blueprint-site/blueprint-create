import { useFetchAllFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUpdateFeaturedAddon, useDeleteFeaturedAddon } from '@/api/endpoints/useFeaturedAddons';
import type { DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { FeaturedAddon } from '@/types';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function FeaturedAddonsList() {
  const { data: featuredAddons, isLoading, refetch } = useFetchAllFeaturedAddons();
  const { mutate: updateFeaturedAddon } = useUpdateFeaturedAddon();
  const { mutate: deleteFeaturedAddon } = useDeleteFeaturedAddon();
  const [addonToDelete, setAddonToDelete] = useState<FeaturedAddon | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !featuredAddons) return;

    const items = Array.from(featuredAddons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order for all items
    items.forEach((item, index) => {
      updateFeaturedAddon({
        id: item.$id,
        addon: {
          display_order: index,
        },
      });
    });
  };

  const handleToggleActive = async (addon: FeaturedAddon) => {
    updateFeaturedAddon({
      id: addon.$id,
      addon: {
        active: !addon.active,
      },
    });
  };

  const handleDelete = async (addon: FeaturedAddon) => {
    setAddonToDelete(addon);
  };

  const confirmDelete = () => {
    if (addonToDelete) {
      deleteFeaturedAddon(addonToDelete.$id, {
        onSuccess: () => {
          refetch();
          setAddonToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Featured Addons</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='featured-addons'>
              {(provided: DroppableProvided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-4'>
                  {featuredAddons?.map((addon, index) => (
                    <Draggable key={addon.$id} draggableId={addon.$id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='flex items-center justify-between rounded-lg border p-4'
                        >
                          <div className='flex items-center space-x-4'>
                            <img
                              src={addon.image_url}
                              alt={addon.title}
                              className='h-16 w-16 rounded object-cover'
                            />
                            <div>
                              <h3 className='font-medium'>{addon.title}</h3>
                              <p className='text-muted-foreground text-sm'>
                                Position: {addon.display_order}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center space-x-4'>
                            <div className='flex items-center space-x-2'>
                              <Switch
                                id={`active-${addon.$id}`}
                                checked={addon.active}
                                onCheckedChange={() => handleToggleActive(addon)}
                              />
                              <Label htmlFor={`active-${addon.$id}`}>Active</Label>
                            </div>
                            <Button
                              variant='destructive'
                              size='icon'
                              onClick={() => handleDelete(addon)}
                              className='h-8 w-8'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      <Dialog open={!!addonToDelete} onOpenChange={() => setAddonToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Featured Addon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{addonToDelete?.title}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddonToDelete(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
