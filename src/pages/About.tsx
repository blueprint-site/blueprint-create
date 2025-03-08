import {
  HeroSection,
  MissionSection,
  ContactSection,
  ContributorsSection,
  useGitHubContributors,
} from '@/components/features/about';
import { HeroLayout, HeroContent, HeroHeader } from '@/layouts/HeroLayout';
import ScrollingAddonBackground from '@/components/common/ScrollingAddonBackground';

export default function About() {
  const { contributors, isLoading, error } = useGitHubContributors();

  return (
    <HeroLayout>
      <HeroHeader>
        <HeroSection>
          <ScrollingAddonBackground />
        </HeroSection>
      </HeroHeader>
      <HeroContent>
        <div className='font-minecraft my-8 text-center text-4xl font-semibold'>About Blueprint</div>
        <MissionSection />
        <ContactSection />
        <ContributorsSection contributors={contributors} isLoading={isLoading} error={error} />
      </HeroContent>
    </HeroLayout>
  );
}
