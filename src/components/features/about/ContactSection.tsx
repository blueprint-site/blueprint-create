import { ContactCard } from './ContactCard';
import { ContactLink } from './ContactLink';
import { useTranslation } from 'react-i18next';

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section className='mb-12' aria-labelledby='contact'>
      <h2 id='contact' className='mb-6 text-center text-2xl font-semibold'>
        {t('about.socialsCard.title')}
      </h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <ContactCard
          title={t('about.socialsCard.card1.title')}
          badgeName='discord-plural'
          description={t('about.socialsCard.card1.description')}
          link='https://discord.gg/WSJUCWZD'
        />

        <ContactCard
          title={t('about.socialsCard.card2.title')}
          badgeName='github-plural'
          description={t('about.socialsCard.card2.description')}
          link='https://github.com/blueprint-site/blueprint-site.github.io'
        />

        <ContactCard
          title={t('about.socialsCard.card3.title')}
          badgeName='my-custom-badge'
          customBadgeUrl='/badges/chat-whit-us-by-email_vector.svg'
          description={
            <>
              {t('about.socialsCard.card3.description')}{' '}
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
