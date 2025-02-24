import ColorsSection from '@/components/features/design/Colors';
import ComponentSection from '@/components/features/design/Components';
import IconSection from '@/components/features/design/Icons';
import TypographySection from '@/components/features/design/Typography';
import { Separator } from '@/components/ui/separator';

const DesignSystem = () => {
  return (
    <div className='container mx-auto space-y-12 p-10'>
      <h1>Blueprint Design System</h1>
      <ColorsSection />
      <Separator />
      <TypographySection />
      <Separator />
      <ComponentSection />
      <Separator />
      <IconSection />
    </div>
  );
};

export default DesignSystem;
