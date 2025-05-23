import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TypographySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold'>Heading 1</h1>
          <h2 className='text-3xl font-bold'>Heading 2</h2>
          <h3 className='text-2xl font-bold'>Heading 3</h3>
          <h4 className='text-xl font-bold'>Heading 4</h4>
          <p className='text-base'>Body text</p>
          <p className='text-sm'>Small text</p>
          <p className='text-xs'>Extra small text</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypographySection;
