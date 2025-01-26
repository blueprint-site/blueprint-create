import ColorsSection from "@/components/Design/Colors";
import ComponentSection from "@/components/Design/Components";
import IconSection from "@/components/Design/Icons";
import TypographySection from "@/components/Design/Typography";
import { Separator } from "@/components/ui/separator";

const DesignSystem = () => {
  return (
    <div className="container mx-auto p-10 space-y-12">
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
