import { Card, CardContent } from '@/components/ui/card';
import {
  HeroSection,
  MissionSection,
  ContactSection,
  ContributorsSection,
  useGitHubContributors,
} from '@/components/features/about';
import { HeroLayout, HeroContent, HeroHeader } from '@/layouts/HeroLayout';
import ScrollingAddonBackground from '@/components/common/ScrollingAddonBackground';
import { motion } from 'framer-motion';
import { Cog } from 'lucide-react';

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
        <Card className='relative overflow-hidden md:px-8'>
          <CardContent className='p-6'>
            <MissionSection />
            <ContactSection />
            <ContributorsSection contributors={contributors} isLoading={isLoading} error={error} />
          </CardContent>
        </Card>
      </HeroContent>
    </HeroLayout>
  );
}
