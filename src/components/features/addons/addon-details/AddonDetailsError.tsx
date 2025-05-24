import { Card, CardContent } from '@/components/ui/card.tsx';

interface AddonDetailsErrorProps {
  error: { message: string };
}

const AddonDetailsError = ({ error }: AddonDetailsErrorProps) => {
  const errorMessage = error?.message || 'An unexpected error occurred'; // Default value if `message` is missing

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='bg-destructive/10 border-destructive'>
        <CardContent className='p-6'>
          <p className='text-destructive'>{errorMessage}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddonDetailsError;
