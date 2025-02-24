import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const UsersStatsDisplayRegistered = () => {
  return (
    <Card className='w-full max-w-sm border border-gray-200 shadow-lg dark:border-gray-700'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-semibold'>Users Registered</CardTitle>
        <CheckCircle className='h-6 w-6 text-green-500' />
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold'></div>
        <div className='text-sm text-gray-500 dark:text-gray-400'>Number of users registered</div>
      </CardContent>
    </Card>
  );
};
