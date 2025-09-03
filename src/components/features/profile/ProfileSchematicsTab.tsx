import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import UserSchematicList from '@/components/features/schematics/UserSchematicList';

export const ProfileSchematicsTab: React.FC = () => {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Layers className='h-5 w-5' />
            My Schematics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserSchematicList />
        </CardContent>
      </Card>
    </div>
  );
};