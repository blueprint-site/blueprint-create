'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { BlogEditor } from '@/components/features/admin/blog/AdminBlogEditor';
import { BlogList } from '@/components/features/admin/blog/AdminBlogList';

export const AdminBlogMain = () => {
  const [tab, setTab] = useState('editor');

  return (
    <div className='space-y-4 p-4'>
      <Tabs value={tab} onValueChange={setTab} className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='editor'>New Blog Post</TabsTrigger>
          <TabsTrigger value='list'>All Posts</TabsTrigger>
        </TabsList>

        <TabsContent value='editor'>
          <Card>
            <CardContent className='p-4'>
              <BlogEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='list'>
          <Card>
            <CardContent className='p-4'>
              <BlogList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
