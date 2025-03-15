import { ContactCard } from './ContactCard';
import { ContactLink } from './ContactLink';
import { useTranslation } from 'react-i18next';
export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section className='mb-12' aria-labelledby='contact'>
      <h2 id='contact' className='mb-6 text-center text-2xl font-semibold'>
        {t('about.contacts.title')}
      </h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <ContactCard
          title='Discord'
          badgeName='discord-plural'
          description={t('about.contacts.discord.description')}
          link='https://discord.gg/WSJUCWZD'
        />

        <ContactCard
          title='GitHub'
          badgeName='github-plural'
          description={t('about.contacts.github.description')}
          link='https://github.com/blueprint-site/blueprint-site.github.io'
        />

        <ContactCard
          title='Email'
          badgeName='my-custom-badge'
          customBadgeUrl='/badges/chat-whit-us-by-email_vector.svg'
          description={
            <>
              {t('about.contacts.email.description')}{' '}
              <ContactLink href='mailto:contact@blueprint-create.com'>
                contact@blueprint-create.com
              </ContactLink>
            </>
          }
          link='mailto:contact@blueprint-create.com'
        />
      </div>
    </section>
  );
}
