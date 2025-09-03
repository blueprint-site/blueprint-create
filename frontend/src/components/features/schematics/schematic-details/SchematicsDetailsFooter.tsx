import { Card, CardFooter } from '@/components/ui/card.tsx';
import SocialSharing from '@/components/features/social-sharing/SocialSharing.tsx';

export interface SchematicsDetailsFooterProps {
  title: string;
}

export const SchematicsDetailsFooter = ({ title = '' }: SchematicsDetailsFooterProps) => {
  return (
    <Card className='mt-4 p-4'>
      <CardFooter className='flex items-center gap-4'>
        <SocialSharing title={title} />
      </CardFooter>
    </Card>
  );
};
