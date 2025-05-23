import SchematicsDetailsHeader from '@/components/features/schematics/schematic-details/SchematicsDetailsHeader.tsx';
import SchematicsDetailsContent from '@/components/features/schematics/schematic-details/SchematicsDetailsContent.tsx';
import SchematicsDetailsFooter from '@/components/features/schematics/schematic-details/SchematicsDetailsFooter.tsx';
import { useParams } from 'react-router';
import { useFetchSchematic } from '@/api/appwrite/useSchematics';

export const SchematicsDetailsMain = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schematic } = useFetchSchematic(id);

  if (!schematic) {
    return (
      <div className='text-foreground-muted flex items-center justify-center p-8'>Loading...</div>
    );
  }

  return (
    <div className='container pb-8'>
      <SchematicsDetailsHeader schematic={schematic} />
      <SchematicsDetailsContent schematic={schematic} />
      <SchematicsDetailsFooter title={schematic.title} />
    </div>
  );
};
