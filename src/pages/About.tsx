import {
  HeroSection,
  MissionSection,
  ContactSection,
  ContributorsSection,
} from '@/components/features/about';
import { HeroLayout, HeroContent, HeroHeader } from '@/layouts/HeroLayout';
import ScrollingAddonBackground from '@/components/common/ScrollingAddonBackground';
import { useTranslation } from 'react-i18next';
import { useGitHubContributors } from '@/api';
import { ConamiCodeEasterEgg } from '@/components/features/easter-eggs/KonamiCodeEasterEgg';

export default function About() {
  const { contributors, isLoading, error } = useGitHubContributors();
  const { t } = useTranslation();
  return (
    <HeroLayout>
      <ConamiCodeEasterEgg />
      <HeroHeader>
        <HeroSection>
          <ScrollingAddonBackground />
        </HeroSection>
      </HeroHeader>
      <HeroContent>
        <div className='font-minecraft my-8 text-center text-4xl font-semibold'>
          {t('about.mainTitle')}
        </div>
        <MissionSection />
        <ContactSection />
        <ContributorsSection contributors={contributors} isLoading={isLoading} error={error} />
      </HeroContent>
    </HeroLayout>
  );
}
