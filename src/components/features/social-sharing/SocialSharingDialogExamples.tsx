import React from 'react';
import { SocialSharingDialog } from './SocialSharingDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating various usage patterns of SocialSharingDialog
 */
export const SocialSharingDialogExamples = () => {
  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold'>Social Sharing Dialog Examples</h2>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Basic Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-sm'>Simple dialog with default settings</p>
            <SocialSharingDialog
              title='Check out this awesome Blueprint addon!'
              description='A collection of amazing Create mod blueprints and schematics.'
            />
          </CardContent>
        </Card>

        {/* Customized Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Customized Appearance</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-sm'>Custom button style and dialog content</p>
            <SocialSharingDialog
              title='Amazing Create Schematic'
              description='This schematic will revolutionize your Create builds!'
              triggerText='Share Schematic'
              triggerVariant='default'
              triggerSize='lg'
              dialogTitle='Share this Schematic'
              dialogDescription='Help others discover this amazing Create schematic!'
              sharingVariant='expanded'
              iconSize={28}
            />
          </CardContent>
        </Card>

        {/* Compact Version */}
        <Card>
          <CardHeader>
            <CardTitle>Compact Version</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-sm'>
              Smaller dialog with compact social icons
            </p>
            <SocialSharingDialog
              title='Blueprint Blog Post'
              triggerText='Share'
              triggerSize='sm'
              triggerVariant='secondary'
              sharingVariant='compact'
              iconSize={24}
              showTriggerIcon={false}
            />
          </CardContent>
        </Card>

        {/* Footer Integration Example */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Integration</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-sm'>How it might look in a content footer</p>
            <div className='bg-muted/50 flex items-center justify-between rounded-lg border p-4'>
              <div className='text-sm'>
                <p className='font-medium'>Epic Factory Design</p>
                <p className='text-muted-foreground'>by BuildMaster</p>
              </div>
              <SocialSharingDialog
                title='Epic Factory Design - Create Schematic'
                description='An incredible automated factory design for Create mod'
                triggerVariant='outline'
                triggerSize='sm'
                dialogTitle='Share this Factory Design'
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Usage - Controlled State</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground text-sm'>
            External control of dialog state for complex interactions
          </p>
          <ControlledDialogExample />
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Example of controlling the dialog state externally
 */
const ControlledDialogExample = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleShare = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    // Could add analytics tracking here
    console.log('Share dialog closed');
  };

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Button onClick={handleShare} variant='outline'>
          Open Share Dialog
        </Button>
        <Button onClick={() => setIsDialogOpen(false)} variant='ghost' disabled={!isDialogOpen}>
          Close Dialog
        </Button>
      </div>

      <SocialSharingDialog
        title='Controlled Share Dialog'
        description="This dialog's state is controlled externally"
        triggerText="This won't be shown"
        open={isDialogOpen}
        onOpenChange={handleClose}
        dialogTitle='Externally Controlled Sharing'
        dialogDescription='This dialog can be opened/closed programmatically'
      />
    </div>
  );
};

export default SocialSharingDialogExamples;
