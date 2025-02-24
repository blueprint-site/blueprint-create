import React from 'react';

interface ContactLinkProps {
  href: string;
  children: React.ReactNode;
}

export const ContactLink = ({ href, children }: ContactLinkProps) => (
  <a
    href={href}
    className='text-primary focus:ring-primary hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-hidden'
    target='_blank'
    rel='noopener noreferrer'
  >
    {children}
  </a>
);
