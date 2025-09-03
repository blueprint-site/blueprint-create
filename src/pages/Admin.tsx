import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  BookOpen,
  Box,
  FileText,
  Package,
  Plus,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeedbackAdmin } from '@/components/admin/FeedbackAdmin';
import { useFetchFeedback } from '@/api';
import type { FeedbackRecord } from '@/types';

// Returns true if any feedback item has status === 'open'
function checkIsThereFeedback(feedback?: FeedbackRecord[]): boolean {
  return Array.isArray(feedback) && feedback.some((f) => f.status === 'open');
}

import { AdminDashboard } from './AdminDashboard';

export const Admin = () => {

  return <AdminDashboard />;
};

// Old component kept for reference - remove when ready
export const AdminOld = () => {
  // Mock data
  const recentAddons = [
    {
      id: 1,
      name: 'Create Crafts & Additions',
      author: 'MRHminer',
      downloads: 145879,
      status: 'approved',
    },
    { id: 2, name: 'Create Deco', author: 'talrey', downloads: 98562, status: 'approved' },
    {
      id: 3,
      name: 'Create Enchantment Industry',
      author: 'Creators_Team',
      downloads: 76543,
      status: 'pending',
    },
    {
      id: 4,
      name: "Create: Steam 'n' Rails",
      author: 'mattentosh',
      downloads: 187654,
      status: 'approved',
    },
  ];

  const recentSchematics = [
    {
      id: 1,
      name: 'Automated Ore Processing',
      author: 'EngineeringMC',
      downloads: 12543,
      category: 'Factory',
    },
    {
      id: 2,
      name: 'Train Station Deluxe',
      author: 'RailwayBuilder',
      downloads: 8976,
      category: 'Transport',
    },
    {
      id: 3,
      name: 'Compact Crusher Setup',
      author: 'MechanicalWizard',
      downloads: 7645,
      category: 'Compact',
    },
    {
      id: 4,
      name: 'Medieval Windmill',
      author: 'HistoryBuilder',
      downloads: 10234,
      category: 'Decoration',
    },
  ];

  const recentBlogPosts = [
    {
      id: 1,
      title: 'Guide: Automation with Create',
      author: 'Admin',
      comments: 32,
      published: true,
    },
    {
      id: 2,
      title: "Update 0.5.1 - What's New",
      author: 'Moderator',
      comments: 18,
      published: true,
    },
    {
      id: 3,
      title: 'Contraption Building Contest',
      author: 'Admin',
      comments: 0,
      published: false,
    },
  ];

  const [activeTab, setActiveTab] = useState<
    'addons' | 'schematics' | 'blog' | 'feedback' | 'analytics'
  >('addons');

  return (
    <div className='flex h-full flex-col'>
      {/* Tabs sections - takes up remaining height */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className='flex h-full flex-1 flex-col'
      >
        <TabsList className='mb-2'>
          <TabsTrigger value='addons'>Addons</TabsTrigger>
          <TabsTrigger value='schematics'>Schematics</TabsTrigger>
          <TabsTrigger value='blog'>Blog</TabsTrigger>
          <TabsTrigger value='feedback'>
            <span>Feedback</span>
            {hasOpenFeedback && activeTab !== 'feedback' && (
              <Badge variant='destructive' className='ml-2 animate-ping'>
                LOOK
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Tab Content Container - make this scrollable if needed */}
        <div className='flex-1 overflow-y-auto'>
          {/* Addons Tab */}
          <TabsContent value='addons' className='m-0 h-full'>
            <div className='grid h-full grid-cols-3 gap-4'>
              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Recent Addons</CardTitle>
                  <CardDescription className='text-xs'>
                    Recently submitted to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-4 py-4'>
                      {recentAddons.map((addon) => (
                        <div key={addon.id} className='flex items-center justify-between space-x-4'>
                          <div className='space-y-1'>
                            <p className='text-sm leading-none font-medium'>{addon.name}</p>
                            <p className='text-muted-foreground text-xs'>by {addon.author}</p>
                          </div>
                          <Badge variant={addon.status === 'approved' ? 'default' : 'outline'}>
                            {addon.status === 'approved' ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Popular Addons</CardTitle>
                  <CardDescription className='text-xs'>Ranked by downloads</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-4 py-4'>
                      {recentAddons
                        .sort((a, b) => b.downloads - a.downloads)
                        .map((addon, index) => (
                          <div key={index} className='space-y-1'>
                            <div className='flex items-center justify-between'>
                              <p className='text-sm leading-none font-medium'>{addon.name}</p>
                              <p className='text-sm font-medium'>
                                {addon.downloads.toLocaleString()}
                              </p>
                            </div>
                            <Progress value={(addon.downloads / 200000) * 100} className='h-1' />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Quick Actions</CardTitle>
                  <CardDescription className='text-xs'>Manage Create mod addons</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-2 py-4'>
                      <Button className='w-full justify-start'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add new addon
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <Package className='mr-2 h-4 w-4' />
                        Manage categories
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <FileText className='mr-2 h-4 w-4' />
                        Moderate comments
                      </Button>
                      <Separator className='my-2' />
                      <Button variant='destructive' className='w-full justify-start'>
                        Pending addons (2)
                      </Button>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schematics Tab */}
          <TabsContent value='schematics' className='m-0 h-full'>
            <div className='grid h-full grid-cols-3 gap-4'>
              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Recent Schematics</CardTitle>
                  <CardDescription className='text-xs'>
                    Recently uploaded blueprints
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-4 py-4'>
                      {recentSchematics.map((schematic) => (
                        <div
                          key={schematic.id}
                          className='flex items-center justify-between space-x-4'
                        >
                          <div className='space-y-1'>
                            <p className='text-sm leading-none font-medium'>{schematic.name}</p>
                            <p className='text-muted-foreground text-xs'>by {schematic.author}</p>
                          </div>
                          <Badge variant='outline'>{schematic.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Popular Schematics</CardTitle>
                  <CardDescription className='text-xs'>Ranked by downloads</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-4 py-4'>
                      {recentSchematics
                        .sort((a, b) => b.downloads - a.downloads)
                        .map((schematic, index) => (
                          <div key={index} className='space-y-1'>
                            <div className='flex items-center justify-between'>
                              <p className='text-sm leading-none font-medium'>{schematic.name}</p>
                              <p className='text-sm font-medium'>
                                {schematic.downloads.toLocaleString()}
                              </p>
                            </div>
                            <Progress value={(schematic.downloads / 15000) * 100} className='h-1' />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Quick Actions</CardTitle>
                  <CardDescription className='text-xs'>
                    Manage schematics and categories
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-2 py-4'>
                      <Button className='w-full justify-start'>
                        <Upload className='mr-2 h-4 w-4' />
                        Upload schematic
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <Box className='mr-2 h-4 w-4' />
                        Manage tags
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <FileText className='mr-2 h-4 w-4' />
                        Batch validation
                      </Button>
                      <Separator className='my-2' />
                      <Button variant='secondary' className='w-full justify-start'>
                        Moderation guidelines
                      </Button>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value='blog' className='m-0 h-full'>
            <div className='grid h-full grid-cols-2 gap-4'>
              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Recent Articles</CardTitle>
                  <CardDescription className='text-xs'>Manage blog posts</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-4 py-4'>
                      {recentBlogPosts.map((post) => (
                        <div
                          key={post.id}
                          className='flex items-start justify-between space-x-4 border-b pb-4'
                        >
                          <div className='space-y-1'>
                            <p className='text-sm leading-none font-medium'>{post.title}</p>
                            <p className='text-muted-foreground text-xs'>by {post.author}</p>
                            <div className='flex items-center pt-1'>
                              <BookOpen className='mr-1 h-3 w-3' />
                              <span className='text-muted-foreground text-xs'>
                                {post.comments} comments
                              </span>
                            </div>
                          </div>
                          <Badge variant={post.published ? 'default' : 'outline'}>
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Blog Tools</CardTitle>
                  <CardDescription className='text-xs'>
                    Create and manage blog content
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-3 py-4'>
                      <Button className='w-full justify-start'>
                        <Plus className='mr-2 h-4 w-4' />
                        New article
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <BookOpen className='mr-2 h-4 w-4' />
                        Manage categories
                      </Button>
                      <Button variant='outline' className='w-full justify-start'>
                        <FileText className='mr-2 h-4 w-4' />
                        Moderate comments
                      </Button>
                      <Separator className='my-2' />
                      <div className='bg-muted rounded-md p-3'>
                        <div className='text-sm font-medium'>Editorial Calendar</div>
                        <div className='text-muted-foreground mt-1 text-xs'>
                          Next article scheduled: April 15, 2025
                        </div>
                        <Button variant='secondary' size='sm' className='mt-2'>
                          View calendar
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value='feedback' className='h-150'>
            <FeedbackAdmin />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value='analytics' className='m-0 h-full'>
            <div className='grid h-full grid-cols-2 gap-4'>
              <Card className='col-span-2 row-span-1'>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Statistics Overview</CardTitle>
                  <CardDescription className='text-xs'>
                    Site activity for the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex h-40 items-center justify-center'>
                  <div className='space-y-2 text-center'>
                    <BarChart className='text-muted-foreground mx-auto h-8 w-8' />
                    <p className='text-muted-foreground text-xs'>Statistics chart placeholder</p>
                    <Button size='sm'>View detailed stats</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>Performance by Category</CardTitle>
                  <CardDescription className='text-xs'>Download distribution</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-3 py-4'>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Automation</div>
                          <div className='text-xs font-medium'>42%</div>
                        </div>
                        <Progress value={42} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Transport</div>
                          <div className='text-xs font-medium'>27%</div>
                        </div>
                        <Progress value={27} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Decoration</div>
                          <div className='text-xs font-medium'>18%</div>
                        </div>
                        <Progress value={18} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Others</div>
                          <div className='text-xs font-medium'>13%</div>
                        </div>
                        <Progress value={13} className='h-2' />
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-1'>
                  <CardTitle className='text-sm'>New Visits</CardTitle>
                  <CardDescription className='text-xs'>Traffic sources</CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <ScrollArea className='h-64 px-6'>
                    <div className='space-y-3 py-4'>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>CurseForge</div>
                          <div className='text-xs font-medium'>38%</div>
                        </div>
                        <Progress value={38} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Modrinth</div>
                          <div className='text-xs font-medium'>31%</div>
                        </div>
                        <Progress value={31} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>YouTube</div>
                          <div className='text-xs font-medium'>22%</div>
                        </div>
                        <Progress value={22} className='h-2' />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs font-medium'>Discord</div>
                          <div className='text-xs font-medium'>9%</div>
                        </div>
                        <Progress value={9} className='h-2' />
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
