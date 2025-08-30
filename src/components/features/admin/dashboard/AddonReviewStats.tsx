import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdminAddons } from '@/api/appwrite/useAddons';
import { CheckCircle, Clock, AlertTriangle, Package } from 'lucide-react';

export const AddonReviewStats = () => {
  // Fetch unreviewed addons count
  const { data: unreviewedData } = useAdminAddons(
    { reviewStatus: 'unreviewed' },
    1,
    1 // Only need count, not actual data
  );

  // Fetch total addons count
  const { data: totalData } = useAdminAddons({}, 1, 1);

  const unreviewedCount = unreviewedData?.total || 0;
  const totalCount = totalData?.total || 0;
  const reviewedCount = totalCount - unreviewedCount;
  const reviewProgress = totalCount > 0 ? (reviewedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Package className='h-5 w-5' />
          Addon Review Status
        </CardTitle>
        <CardDescription>Current progress on addon reviews</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Review Progress</span>
          <span className='text-muted-foreground text-sm'>
            {reviewedCount} of {totalCount}
          </span>
        </div>
        <Progress value={reviewProgress} className='h-2' />

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <div>
              <p className='text-sm font-medium'>{reviewedCount}</p>
              <p className='text-muted-foreground text-xs'>Reviewed</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-yellow-500' />
            <div>
              <p className='text-sm font-medium'>{unreviewedCount}</p>
              <p className='text-muted-foreground text-xs'>Pending</p>
            </div>
          </div>
        </div>

        {unreviewedCount > 0 && (
          <div className='pt-2'>
            <Badge
              variant={unreviewedCount > 10 ? 'destructive' : 'secondary'}
              className='w-full justify-center'
            >
              {unreviewedCount > 10 ? (
                <>
                  <AlertTriangle className='mr-1 h-3 w-3' />
                  High Priority: {unreviewedCount} pending reviews
                </>
              ) : (
                `${unreviewedCount} addon${unreviewedCount !== 1 ? 's' : ''} awaiting review`
              )}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
