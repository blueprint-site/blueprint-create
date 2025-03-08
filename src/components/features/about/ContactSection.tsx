import React from 'react';
import { ContactCard } from './ContactCard';
import { ContactLink } from './ContactLink';

export function ContactSection() {
  return (
    <section className="mb-12" aria-labelledby="contact">
      <h2 id="contact" className="text-2xl font-semibold text-center mb-6">
        Get in touch!
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ContactCard 
          title="Discord" 
          badgeName="discord-plural" 
          description="For updates, sneak peeks, and issue reporting." 
        />
        
        <ContactCard 
          title="GitHub" 
          badgeName="github-plural" 
          description="For the devs out there!" 
        />
        
        <ContactCard 
          title="Email" 
          badgeName="my-custom-badge" 
          customBadgeUrl="/badges/chat-whit-us-by-email_vector.svg"
          description={
            <>
              Contact us at{' '}
              <ContactLink href="mailto:blueprint-site@proton.me">
                blueprint-site@proton.me
              </ContactLink>
            </>
          } 
        />
      </div>
    </section>
  );
}