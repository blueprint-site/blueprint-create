import React from 'react';
import DevinsBadges from '@/components/utility/DevinsBadges';

type ContactCardProps = {
  title: string;
  badgeName: string;
  description: React.ReactNode;
  customBadgeUrl?: string;
};

export function ContactCard({ title, badgeName, description, customBadgeUrl }: ContactCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg border border-border bg-card/50">
      <h3 className="font-minecraft text-xl font-semibold">{title}</h3>
      <DevinsBadges
        type="compact"
        category={customBadgeUrl ? "custom" : "social"}
        name={badgeName}
        customBadgeUrl={customBadgeUrl}
        format="svg"
      />
      <p className="text-foreground-muted font-minecraft text-center">
        {description}
      </p>
    </div>
  );
}