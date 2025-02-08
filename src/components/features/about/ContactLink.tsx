interface ContactLinkProps {
  href: string;
  children: React.ReactNode;
}

export const ContactLink = ({ href, children }: ContactLinkProps) => (
  <a 
    href={href} 
    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    {children}
  </a>
);