import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TermsContent from '@/components/legal/TermsContent';
import PrivacyContent from '@/components/legal/PrivacyContent';

const Legal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'terms';

  useEffect(() => {
    // Handle direct navigation to /legal/terms or /legal/privacy
    const pathname = window.location.pathname;
    if (pathname.includes('/legal/terms')) {
      setSearchParams({ tab: 'terms' });
      navigate('/legal?tab=terms', { replace: true });
    } else if (pathname.includes('/legal/privacy')) {
      setSearchParams({ tab: 'privacy' });
      navigate('/legal?tab=privacy', { replace: true });
    } else if (!searchParams.get('tab')) {
      // Default to terms if no tab specified
      setSearchParams({ tab: 'terms' });
    }
  }, [searchParams, setSearchParams, navigate]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
    // Update URL to reflect the tab change
    navigate(`/legal?tab=${value}`, { replace: true });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mx-auto max-w-4xl'>
        <CardContent className='p-6'>
          <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='terms'>Terms of Service</TabsTrigger>
              <TabsTrigger value='privacy'>Privacy Policy</TabsTrigger>
            </TabsList>

            <TabsContent value='terms' className='mt-6'>
              <TermsContent />
            </TabsContent>

            <TabsContent value='privacy' className='mt-6'>
              <PrivacyContent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Legal;
