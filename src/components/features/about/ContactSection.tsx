import { ContactCard } from './ContactCard';
import { ContactLink } from './ContactLink';

export function ContactSection() {
  return (
    <section className='mb-12' aria-labelledby='contact'>
      <h2 id='contact' className='mb-6 text-center text-2xl font-semibold'>
        Get in touch!
      </h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <ContactCard
          title='Discord'
          badgeName='discord-plural'
          description='For updates, sneak peeks, and issue reporting.'
          link='https://discord.gg/WSJUCWZD'
        />

        <ContactCard
          title='GitHub'
          badgeName='github-plural'
          description='For the devs out there!'
          link='https://github.com/blueprint-site/blueprint-site.github.io'
        />

        <ContactCard
          title='Email'
          badgeName='my-custom-badge'
          customBadgeUrl='/badges/chat-whit-us-by-email_vector.svg'
          description={
            <>
              Contact us at{' '}
              <ContactLink href='mailto:contact@blueprint-create.com'>contact@blueprint-create.com</ContactLink>
            </>
          }
          link='mailto:contact@blueprint-create.com'
        />
      </div>
    </section>
  );
}
