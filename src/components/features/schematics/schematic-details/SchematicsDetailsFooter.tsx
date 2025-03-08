import { Card, CardFooter } from '@/components/ui/card.tsx';
import SocialSharing from '@/components/features/social-sharing/SocialSharing.tsx';

export interface SchematicsDetailsFooterProps {
  title: string;
}

export const SchematicsDetailsFooter = ({ title = '' }: SchematicsDetailsFooterProps) => {
  return (
    <Card className={'my-8 mt-4'}>
      <CardFooter>
        <SocialSharing title={title} />
      </CardFooter>
    </Card>
  );
};
