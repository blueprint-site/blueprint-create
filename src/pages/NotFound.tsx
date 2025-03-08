import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <div className='space-y-4'>
        <h1 className='text-primary text-6xl font-bold'>404</h1>
        <h2 className='font-minecraft text-2xl'>Page Not Found</h2>
        <div className='text-foreground-muted max-w-lg'>
          <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
          <p>
            If you believe this is a bug email us at{' '}
            <a href='mailto:blueprint-site@proton.me'>blueprint-site@proton.me</a>
          </p>
        </div>
        <Link to='/'>
          <Button className='mt-4'>
            <Home className='mr-2 h-4 w-4' />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
