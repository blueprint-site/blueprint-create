// src/components/error/RouteErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Something went wrong';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className='flex min-h-[50vh] items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-4'>
        <Alert variant='destructive' className='border-2'>
          <AlertTitle className='text-xl font-bold'>Application Error</AlertTitle>
          <AlertDescription>
            <div className='text-muted-foreground mt-2 text-sm'>{errorMessage}</div>
            <div className='mt-4 flex gap-2'>
              <Button onClick={() => window.location.reload()} size='sm' variant='outline'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry
              </Button>
              <Button asChild size='sm'>
                <Link to='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Go Home
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
