import React from 'react';
import DevinsBadges from '@/components/utility/DevinsBadges';
import { Card } from '@/components/ui/card';

type ContactCardProps = {
  title: string;
  badgeName: string;
  description: React.ReactNode;
  customBadgeUrl?: string;
  link: string;
};

export function ContactCard({ title, badgeName, description, customBadgeUrl, link }: ContactCardProps) {
  return (
    <Card className='border-border flex flex-col items-center gap-4 rounded-lg border p-4'>
      <h3 className='font-minecraft text-xl font-semibold'>{title}</h3>
      <div onClick={() => window.open(link, '_blank')} className='cursor-pointer'>
        <DevinsBadges
          type='compact'
          category={customBadgeUrl ? 'custom' : 'social'}
          name={badgeName}
          customBadgeUrl={customBadgeUrl}
          format='svg'
        />
      </div>
      <p className='text-foreground-muted font-minecraft text-center'>{description}</p>
    </Card>
  );
}
