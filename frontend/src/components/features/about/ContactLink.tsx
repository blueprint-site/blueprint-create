import React from 'react';

interface ContactLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const ContactLink = ({ href, children, className }: ContactLinkProps) => (
  <a
    href={href}
    className={`text-primary focus:ring-primary hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${className}`}
    target='_blank'
    rel='noopener noreferrer'
  >
    {children}
  </a>
);
