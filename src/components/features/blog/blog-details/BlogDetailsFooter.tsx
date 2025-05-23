import { Card, CardFooter } from '@/components/ui/card.tsx';
import SocialSharing from '@/components/features/social-sharing/SocialSharing.tsx';

export interface BlogDetailsFooterProps {
  title: string;
  authors: string[];
  createdAt: string;
}

export const BlogDetailsFooter = ({
  authors = [],
  title = '',
  createdAt = '',
}: BlogDetailsFooterProps) => {
  const authorsArray = Array.isArray(authors) ? authors : [];
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString();
  return (
    <Card className='m-2 my-2'>
      <CardFooter>
        <div className='mt-2 flex w-full items-center justify-between'>
          <div>
            Created by
            {authorsArray.map((author: string, index: number) => (
              <div key={index}>{author}</div>
            ))}
          </div>
          <div className={'font-small text-foreground-muted'}>published {formattedDate}</div>

          <SocialSharing title={title} details={false} />
        </div>
      </CardFooter>
    </Card>
  );
};
